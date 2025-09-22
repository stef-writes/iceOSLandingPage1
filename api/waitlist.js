const { URL } = require('url');

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_SERVICE_ROLE = process.env.SUPABASE_SERVICE_ROLE || process.env.SUPABASE_SERVICE_ROLE_KEY;
const REST_URL = `${SUPABASE_URL}/rest/v1`;
const TABLE = 'waitlist_submissions';

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

module.exports = async (req, res) => {
  if (req.method === 'OPTIONS') {
    res.status(204).end();
    return;
  }
  if (req.method !== 'POST') {
    res.status(405).json({ detail: 'Method Not Allowed' });
    return;
  }

  if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE) {
    res.status(500).json({ detail: 'Backend not configured' });
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
    const resp = await fetch(`${REST_URL}/${TABLE}?select=id,email,role,usecase,created_at&on_conflict=email`, {
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
    res.status(201).json(row);
  } catch (e) {
    res.status(500).json({ detail: 'Unexpected error' });
  }
};


