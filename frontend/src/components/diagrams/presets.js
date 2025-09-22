// Presets for memory-driven diagrams: toggle full scenes with one prop
// Keys mirror highlight prop keys used by both diagrams
export const diagramPresets = Object.freeze({
  // Focus on Knowledge Zone
  knowledgeFocus: {
    density: "regular",
    dimOthers: true,
    highlight: {
      zoneKnowledge: true,
      input: true,
      researchAgent: true,
      philosophyLens: true,
      technicalExplainer: true,
    },
  },
  // Synthesis trio emphasized
  synthesisFocus: {
    density: "regular",
    dimOthers: true,
    highlight: {
      zoneSynthesis: true,
      ideaGenerator: true,
      criticAgent: true,
      synthesizer: true,
    },
  },
  // Distribution flow from Synthesizer outwards
  distributionFocus: {
    density: "compact",
    dimOthers: true,
    highlight: {
      zoneDistribution: true,
      synthesizer: true,
    },
  },
  // End-to-end path
  flagship: {
    density: "regular",
    dimOthers: false,
    highlight: {
      input: true,
      researchAgent: true,
      philosophyLens: true,
      technicalExplainer: true,
      ideaGenerator: true,
      criticAgent: true,
      synthesizer: true,
      zoneDistribution: true,
    },
  },
});


