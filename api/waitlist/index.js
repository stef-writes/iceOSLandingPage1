const { URL } = require('url');
const { STATUSES, FLAGS } = require('../_lib/constants');
const { logEvent } = require('../_lib/log');

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_SERVICE_ROLE = process.env.SUPABASE_SERVICE_ROLE || process.env.SUPABASE_SERVICE_ROLE_KEY;
const REST_URL = `${SUPABASE_URL}/rest/v1`;
const TABLE = 'waitlist_submissions';
const ADMIN_KEY = process.env.ADMIN_KEY;

function isRateLimited(ip, bucket) {
  const windowMs = 60 * 1000; // 1 minute
  const max = 5;
  const now = Date.now();
  const arr = (bucket[ip] || []).filter((t) => now - t < windowMs);
  if (arr.length >= max) return true;
  arr.push(now);
  bucket[ip] = arr;
  return false;
}

// Keep a simple in-memory bucket per lambda instance
const rateBucket = {};

function setCommonHeaders(res) {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
  res.setHeader('Permissions-Policy', 'geolocation=(), microphone=(), camera=()');
  res.setHeader('Content-Security-Policy', "default-src 'none'");
  res.setHeader('Content-Type', 'application/json; charset=utf-8');
  const origin = process.env.CORS_ORIGIN || '*';
  res.setHeader('Access-Control-Allow-Origin', origin);
  res.setHeader('Vary', 'Origin');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PATCH,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, X-Admin-Key, Authorization');
}

