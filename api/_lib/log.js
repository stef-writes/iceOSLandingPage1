function logEvent(event, payload = {}) {
  try {
    const safe = { ...payload };
    delete safe.token;
    delete safe.verify_token;
    delete safe.invite_token;
    console.log(JSON.stringify({ ts: new Date().toISOString(), event, ...safe }));
  } catch (e) {
    console.log(`[event ${event}]`, payload);
  }
}

module.exports = { logEvent };


