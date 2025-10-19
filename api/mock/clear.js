const { clear } = require('../_lib/mockStore');

module.exports = async (req, res) => {
  if (req.method !== 'POST') {
    res.status(405).send('Method Not Allowed');
    return;
  }
  try {
    clear();
    res.status(200).json({ ok: true });
  } catch (e) {
    res.status(500).send('Failed to clear');
  }
};


