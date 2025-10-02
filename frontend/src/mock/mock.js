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
      subhead: "Turn your expertise into reusable systems. Design once, scale everywhere.",
      accent: "Productizing Judgment.",
      cta: "Join the Waitlist",
    },
    what: {
      title: "Your Expertise, Productized",
      copy:
        "Capture decision frameworks and creative processes as reusable blueprints. What makes your thinking unique becomes your most valuable asset.",
    },
    why: {
      title: "Why This Matters Now",
      eyebrow: "",
      copyPrimary: "Scale Your Impact — Reach more people without more hours",
      copySecondary: "Predictable Economics — Per-run pricing like cloud compute",
      copyTertiary: "Own Your Stack — Build beyond platform constraints",
    },
    finalCta: {
      title: "Build What Matters",
      copy:
        "We're inviting creators to shape the future of work. If you're ready to turn your expertise into scalable systems, join us.",
      cta: "Join the Waitlist",
    },
    demo: {
      title: "See It in Action",
      status: "Coming Soon",
      note: "",
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