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
        "iceOS turns expertise into modular building blocks — nodes, workflows, networks — that run your judgment at scale. Build once, reason everywhere.",
      pillars: [
        {
          title: "Nodes",
          desc: "Atomic units of judgment: reusable, testable, composable.",
          icon: "Boxes",
        },
        {
          title: "Workflows",
          desc: "Chain nodes into repeatable systems that encode expertise.",
          icon: "GitBranch",
        },
        {
          title: "Networks",
          desc: "Distribute reasoning across teams and surfaces with control.",
          icon: "Network",
        },
      ],
    },
    matters: {
      title: "Why This Matters",
      copy:
        "Knowledge is stuck. Expert judgment is trapped in heads, docs, and Slack threads — expensive to access, impossible to scale. iceOS makes it reproducible, testable, and composable — so individuals and teams can move faster than ever.",
    },
    audience: {
      title: "Who It’s For",
      chips: ["Creators", "Operators", "System Designers"],
      bullets: [
        "Creators: Productize thinking, monetize systems.",
        "Operators: Scale good decisions, cut cognitive drag.",
        "Designers: Encode higher-order reasoning, push AI forward.",
      ],
    },
    whyNow: {
      title: "Why Now",
      copy:
        "The creator economy is maturing. AI has made creativity abundant — but judgment is still scarce. Whoever captures and scales judgment wins the next decade.",
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