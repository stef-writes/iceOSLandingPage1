const { STATUSES, TOKEN_TTLS, FLAGS } = require('../_lib/constants');
const nodeCrypto = require('crypto');
const { isAuthorizedAdmin } = require('../_lib/auth');
const { logEvent } = require('../_lib/log');
const { sendEmail } = require('../_lib/email');

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_SERVICE_ROLE = process.env.SUPABASE_SERVICE_ROLE || process.env.SUPABASE_SERVICE_ROLE_KEY;
const REST_URL = `${SUPABASE_URL}/rest/v1`;
const TABLE = 'waitlist_submissions';

function genToken() {
  return nodeCrypto.randomBytes(16).toString('hex');
}

module.exports = async (req, res) => {
  if (req.method !== 'POST') {
    res.status(405).send('Method Not Allowed');
    return;
  }
  if (!isAuthorizedAdmin(req)) {
    res.status(401).send('Unauthorized');
    return;
  }
  if (!FLAGS.ALLOW_INVITES) {
    res.status(403).send('Invites are disabled');
    return;
  }
  if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE) {
    // Dev mock: mark invited
    try {
      const { findByEmail, updateById } = require('../_lib/mockStore');
      const input = req.body || {};
      const row = findByEmail(input.email);
      if (!row) {
        res.status(404).send('Email not found');
        return;
      }
      const token = genToken();
      updateById(row.id, { invite_token: token, status: STATUSES.INVITED });
      const origin = 'http://localhost:5173';
      const activateLink = `${origin}/activate?token=${encodeURIComponent(token)}`;
      res.status(200).json({ ok: true, id: row.id, email: row.email, invite_link: activateLink });
    } catch (e) {
      res.status(500).send('Backend not configured');
    }
    return;
  }
  try {
    const input = req.body || {};
    const email = input.email;
    if (!email) {
      res.status(400).send('Missing email');
      return;
    }
    const token = genToken();
    const expires = new Date(Date.now() + TOKEN_TTLS.INVITE_DAYS * 24 * 60 * 60 * 1000).toISOString();
    const url = new URL(req.headers['referer'] || `http://${req.headers['x-forwarded-host'] || 'localhost'}`);
    const origin = `${url.protocol}//${url.host}`;
    const activateLink = `${origin}/activate?token=${encodeURIComponent(token)}`;

    const resp = await fetch(`${REST_URL}/${TABLE}?email=eq.${encodeURIComponent(email)}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'apikey': SUPABASE_SERVICE_ROLE,
        'Authorization': `Bearer ${SUPABASE_SERVICE_ROLE}`,
        'Prefer': 'return=representation'
      },
      body: JSON.stringify({ invite_token: token, invite_expires_at: expires, status: STATUSES.INVITED })
    });
    if (!resp.ok) {
      const text = await resp.text();
      res.status(400).send(`Invite failed: ${text}`);
      return;
    }
    const rows = await resp.json();
    const row = Array.isArray(rows) ? rows[0] : rows;
    if (!row) {
      res.status(404).send('Email not found');
      return;
    }
    logEvent('waitlist_invited', { id: row.id, email: row.email });
    // Send email (simulated if EMAIL_ENABLED=false)
    await sendEmail('invite', {
      from: process.env.EMAIL_FROM || 'team@localhost',
      to: row.email,
      subject: 'Your invite to try the app',
      text: `You're invited! Activate your access: ${activateLink}`,
    });
    res.status(200).json({ ok: true, id: row.id, email: row.email, invite_link: activateLink });
  } catch (e) {
    res.status(500).send('Unexpected error');
  }
};


