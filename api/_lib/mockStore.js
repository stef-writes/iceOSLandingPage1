const store = { entries: [] };

function all() {
  return store.entries;
}

function add(entry) {
  store.entries.unshift(entry);
  return entry;
}

function findById(id) {
  return store.entries.find((e) => e.id === id);
}

function findByEmail(email) {
  return store.entries.find((e) => (e.email || '').toLowerCase() === String(email || '').toLowerCase());
}

function updateById(id, patch) {
  const entry = findById(id);
  if (entry) Object.assign(entry, patch);
  return entry;
}

function clear() {
  store.entries = [];
}

module.exports = { all, add, findById, findByEmail, updateById, clear };


