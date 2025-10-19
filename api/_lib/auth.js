function isAuthorizedAdmin(req) {
  const ADMIN_KEY = process.env.ADMIN_KEY;
  const isDev = (process.env.NODE_ENV || '').toLowerCase() !== 'production';
  // In production, ADMIN_KEY must be set and validated. In dev, allow if not configured.
  if (!ADMIN_KEY) return isDev ? true : false;

  // Prefer header-only authentication
  const headerKey = req.headers['x-admin-key'];
  if (headerKey === ADMIN_KEY) return true;

  // Allow Basic auth (admin:ADMIN_KEY) as a fallback
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


