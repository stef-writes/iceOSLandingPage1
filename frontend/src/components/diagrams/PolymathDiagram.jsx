import React from "react";

// Scaffold: zones, titles, grid columns; no detailed nodes yet
export default function PolymathDiagram({ showGrid = false }) {
  const vbW = 1200;
  const vbH = 600;
  // Current content horizontal bounds (left-most x and right-most x)
  const contentMinX = 80; // input x
  const contentMaxX = 1000 + 220; // dist zone x + width
  const contentW = contentMaxX - contentMinX;
  const centerShiftX = (vbW - contentW) / 2 - contentMinX;
  const gridStep = 40;
  const majorStep = 160;
  const gridCols = Array.from({ length: Math.floor(vbW / gridStep) + 1 }, (_, i) => i * gridStep);
  const gridRows = Array.from({ length: Math.floor(vbH / gridStep) + 1 }, (_, i) => i * gridStep);
  return (
    <div className="w-full mx-auto">
      <svg role="img" aria-labelledby="polyTitle polyDesc" viewBox={`0 0 ${vbW} ${vbH}`} width="100%" height="100%" preserveAspectRatio="xMidYMid meet">
        <title id="polyTitle">Polymath Workflow</title>
        <desc id="polyDesc">Input → Knowledge Zone → Synthesis Zone → Distribution Zone</desc>

        <defs>
          <filter id="zoneGlow" x="-50%" y="-50%" width="200%" height="200%">
            <feDropShadow dx="0" dy="0" stdDeviation="10" floodColor="rgba(34,211,238,0.12)" />
          </filter>
          <marker id="zoneArrow" markerWidth="8" markerHeight="8" refX="6" refY="4" orient="auto">
            <path d="M0,0 L8,4 L0,8 Z" fill="rgba(34,211,238,0.9)" />
          </marker>
          <radialGradient id="softBg" cx="50%" cy="35%" r="70%">
            <stop offset="0%" stopColor="rgba(34,211,238,0.08)" />
            <stop offset="100%" stopColor="rgba(34,211,238,0)" />
          </radialGradient>
        </defs>

        {/* Artistic backdrop */}
        <rect x="0" y="0" width={vbW} height={vbH} fill="url(#softBg)" />
        {showGrid && (
          <g>
            {gridCols.map((x) => (
              <line key={`gx-${x}`} x1={x} y1={0} x2={x} y2={vbH} stroke={x % majorStep === 0 ? "rgba(255,255,255,0.12)" : "rgba(255,255,255,0.06)"} strokeWidth={x % majorStep === 0 ? 1 : 0.5} />
            ))}
            {gridRows.map((y) => (
              <line key={`gy-${y}`} x1={0} y1={y} x2={vbW} y2={y} stroke={y % majorStep === 0 ? "rgba(255,255,255,0.12)" : "rgba(255,255,255,0.06)"} strokeWidth={y % majorStep === 0 ? 1 : 0.5} />
            ))}
          </g>
        )}

        {/* Column guides (invisible) */}
        {/* col x positions: 80, 340, 680, 1000 (auto-centered via group transform) */}
        <g transform={`translate(${centerShiftX}, 0)`}>
          {/* Input node */}
          <g>
            <rect x="80" y="250" width="220" height="68" rx="12" fill="none" stroke="rgba(255,255,255,0.45)" />
            <title>Input: Transcript / Paper / Notes&#10;Formats: text or audio (speech-to-text)</title>
            <text x="190" y="290" textAnchor="middle" fontSize="15" fill="rgba(255,255,255,0.95)">Transcript / Paper / Notes</text>
            <path d="M 300 284 C 320 284 330 284 340 284" stroke="rgba(34,211,238,0.9)" strokeWidth="2" fill="none" markerEnd="url(#zoneArrow)" />
          </g>

        {/* Knowledge Zone */}
          <g filter="url(#zoneGlow)">
            <rect x="340" y="80" width="280" height="360" rx="16" fill="rgba(255,255,255,0.03)" stroke="rgba(255,255,255,0.12)" />
          </g>
          <text x="352" y="100" fontSize="12" fill="rgba(255,255,255,0.75)">Knowledge Zone</text>
        {/* Knowledge Zone nodes */}
        <g>
          {/* Research Agent (top) */}
          <rect x="360" y="130" width="220" height="68" rx="12" fill="none" stroke="rgba(255,255,255,0.45)" />
          <title>Agent — Pulls sources and extracts references</title>
          <text x="470" y="170" textAnchor="middle" fontSize="15" fill="rgba(255,255,255,0.95)">Research Agent</text>
          <text x="360" y="200" fontSize="12" fill="rgba(255,255,255,0.6)">Pulls sources + context</text>

          {/* Philosophy Lens (middle) */}
          <rect x="360" y="230" width="220" height="68" rx="12" fill="none" stroke="rgba(255,255,255,0.4)" />
          <title>Evaluator — Ethical / value / bias context; returns pass/fail</title>
          <text x="470" y="270" textAnchor="middle" fontSize="15" fill="rgba(255,255,255,0.95)">Philosophy Lens</text>
          <text x="360" y="300" fontSize="12" fill="rgba(255,255,255,0.6)">Evaluator — returns pass/fail</text>

          {/* Technical Explainer (bottom) */}
          <rect x="360" y="330" width="220" height="68" rx="12" fill="none" stroke="rgba(255,255,255,0.4)" />
          <title>LLM — Summarize to math/code/pseudocode</title>
          <text x="470" y="370" textAnchor="middle" fontSize="15" fill="rgba(255,255,255,0.95)">Technical Explainer</text>
          <text x="360" y="400" fontSize="12" fill="rgba(255,255,255,0.6)">Structure: math / code / pseudo</text>

          {/* Flow arrows inside Knowledge */}
          
          <path d="M 340 284 C 360 210 360 200 360 200" stroke="rgba(34,211,238,0.9)" strokeWidth="1.8" fill="none" markerEnd="url(#zoneArrow)" />
          <line x1="470" y1="198" x2="470" y2="230" stroke="rgba(34,211,238,0.85)" strokeWidth="1.6" markerEnd="url(#zoneArrow)" />
          <line x1="470" y1="300" x2="470" y2="330" stroke="rgba(34,211,238,0.85)" strokeWidth="1.6" markerEnd="url(#zoneArrow)" />
        </g>

        {/* Synthesis Zone */}
          <g filter="url(#zoneGlow)">
            <rect x="680" y="80" width="300" height="360" rx="16" fill="rgba(255,255,255,0.03)" stroke="rgba(255,255,255,0.12)" />
          </g>
          <text x="692" y="100" fontSize="12" fill="rgba(255,255,255,0.75)">Synthesis Zone</text>
        {/* Synthesis nodes (triangular) */}
        <g>
          {/* Idea Generator (top-left) */}
          <rect x="700" y="130" width="240" height="68" rx="12" fill="none" stroke="rgba(255,255,255,0.45)" />
          <title>LLM — Extrapolate insights, propose extensions</title>
          <text x="820" y="170" textAnchor="middle" fontSize="15" fill="rgba(255,255,255,0.95)">Idea Generator</text>

          {/* Critic Agent (top-right shifted) */}
          <rect x="760" y="230" width="240" height="68" rx="12" fill="none" stroke="rgba(255,255,255,0.4)" />
          <title>Agent — Find counterpoints and limitations</title>
          <text x="880" y="270" textAnchor="middle" fontSize="15" fill="rgba(255,255,255,0.95)">Critic Agent</text>

          {/* Synthesizer (bottom center) */}
          <rect x="720" y="330" width="260" height="68" rx="12" fill="none" stroke="rgba(255,255,255,0.4)" />
          <title>LLM w/ schema — Merge into coherent draft (intro/body/conclusion)</title>
          <text x="850" y="370" textAnchor="middle" fontSize="15" fill="rgba(255,255,255,0.95)">Synthesizer</text>
          <text x="720" y="400" fontSize="12" fill="rgba(255,255,255,0.6)">Schema: intro / body / conclusion</text>

          {/* Arrows */}
          <path d="M 940 170 C 920 190 900 210 880 230" stroke="rgba(34,211,238,0.9)" strokeWidth="1.6" fill="none" markerEnd="url(#zoneArrow)" />
          <path d="M 880 298 C 860 315 845 325 850 330" stroke="rgba(34,211,238,0.9)" strokeWidth="1.6" fill="none" markerEnd="url(#zoneArrow)" />
          {/* From Knowledge to Idea Generator (soft curve) */}
          <path d="M 580 284 C 620 248 660 200 700 164" stroke="rgba(34,211,238,0.9)" strokeWidth="1.8" fill="none" markerEnd="url(#zoneArrow)" />
        </g>

        {/* Distribution Zone */}
          <g filter="url(#zoneGlow)">
            <rect x="1000" y="80" width="220" height="360" rx="16" fill="rgba(255,255,255,0.03)" stroke="rgba(255,255,255,0.12)" />
          </g>
          <text x="1012" y="100" fontSize="12" fill="rgba(255,255,255,0.75)">Distribution Zone</text>
          <g>
          {/* Drafts stacked */}
          <rect x="1020" y="120" width="180" height="56" rx="12" fill="none" stroke="rgba(255,255,255,0.4)" />
          <title>Workflow — Podcast outline draft</title>
          <text x="1110" y="152" textAnchor="middle" fontSize="13" fill="rgba(255,255,255,0.95)">Draft — Podcast</text>

          <rect x="1020" y="190" width="180" height="56" rx="12" fill="none" stroke="rgba(255,255,255,0.4)" />
          <title>Workflow — Blog article draft</title>
          <text x="1110" y="222" textAnchor="middle" fontSize="13" fill="rgba(255,255,255,0.95)">Draft — Blog</text>

          <rect x="1020" y="260" width="180" height="56" rx="12" fill="none" stroke="rgba(255,255,255,0.4)" />
          <title>Workflow — Notebook / technical explainer</title>
          <text x="1110" y="292" textAnchor="middle" fontSize="13" fill="rgba(255,255,255,0.95)">Draft — Notebook</text>

          <rect x="1020" y="330" width="180" height="56" rx="12" fill="none" stroke="rgba(255,255,255,0.4)" />
          <title>Workflow — Social thread draft</title>
          <text x="1110" y="362" textAnchor="middle" fontSize="13" fill="rgba(255,255,255,0.95)">Draft — Social</text>

          {/* Arrows from Synthesizer to drafts */}
            <path d="M 980 364 C 1000 330 1010 280 1020 148" stroke="rgba(34,211,238,0.9)" strokeWidth="1.6" fill="none" markerEnd="url(#zoneArrow)" />
            <path d="M 980 364 C 1000 330 1010 280 1020 218" stroke="rgba(34,211,238,0.9)" strokeWidth="1.6" fill="none" markerEnd="url(#zoneArrow)" />
            <path d="M 980 364 C 1000 330 1010 300 1020 288" stroke="rgba(34,211,238,0.9)" strokeWidth="1.6" fill="none" markerEnd="url(#zoneArrow)" />
            <path d="M 980 364 C 1000 352 1008 348 1020 358" stroke="rgba(34,211,238,0.9)" strokeWidth="1.6" fill="none" markerEnd="url(#zoneArrow)" />
          </g>
        {/* Tagline */}
        <text x="600" y="560" textAnchor="middle" fontSize="12" fill="rgba(255,255,255,0.6)">From research to reach — one governed system.</text>
        </g>
      </svg>
    </div>
  );
}


