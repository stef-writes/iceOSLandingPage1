const { STATUSES } = require('../_lib/constants');
const { logEvent } = require('../_lib/log');

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_SERVICE_ROLE = process.env.SUPABASE_SERVICE_ROLE || process.env.SUPABASE_SERVICE_ROLE_KEY;
const REST_URL = `${SUPABASE_URL}/rest/v1`;
const TABLE = 'waitlist_submissions';

module.exports = async (req, res) => {
  if (req.method !== 'POST') {
    res.status(405).send('Method Not Allowed');
    return;
  }
  if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE) {
    // Dev mock activate by token
    try {
      const { all, updateById } = require('../_lib/mockStore');
      const input = req.body || {};
      const token = input.token;
      if (!token) {
        res.status(400).send('Missing token');
        return;
      }
      const candidate = all().find((e) => e.invite_token === token);
      if (!candidate) {
        res.status(400).send('Invalid or expired token');
        return;
      }
      updateById(candidate.id, { invite_token: null, status: STATUSES.ACTIVE });
      res.status(200).json({ ok: true, id: candidate.id, email: candidate.email, status: STATUSES.ACTIVE });
    } catch (e) {
      res.status(500).send('Backend not configured');
    }
    return;
  }
  try {
    const input = req.body || {};
    const token = input.token;
    if (!token) {
      res.status(400).send('Missing token');
      return;
    }
    // consume invite token -> status active
    // fetch to check expiry then patch
    const sel = await fetch(`${REST_URL}/${TABLE}?select=*&invite_token=eq.${encodeURIComponent(token)}`, {
      headers: {
        'apikey': SUPABASE_SERVICE_ROLE,
        'Authorization': `Bearer ${SUPABASE_SERVICE_ROLE}`,
      }
    });
    if (!sel.ok) {
      const text = await sel.text();
      res.status(400).send(`Activation failed: ${text}`);
      return;
    }
    const rows0 = await sel.json();
    const candidate = Array.isArray(rows0) ? rows0[0] : rows0;
    if (!candidate) {
      res.status(400).send('Invalid or expired token');
      return;
    }
    if (candidate.invite_expires_at && new Date(candidate.invite_expires_at) < new Date()) {
      res.status(400).send('Invite expired');
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
      body: JSON.stringify({ invite_token: null, status: STATUSES.ACTIVE })
    });
    if (!resp.ok) {
      const text = await resp.text();
      res.status(400).send(`Activation failed: ${text}`);
      return;
    }
    const rows = await resp.json();
    const row = Array.isArray(rows) ? rows[0] : rows;
    if (!row) {
      res.status(400).send('Invalid or expired token');
      return;
    }
    logEvent('waitlist_activated', { id: row.id, email: row.email });
    res.status(200).json({ ok: true, id: row.id, email: row.email, status: row.status });
  } catch (e) {
    res.status(500).send('Unexpected error');
  }
};