module.exports = async (req, res) => {
  setCommonHeaders(res);
  if (req.method === 'OPTIONS') {
    res.status(204).end();
    return;
  }
  // Helper to check simple admin access via header or query string if ADMIN_KEY is configured
  function isAuthorizedAdmin(req) {
    if (!ADMIN_KEY) return true; // allow when not configured (e.g., local dev)
    const headerKey = req.headers['x-admin-key'];
    try {
      const url = new URL(req.url, 'http://localhost');
      const queryKey = url.searchParams.get('key');
      return headerKey === ADMIN_KEY || queryKey === ADMIN_KEY;
    } catch {
      return headerKey === ADMIN_KEY;
    }
  }

  if (req.method === 'GET') {
    if (!isAuthorizedAdmin(req)) {
      res.status(401).json({ detail: 'Unauthorized' });
      return;
    }
    if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE) {
      // Dev mock: return in-memory entries if Supabase not configured
      try {
        const { all } = require('../_lib/mockStore');
        const rows = all();
        res.status(200).json(rows);
      } catch {
        res.status(500).json({ detail: 'Backend not configured' });
      }
      return;
    }
    try {
      const url = new URL(req.url, 'http://localhost');
      const status = url.searchParams.get('status');
      const limit = Math.min(parseInt(url.searchParams.get('limit') || '500', 10) || 500, 10000);
      let query = `${REST_URL}/${TABLE}?select=id,email,role,usecase,created_at,status,source,utm_source,utm_medium,utm_campaign,utm_term,utm_content,ip,user_agent&order=created_at.desc&limit=${limit}`;
      if (status) query += `&status=eq.${encodeURIComponent(status)}`;
      const resp = await fetch(query, {
        headers: {
          'apikey': SUPABASE_SERVICE_ROLE,
          'Authorization': `Bearer ${SUPABASE_SERVICE_ROLE}`,
        }
      });
      if (!resp.ok) {
        const text = await resp.text();
        res.status(500).json({ detail: `Fetch failed: ${text}` });
        return;
      }
      const rows = await resp.json();
      res.status(200).json(rows);
    } catch (e) {
      res.status(500).json({ detail: 'Unexpected error' });
    }
    return;
  }

  if (req.method === 'PATCH') {
    // Admin actions: set_status, resend_verification
    if (!isAuthorizedAdmin(req)) {
      res.status(401).json({ detail: 'Unauthorized' });
      return;
    }
    if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE) {
      res.status(500).json({ detail: 'Backend not configured' });
      return;
    }
    try {
      const body = req.body || {};
      const { id, action, value } = body;
      if (!id || !action) {
        res.status(400).json({ detail: 'Missing id or action' });
        return;
      }
      if (action === 'set_status') {
        const resp = await fetch(`${REST_URL}/${TABLE}?id=eq.${encodeURIComponent(id)}`, {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
            'apikey': SUPABASE_SERVICE_ROLE,
            'Authorization': `Bearer ${SUPABASE_SERVICE_ROLE}`,
            'Prefer': 'return=representation'
          },
          body: JSON.stringify({ status: value })
        });
        if (!resp.ok) {
          const text = await resp.text();
          res.status(400).json({ detail: text });
          return;
        }
        const rows = await resp.json();
        const row = Array.isArray(rows) ? rows[0] : rows;
        logEvent('waitlist_status_changed', { id: row.id, email: row.email, status: row.status });
        res.status(200).json(row);
        return;
      }
      if (action === 'resend_verification') {
        // Recreate a verify token and expiry
        const token = Math.random().toString(36).slice(2) + Math.random().toString(36).slice(2);
        const expires = new Date(Date.now() + (parseInt(process.env.VERIFY_TOKEN_TTL_HOURS || '72', 10) * 3600 * 1000)).toISOString();
        const resp = await fetch(`${REST_URL}/${TABLE}?id=eq.${encodeURIComponent(id)}`, {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
            'apikey': SUPABASE_SERVICE_ROLE,
            'Authorization': `Bearer ${SUPABASE_SERVICE_ROLE}`,
            'Prefer': 'return=representation'
          },
          body: JSON.stringify({ verify_token: token, verify_expires_at: expires, status: STATUSES.PENDING })
        });
        if (!resp.ok) {
          const text = await resp.text();
          res.status(400).json({ detail: text });
          return;
        }
        const rows = await resp.json();
        const row = Array.isArray(rows) ? rows[0] : rows;
        logEvent('waitlist_verification_resent', { id: row.id, email: row.email });
        res.status(200).json({ ok: true, id: row.id, email: row.email, verify_token: token });
        return;
      }
      res.status(400).json({ detail: 'Unknown action' });
    } catch (e) {
      res.status(500).json({ detail: 'Unexpected error' });
    }
    return;
  }

  if (req.method !== 'POST') {
    res.status(405).json({ detail: 'Method Not Allowed' });
    return;
  }

  if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE) {
    // Dev mock insert
    try {
      const { add, findByEmail } = require('../_lib/mockStore');
      const input = req.body || {};
      const whatBuild = input.what_build || input.usecase || '';
      const rawKeywords = Array.isArray(input.keywords) ? input.keywords : String(input.keywords || '').split(',');
      const stopwords = new Set(['the','and','for','with','that','this','from','into','your','you','are','our','their','about','into','over','under','into','but','not','more','less','than','then','like','just','have','has','will','can','could','would','should','to','of','in','on','at','by','a','an','or','as','be','is','it']);
      const autoKeywords = String(whatBuild)
        .toLowerCase()
        .replace(/[^a-z0-9\s,]/g, ' ')
        .split(/[,\s]+/)
        .filter(Boolean)
        .filter((w) => w.length >= 3 && !stopwords.has(w));
      const kw = Array.from(new Set([...rawKeywords.map(String).map((s)=>s.trim().toLowerCase()).filter(Boolean), ...autoKeywords])).slice(0, 20);
      if (findByEmail(input.email)) {
        res.status(409).json({ detail: "You're already on the waitlist." });
        return;
      }
      const row = add({
        id: Math.random().toString(36).slice(2),
        email: input.email,
        role: input.role || null,
        usecase: whatBuild || null,
        keywords: kw,
        created_at: new Date().toISOString(),
        status: 'pending',
        source: 'mock',
        utm_source: null,
        utm_medium: null,
        utm_campaign: null,
        utm_term: null,
        utm_content: null,
      });
      res.status(201).json(row);
    } catch {
      res.status(500).json({ detail: 'Backend not configured' });
    }
    return;
  }

  const ip = (req.headers['x-forwarded-for'] || '').split(',')[0].trim() || req.socket?.remoteAddress || 'unknown';
  if (isRateLimited(ip, rateBucket)) {
    res.status(429).json({ detail: 'Too many requests. Please try again shortly.' });
    return;
  }

  const input = req.body || {};
  const honeypot = input.hp;
  if (honeypot) {
    res.status(201).json({
      id: 'fake',
      email: input.email,
      role: input.role || null,
      usecase: input.usecase || null,
      created_at: new Date().toISOString(),
    });
    return;
  }

  const requireConsent = String(process.env.REQUIRE_CONSENT || 'false').toLowerCase() === 'true';
  if (requireConsent && !input.consent) {
    res.status(400).json({ detail: 'Consent required.' });
    return;
  }

  const requireCaptcha = String(process.env.REQUIRE_CAPTCHA || 'false').toLowerCase() === 'true';
  const turnstileSecret = process.env.TURNSTILE_SECRET_KEY;
  if (requireCaptcha) {
    if (!(turnstileSecret && input.captcha_token)) {
      res.status(400).json({ detail: 'Captcha required.' });
      return;
    }
    try {
      const verify = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams({ secret: turnstileSecret, response: input.captcha_token, remoteip: ip }),
      });
      const json = await verify.json();
      if (!json.success) {
        res.status(400).json({ detail: 'Captcha verification failed.' });
        return;
      }
    } catch (e) {
      res.status(400).json({ detail: 'Captcha verification failed.' });
      return;
    }
  }

  const referer = req.headers['referer'] || '';
  let source = 'landing';
  const utm = { utm_source: null, utm_medium: null, utm_campaign: null, utm_term: null, utm_content: null };
  try {
    const u = new URL(referer);
    source = u.searchParams.get('source') || source;
    Object.keys(utm).forEach((k) => (utm[k] = u.searchParams.get(k)));
  } catch {}

  const payload = {
    email: input.email,
    usecase: input.usecase || null,
    source,
    utm_source: input.utm_source ?? utm.utm_source,
    utm_medium: input.utm_medium ?? utm.utm_medium,
    utm_campaign: input.utm_campaign ?? utm.utm_campaign,
    utm_term: input.utm_term ?? utm.utm_term,
    utm_content: input.utm_content ?? utm.utm_content,
    consent: input.consent == null ? true : !!input.consent,
    ip,
    user_agent: req.headers['user-agent'],
  };

  try {
    // If verification is required, generate a simple token and set status pending, else optionally auto-activate
    let verifyToken = null;
    let status = STATUSES.PENDING;
    if (FLAGS.REQUIRE_VERIFICATION) {
      verifyToken = Math.random().toString(36).slice(2) + Math.random().toString(36).slice(2);
      payload.verify_token = verifyToken;
      payload.verify_expires_at = new Date(Date.now() + (parseInt(process.env.VERIFY_TOKEN_TTL_HOURS || '72', 10) * 3600 * 1000)).toISOString();
      status = STATUSES.PENDING;
    } else if (FLAGS.AUTO_ACTIVATE) {
      status = STATUSES.ACTIVE;
    }
    payload.status = status;

    const resp = await fetch(`${REST_URL}/${TABLE}?select=id,email,role,usecase,created_at,status&on_conflict=email`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'apikey': SUPABASE_SERVICE_ROLE,
        'Authorization': `Bearer ${SUPABASE_SERVICE_ROLE}`,
        'Prefer': 'resolution=ignore-duplicates,return=representation'
      },
      body: JSON.stringify(payload),
    });

    if (resp.status === 409) {
      res.status(409).json({ detail: "You're already on the waitlist." });
      return;
    }
    if (!resp.ok) {
      const text = await resp.text();
      res.status(500).json({ detail: `Insert failed: ${text}` });
      return;
    }
    const data = await resp.json();
    const row = Array.isArray(data) ? data[0] : data;
    logEvent('waitlist_submitted', { id: row.id, email: row.email, status: row.status });
    res.status(201).json(row);
  } catch (e) {
    res.status(500).json({ detail: 'Unexpected error' });
  }
};


