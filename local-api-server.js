const http = require('http');
const { URL } = require('url');

// Import API handlers
const apiRoot = require('./api/index.js');
const health = require('./api/health.js');
const waitlist = require('./api/waitlist/index.js');
const exportCsv = require('./api/waitlist/export.js');
const verify = require('./api/waitlist/verify.js');
const invite = require('./api/waitlist/invite.js');
const activate = require('./api/waitlist/activate.js');
const mockSeed = require('./api/mock/seed.js');
const mockClear = require('./api/mock/clear.js');

const PORT = parseInt(process.env.PORT || '3000', 10);
const FRONTEND_ORIGIN = process.env.FRONTEND_ORIGIN || process.env.CORS_ORIGIN || '';

function setCors(res) {
  const isProd = (process.env.NODE_ENV || '').toLowerCase() === 'production';
  const origin = FRONTEND_ORIGIN || (isProd ? '' : '*');
  res.setHeader('Access-Control-Allow-Origin', origin || '*');
  res.setHeader('Vary', 'Origin');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PATCH,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, X-Admin-Key, Authorization');
}

function readBody(req) {
  return new Promise((resolve) => {
    const chunks = [];
    req.on('data', (c) => chunks.push(c));
    req.on('end', () => {
      const raw = Buffer.concat(chunks).toString('utf8');
      try {
        if ((req.headers['content-type'] || '').includes('application/json')) {
          req.body = raw ? JSON.parse(raw) : {};
        } else {
          req.body = raw;
        }
      } catch {
        req.body = {};
      }
      resolve();
    });
  });
}

function wrapResponse(res) {
  // Add minimal Express-like helpers so handlers work locally
  res.status = function (code) {
    res.statusCode = code;
    return {
      json: (obj) => {
        if (!res.getHeader('Content-Type')) {
          res.setHeader('Content-Type', 'application/json; charset=utf-8');
        }
        res.end(JSON.stringify(obj));
      },
      send: (body) => {
        if (typeof body === 'object') {
          if (!res.getHeader('Content-Type')) {
            res.setHeader('Content-Type', 'application/json; charset=utf-8');
          }
          res.end(JSON.stringify(body));
        } else {
          res.end(String(body));
        }
      },
      end: () => res.end(),
    };
  };
  res.json = function (obj) {
    res.setHeader('Content-Type', 'application/json; charset=utf-8');
    res.end(JSON.stringify(obj));
  };
  res.send = function (body) {
    if (typeof body === 'object') {
      res.setHeader('Content-Type', 'application/json; charset=utf-8');
      res.end(JSON.stringify(body));
    } else {
      res.end(String(body));
    }
  };
  return res;
}

const server = http.createServer(async (req, res0) => {
  const res = wrapResponse(res0);
  setCors(res);
  const url = new URL(req.url, `http://localhost:${PORT}`);
  const { pathname } = url;

  if (req.method === 'OPTIONS') {
    res.statusCode = 204;
    res.end();
    return;
  }

  // Map routes
  try {
    if (pathname === '/api/health') return health(req, res);
    if (pathname === '/api') return apiRoot(req, res);
    if (pathname === '/api/waitlist') {
      await readBody(req);
      return waitlist(req, res);
    }
    if (pathname === '/api/waitlist/export.csv') return exportCsv(req, res);
    if (pathname === '/api/waitlist/verify') return verify(req, res);
    if (pathname === '/api/waitlist/invite') {
      await readBody(req);
      return invite(req, res);
    }
    if (pathname === '/api/waitlist/activate') {
      await readBody(req);
      return activate(req, res);
    }
    if (pathname === '/api/mock/seed') {
      await readBody(req);
      return mockSeed(req, res);
    }
    if (pathname === '/api/mock/clear') {
      await readBody(req);
      return mockClear(req, res);
    }

    res.statusCode = 404;
    res.setHeader('Content-Type', 'text/plain; charset=utf-8');
    res.end('Not Found');
  } catch (e) {
    res.statusCode = 500;
    res.setHeader('Content-Type', 'text/plain; charset=utf-8');
    res.end('Server Error');
  }
});

server.listen(PORT, () => {
  console.log(`Local API server listening on http://localhost:${PORT}`);
});


