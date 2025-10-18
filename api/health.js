module.exports = async (req, res) => {
  res.setHeader('Content-Type', 'application/json; charset=utf-8');
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.status(200).json({ ok: true, service: 'albus-landing', time: new Date().toISOString() });
};
