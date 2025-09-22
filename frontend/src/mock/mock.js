export const content = {
  brand: {
    name: "iceOS",
    tag: "The Independent-Creator Environment",
    oneLiner: "Build systems that think with your judgment.",
  },
  sections: {
    hero: {
      eyebrow: "iceOS",
      headline: "The Independent-Creator Environment",
      subhead: "Build systems that think with your judgment.",
      accent: "Commoditizing Expertise.",
      cta: "Join the Waitlist",
    },
    what: {
      title: "What It Is",
      copy:
        "Turn your expertise into living systems — testable, reusable, and composable — so your judgment runs on autopilot.",
    },
    why: {
      title: "Why It Matters",
      eyebrow: "Expertise, Commoditized.",
      copyPrimary: "Everyone gets to build intelligence.",
      copySecondary: "The more we create, the smarter the network becomes.",
    },
    finalCta: {
      title: "Be first",
      copy:
        "We’re inviting a small group of creators to shape the future of intelligence. If you’ve ever wished your systems could think and act with your judgment — this is for you.",
      cta: "Join the Waitlist",
    },
    demo: {
      title: "Demo Video",
      status: "Coming Soon",
      note: "Demo video — coming soon",
    },
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