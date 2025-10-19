function isAuthorizedAdmin(req) {
  const ADMIN_KEY = process.env.ADMIN_KEY;
  if (!ADMIN_KEY) return true; // allow when not configured (local/dev)
  const headerKey = req.headers['x-admin-key'];
  if (headerKey === ADMIN_KEY) return true;
  try {
    const url = new URL(req.url, 'http://localhost');
    const queryKey = url.searchParams.get('key');
    if (queryKey === ADMIN_KEY) return true;
  } catch {}
  const auth = req.headers['authorization'] || '';
  if (auth.startsWith('Basic ')) {
    try {
      const decoded = Buffer.from(auth.slice(6), 'base64').toString('utf8');
      const [user, pass] = decoded.split(':');
      if ((user || '').toLowerCase() === 'admin' && pass === ADMIN_KEY) return true;
    } catch {}
  }
  return false;
}

module.exports = { isAuthorizedAdmin };


