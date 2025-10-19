const { add, clear } = require('../_lib/mockStore');

module.exports = async (req, res) => {
  if (req.method !== 'POST') {
    res.status(405).send('Method Not Allowed');
    return;
  }
  try {
    clear();
    const roles = ['Founder / Creator','Operator','Engineer','Consultant','Designer'];
    const statuses = ['pending','verified','invited','active','archived'];
    for (let i = 0; i < 120; i++) {
      const email = `user${i}@example${(i%5)+1}.com`;
      const role = roles[i % roles.length];
      const status = statuses[i % statuses.length];
      add({
        id: Math.random().toString(36).slice(2),
        email,
        role,
        usecase: i % 2 === 0 ? 'AI content system for B2B SEO' : 'Client onboarding blueprint for agencies',
        keywords: i % 2 === 0 ? ['ai','content','seo','b2b'] : ['onboarding','agency','client','workflow'],
        created_at: new Date(Date.now() - i * 86400000).toISOString(),
        status,
        source: 'mock',
        utm_source: 'newsletter',
        utm_medium: 'email',
        utm_campaign: 'launch',
        utm_term: null,
        utm_content: null,
      });
    }
    res.status(200).json({ ok: true, count: 120 });
  } catch (e) {
    res.status(500).send('Failed to seed');
  }
};


