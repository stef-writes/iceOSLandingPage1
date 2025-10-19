const { FLAGS } = require('./constants');

async function sendEmail(type, payload) {
  if (!FLAGS.EMAIL_ENABLED) {
    console.log(JSON.stringify({ ts: new Date().toISOString(), email_simulated: true, type, payload }));
    return { ok: true, simulated: true };
  }
  const RESEND_API_KEY = process.env.RESEND_API_KEY;
  if (!RESEND_API_KEY) {
    console.warn('EMAIL_ENABLED=true but RESEND_API_KEY not set; simulating');
    return { ok: true, simulated: true };
  }
  // Minimal Resend example. Keep simple; callers pass subject/text/html/to.
  try {
    const resp = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${RESEND_API_KEY}`,
      },
      body: JSON.stringify(payload),
    });
    const ok = resp.ok;
    const json = await resp.json().catch(() => ({}));
    if (!ok) throw new Error(`Resend error: ${resp.status} ${JSON.stringify(json)}`);
    return { ok: true, id: json.id };
  } catch (e) {
    console.error('sendEmail failed', e.message);
    return { ok: false, error: e.message };
  }
}

module.exports = { sendEmail };


