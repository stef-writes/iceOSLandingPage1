export const content = {
  brand: {
    name: "iceOS",
    tag: "The independent-creator environment",
    oneLiner: "Build intelligence that mirrors how you think.",
  },
  sections: {
    hero: {
      headline: "iceOS",
      subhead: "The independent-creator environment",
      body: "Build intelligence that mirrors how you think.",
      cta: "Join the Waitlist",
    },
    building: {
      title: "What We’re Building",
      lead: "Expertise → Infrastructure",
      copy:
        "iceOS turns expertise into modular, reusable systems that run your thinking at scale. Build once, apply everywhere.",
      hints: ["Modular", "Reusable", "Leverage"],
    },
    matters: {
      title: "Why This Matters",
      copy:
        "Expertise is illegible and under-leveraged. Right now, what makes you effective lives in your head, in scattered docs, or in threads no one will ever read again. iceOS makes expertise durable, testable, and composable — so it can survive handoffs, power new contexts, and compound over time.",
      principles: [
        {
          title: "Reproducible",
          desc: "The same decision works the same way, every time.",
        },
        {
          title: "Composable",
          desc: "Insights combine into bigger, better systems.",
        },
        {
          title: "Testable",
          desc: "Audit, version, and improve as you go.",
        },
      ],
    },
    audience: {
      title: "Who It’s For",
      chips: ["Creators", "Operators", "System Designers"],
      bullets: [
        "Creators: Productize thinking. Build once, monetize everywhere.",
        "Operators: Scale good decisions, cut cognitive drag, move faster.",
        "Designers: Encode meta-thinking, build higher-order reasoning engines.",
      ],
    },
    whyNow: {
      title: "Why Now",
      copy:
        "The creator economy is maturing — but expertise is still brittle, invisible, and hard to scale. AI has made generation cheap, but reasoning remains the bottleneck. iceOS makes expertise legible and deployable — turning hard-won judgment into infrastructure that runs across dashboards, tools, and products.",
    },
    finalCta: {
      title: "Shape the future of intelligence.",
      copy:
        "We’re inviting early creators to help define how expertise becomes infrastructure. If you’re serious about scaling your judgment, you belong here.",
      cta: "Join the Waitlist",
    },
    extrasAccordion: [
      {
        q: "What is iceOS really about?",
        a: "Turning human expertise into reliable, composable infrastructure that scales across products and teams.",
      },
      {
        q: "How do I get early access?",
        a: "Join the waitlist. We’ll prioritize expert-creators with concrete use-cases.",
      },
      {
        q: "Do I need to know ML/LLMs?",
        a: "No. You bring the judgment and domain expertise, we provide the system to encode and scale it.",
      },
    ],
  },
};

export const MOCK_WAITLIST_KEY = "iceos_waitlist_submissions";

export function saveWaitlistEntry(entry) {
  const existingRaw = localStorage.getItem(MOCK_WAITLIST_KEY);
  const existing = existingRaw ? JSON.parse(existingRaw) : [];
  const withMeta = {
    id: crypto.randomUUID(),
    ...entry,
    createdAt: new Date().toISOString(),
  };
  const updated = [withMeta, ...existing];
  localStorage.setItem(MOCK_WAITLIST_KEY, JSON.stringify(updated));
  return withMeta;
}

export function getWaitlistEntries() {
  try {
    const raw = localStorage.getItem(MOCK_WAITLIST_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch (e) {
    return [];
  }
}