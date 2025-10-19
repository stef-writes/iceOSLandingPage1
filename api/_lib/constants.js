const STATUSES = Object.freeze({
  PENDING: 'pending',
  VERIFIED: 'verified',
  INVITED: 'invited',
  ACTIVE: 'active',
  ARCHIVED: 'archived',
});

function readBool(name, def = false) {
  const v = String(process.env[name] || '').toLowerCase().trim();
  if (v === 'true' || v === '1' || v === 'yes') return true;
  if (v === 'false' || v === '0' || v === 'no') return false;
  return !!def;
}

const FLAGS = Object.freeze({
  REQUIRE_VERIFICATION: readBool('REQUIRE_VERIFICATION', false),
  ALLOW_INVITES: readBool('ALLOW_INVITES', true),
  AUTO_ACTIVATE: readBool('AUTO_ACTIVATE', false),
  EMAIL_ENABLED: readBool('EMAIL_ENABLED', false),
});

const TOKEN_TTLS = Object.freeze({
  VERIFY_HOURS: parseInt(process.env.VERIFY_TOKEN_TTL_HOURS || '72', 10),
  INVITE_DAYS: parseInt(process.env.INVITE_TOKEN_TTL_DAYS || '14', 10),
});

module.exports = { STATUSES, FLAGS, TOKEN_TTLS };


