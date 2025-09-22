// Diagram design tokens for consistent, minimal styling across implementations
export const diagramTokens = Object.freeze({
  colors: Object.freeze({
    accent: "#22d3ee",
    accentStrong: "rgba(34,211,238,0.9)",
    accentSoft: "rgba(34,211,238,0.4)",
    textPrimary: "rgba(255,255,255,0.95)",
    textSecondary: "rgba(255,255,255,0.75)",
    textMuted: "rgba(255,255,255,0.6)",
    strokeStrong: "rgba(255,255,255,0.45)",
    strokeSoft: "rgba(255,255,255,0.12)",
    strokeFaint: "rgba(255,255,255,0.06)",
    surface: "#0b0d0e",
    surfaceSoft: "rgba(255,255,255,0.03)",
    gridMajor: "rgba(255,255,255,0.12)",
    gridMinor: "rgba(255,255,255,0.06)",
    cardBg: "rgba(255,255,255,0.96)",
    cardText: "#0b0d0e",
  }),
  strokes: Object.freeze({
    node: 1,
    nodeHighlight: 2,
    edge: 1.3,
    edgeHighlight: 2.4,
  }),
  radii: Object.freeze({
    md: 12,
    lg: 16,
  }),
  grid: Object.freeze({
    gap: 24,
  }),
});


