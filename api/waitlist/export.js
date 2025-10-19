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
    // Dev mock export
    try {
      const { all } = require('../_lib/mockStore');
      const rows = all();
      const header = 'id,email,role,usecase,created_at\n';
      const csv = rows.map(d => [
        d.id,
        d.email,
        d.role || '',
        String(d.usecase || '').replace(/\n/g, ' '),
        d.created_at || ''
      ].join(',')).join('\n');
      const out = header + csv + '\n';
      res.setHeader('Content-Type', 'text/csv');
      res.setHeader('Content-Disposition', 'attachment; filename=waitlist.csv');
      res.status(200).send(out);
    } catch (e) {
      res.status(500).send('Backend not configured');
    }
    return;
  }
  try {
    const resp = await fetch(`${REST_URL}/${TABLE}?select=id,email,role,usecase,created_at&order=created_at.desc&limit=10000`, {
      headers: {
        'apikey': SUPABASE_SERVICE_ROLE,
        'Authorization': `Bearer ${SUPABASE_SERVICE_ROLE}`,
      }
    });
    if (!resp.ok) {
      const text = await resp.text();
      res.status(500).send(`Export fetch failed: ${text}`);
      return;
    }
    const rows = await resp.json();
    const header = 'id,email,role,usecase,keywords,created_at\n';
    const csv = rows.map(d => [
      d.id,
      d.email,
      d.role || '',
      String(d.usecase || '').replace(/\n/g, ' '),
      Array.isArray(d.keywords) ? d.keywords.join('|') : '',
      d.created_at || ''
    ].join(',')).join('\n');
    const out = header + csv + '\n';
    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment; filename=waitlist.csv');
    res.status(200).send(out);
  } catch (e) {
    res.status(500).send('Unexpected error');
  }
};


