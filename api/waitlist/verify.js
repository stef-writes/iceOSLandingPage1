const { STATUSES } = require('../_lib/constants');
const { logEvent } = require('../_lib/log');

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_SERVICE_ROLE = process.env.SUPABASE_SERVICE_ROLE || process.env.SUPABASE_SERVICE_ROLE_KEY;
const REST_URL = `${SUPABASE_URL}/rest/v1`;
const TABLE = 'waitlist_submissions';

module.exports = async (req, res) => {
  if (req.method !== 'GET') {
    res.status(405).send('Method Not Allowed');
    return;
  }
  if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE) {
    // Dev mock verify by token
    try {
      const { all, updateById } = require('../_lib/mockStore');
      const url = new URL(req.url, 'http://localhost');
      const token = url.searchParams.get('token');
      if (!token) {
        res.status(400).send('Missing token');
        return;
      }
      const candidate = all().find((e) => e.verify_token === token);
      if (!candidate) {
        res.status(400).send('Invalid or expired token');
        return;
      }
      updateById(candidate.id, { verify_token: null, status: STATUSES.VERIFIED, verified_at: new Date().toISOString() });
      res.status(200).json({ ok: true, id: candidate.id, email: candidate.email, status: STATUSES.VERIFIED });
    } catch (e) {
      res.status(500).send('Backend not configured');
    }
    return;
  }
  try {
    const url = new URL(req.url, 'http://localhost');
    const token = url.searchParams.get('token');
    if (!token) {
      res.status(400).send('Missing token');
      return;
    }
    // mark verified where token matches and not expired
    const nowIso = new Date().toISOString();
    // Supabase REST can't do complex comparisons with AND easily via PostgREST query here;
    // We'll rely on token equality then double-check expiry after fetching
    const selectResp = await fetch(`${REST_URL}/${TABLE}?select=*&verify_token=eq.${encodeURIComponent(token)}`, {
      headers: {
        'apikey': SUPABASE_SERVICE_ROLE,
        'Authorization': `Bearer ${SUPABASE_SERVICE_ROLE}`,
      }
    });
    if (!selectResp.ok) {
      const text = await selectResp.text();
      res.status(400).send(`Invalid token: ${text}`);
      return;
    }
    const found = await selectResp.json();
    const candidate = Array.isArray(found) ? found[0] : found;
    if (!candidate) {
      res.status(400).send('Invalid or expired token');
      return;
    }
    if (candidate.verify_expires_at && candidate.verify_expires_at < nowIso) {
      res.status(400).send('Token expired');
      return;
    }
    const resp = await fetch(`${REST_URL}/${TABLE}?id=eq.${encodeURIComponent(candidate.id)}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'apikey': SUPABASE_SERVICE_ROLE,
        'Authorization': `Bearer ${SUPABASE_SERVICE_ROLE}`,
        'Prefer': 'return=representation'
      },
      body: JSON.stringify({ verify_token: null, status: STATUSES.VERIFIED, verified_at: nowIso })
    });
    if (!resp.ok) {
      const text = await resp.text();
      res.status(400).send(`Invalid token: ${text}`);
      return;
    }
    const rows = await resp.json();
    const row = Array.isArray(rows) ? rows[0] : rows;
    if (!row) {
      res.status(400).send('Invalid or expired token');
      return;
    }
    logEvent('waitlist_verified', { id: row.id, email: row.email });
    res.status(200).json({ ok: true, id: row.id, email: row.email, status: row.status });
  } catch (e) {
    res.status(500).send('Unexpected error');
  }
};


