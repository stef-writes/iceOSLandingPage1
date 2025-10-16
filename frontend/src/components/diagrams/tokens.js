// Diagram design tokens for consistent, minimal styling across implementations
export const diagramTokens = Object.freeze({
  colors: Object.freeze({
    accent: "#AE3CE0", // Neural Magenta
    accentStrong: "rgba(174,60,224,0.9)",
    accentSoft: "rgba(174,60,224,0.35)",
    textPrimary: "rgba(247,248,255,0.96)", // Lucid White
    textSecondary: "rgba(247,248,255,0.78)",
    textMuted: "rgba(177,179,201,0.9)", // Fog Gray
    strokeStrong: "rgba(247,248,255,0.45)",
    strokeSoft: "rgba(247,248,255,0.14)",
    strokeFaint: "rgba(247,248,255,0.07)",
    surface: "#0C0812", // Obsidian Plum
    surfaceSoft: "rgba(247,248,255,0.03)",
    gridMajor: "rgba(255,255,255,0.12)",
    gridMinor: "rgba(255,255,255,0.06)",
    cardBg: "rgba(247,248,255,0.96)",
    cardText: "#0C0812",
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


