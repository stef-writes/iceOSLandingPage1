import React from "react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "../../components/ui/tooltip";

// Horizontal layout: input → zone1 → zone2 → zone3 → outputs
const cols = [80, 300, 580, 860, 1140];
const yCenter = 300;
const zoneW = 220; // each zone width for centering nodes inside
const vGap = 90; // vertical gap inside zones
const rows = {
  input: yCenter,
  // Zone 1 (Creative)
  z1a: yCenter - vGap, // Research Agent
  z1b: yCenter,        // Philosophy Lens
  z1c: yCenter + vGap, // Technical Explainer
  // Zone 2 (Synthesis)
  z2a: yCenter - vGap, // Idea Extrapolator
  z2b: yCenter,        // Critic Agent
  z2c: yCenter + vGap, // Synthesizer
  // Zone 3 (Distribution drafts)
  z3a: yCenter - vGap, // Podcast
  z3b: yCenter - vGap/3, // Blog
  z3c: yCenter + vGap/3, // Notebook
  z3d: yCenter + vGap, // Social
};

function Node({ x, y, w = 220, h = 68, label, sublabel, highlight }) {
  return (
    <g>
      <rect x={x} y={y} width={w} height={h} rx={12} fill="none" stroke={highlight ? "rgba(34,211,238,0.9)" : "rgba(255,255,255,0.45)"} />
      <text x={x + w / 2} y={y + h / 2 - 4} textAnchor="middle" fontSize="15" fill="rgba(255,255,255,0.95)">{label}</text>
      {sublabel ? (<text x={x + 8} y={y + h + 20} fontSize="12" fill="rgba(255,255,255,0.6)">{sublabel}</text>) : null}
    </g>
  );
}

function Arrow({ x1, y1, x2, y2 }) {
  return <path d={`M ${x1} ${y1} C ${(x1+x2)/2} ${y1} ${(x1+x2)/2} ${y2} ${x2} ${y2}`} stroke="rgba(34,211,238,0.9)" strokeWidth="1.6" fill="none" markerEnd="url(#reactArrow)" />
}

export default function PolymathDiagramReact({ highlight = {}, dimOthers = false, showGrid = false }) {
  const vbW = 1200; const vbH = 600;
  const gridStep = 40; const majorStep = 160;
  const gridCols = Array.from({ length: Math.floor(vbW / gridStep) + 1 }, (_, i) => i * gridStep);
  const gridRows = Array.from({ length: Math.floor(vbH / gridStep) + 1 }, (_, i) => i * gridStep);

  const isOn = (k) => !!highlight[k];
  const dim = (k) => (dimOthers && !isOn(k) ? 0.35 : 1);

  // Compute content extents (so we can center/scale to fit)
  const leftX = cols[0];
  const rightX = cols[3] + 220 + 140; // dist col + gap to outputs + output width
  const contentW = rightX - leftX;
  const margin = 40;
  const maxW = vbW - margin * 2;
  const scale = contentW > maxW ? maxW / contentW : 1;
  const translateX = (vbW - contentW * scale) / 2 - leftX * scale;
  const translateY = 0;

  // Derived coordinates for clean arrows/centers
  const kNodeX = cols[1] - zoneW / 2 + 20; // left x of knowledge nodes
  const kNodeW = zoneW - 40;
  const kCenterX = kNodeX + kNodeW / 2;

  const sNodeX = cols[2] - zoneW / 2 + 20; // left x of synthesis nodes
  const sNodeW = zoneW - 40;
  const sCenterX = sNodeX + sNodeW / 2;
  const sRightX = sNodeX + sNodeW; // right edge for out arrows

  const dLeftX = cols[3] - zoneW / 2; // left edge of distribution zone
  const dNodeX = cols[3] - zoneW / 2 + 20; // left x of distribution nodes
  return (
    <div className="w-full mx-auto">
      <svg role="img" aria-label="Polymath Workflow" viewBox={`0 0 ${vbW} ${vbH}`} width="100%" height="100%" preserveAspectRatio="xMidYMid meet">
        <defs>
          <marker id="reactArrow" markerWidth="8" markerHeight="8" refX="6" refY="4" orient="auto">
            <path d="M0,0 L8,4 L0,8 Z" fill="rgba(34,211,238,0.9)" />
          </marker>
        </defs>

        {showGrid && (
          <g>
            {gridCols.map((x) => (<line key={`rgx-${x}`} x1={x} y1={0} x2={x} y2={vbH} stroke={x % majorStep === 0 ? "rgba(255,255,255,0.12)" : "rgba(255,255,255,0.06)"} strokeWidth={x % majorStep === 0 ? 1 : 0.5} />))}
            {gridRows.map((y) => (<line key={`rgy-${y}`} x1={0} y1={y} x2={vbW} y2={y} stroke={y % majorStep === 0 ? "rgba(255,255,255,0.12)" : "rgba(255,255,255,0.06)"} strokeWidth={y % majorStep === 0 ? 1 : 0.5} />))}
          </g>
        )}

        <g transform={`translate(${translateX}, ${translateY}) scale(${scale})`}>
          {/* Zones (equal widths; nodes centered horizontally within each) */}
          <g opacity={dim("zoneKnowledge")}> <rect x={cols[1]-zoneW/2} y={110} width={zoneW} height={380} rx={16} fill="rgba(255,255,255,0.03)" stroke={isOn("zoneKnowledge") ? "rgba(34,211,238,0.4)" : "rgba(255,255,255,0.12)"} /> <text x={cols[1]-zoneW/2+12} y={130} fontSize="12" fill="rgba(255,255,255,0.75)">Creative Process Zone</text> </g>
          <g opacity={dim("zoneSynthesis")}> <rect x={cols[2]-zoneW/2} y={110} width={zoneW} height={380} rx={16} fill="rgba(255,255,255,0.03)" stroke={isOn("zoneSynthesis") ? "rgba(34,211,238,0.4)" : "rgba(255,255,255,0.12)"} /> <text x={cols[2]-zoneW/2+12} y={130} fontSize="12" fill="rgba(255,255,255,0.75)">Synthesis Zone</text> </g>
          <g opacity={dim("zoneDistribution")}> <rect x={cols[3]-zoneW/2} y={110} width={zoneW} height={380} rx={16} fill="rgba(255,255,255,0.03)" stroke={isOn("zoneDistribution") ? "rgba(34,211,238,0.4)" : "rgba(255,255,255,0.12)"} /> <text x={cols[3]-zoneW/2+12} y={130} fontSize="12" fill="rgba(255,255,255,0.75)">Distribution Zone</text> </g>

          {/* Input */}
          <g opacity={dim("input")}> <Node x={cols[0]} y={rows.input-34} w={240} h={68} label="Transcript / Paper / Notes" highlight={isOn("input")} /> <Arrow x1={cols[0]+240} y1={rows.input} x2={cols[1]-zoneW/2} y2={rows.input} /> </g>

        {/* Knowledge nodes */}
        <TooltipProvider>
          <g opacity={dim("researchAgent")}> <Tooltip><TooltipTrigger asChild><g><Node x={cols[1]-zoneW/2+20} y={rows.z1a-34} w={zoneW-40} label="Research Agent" sublabel="Pulls sources + context" highlight={isOn("researchAgent")} /></g></TooltipTrigger><TooltipContent>Agent — pulls sources and extracts references</TooltipContent></Tooltip></g>
          <g opacity={dim("philosophyLens")}> <Tooltip><TooltipTrigger asChild><g><Node x={cols[1]-zoneW/2+20} y={rows.z1b-34} w={zoneW-40} label="Philosophy Lens" sublabel="Evaluator — returns pass/fail" highlight={isOn("philosophyLens")} /></g></TooltipTrigger><TooltipContent>Ethical / value / bias context</TooltipContent></Tooltip></g>
          <g opacity={dim("technicalExplainer")}> <Tooltip><TooltipTrigger asChild><g><Node x={cols[1]-zoneW/2+20} y={rows.z1c-34} w={zoneW-40} label="Technical Explainer" sublabel="Structure: math / code / pseudo" highlight={isOn("technicalExplainer")} /></g></TooltipTrigger><TooltipContent>Summarize to math/code/pseudocode</TooltipContent></Tooltip></g>
        </TooltipProvider>
        {/* Knowledge arrows */}
        {/* Input to Knowledge zone boundary */}
        <Arrow x1={cols[0]+240} y1={rows.input} x2={cols[1]-zoneW/2} y2={rows.input} />
        {/* Vertical within Knowledge: Research → Philosophy → Technical */}
        <Arrow x1={kCenterX} y1={rows.z1a} x2={kCenterX} y2={rows.z1b} />
        <Arrow x1={kCenterX} y1={rows.z1b} x2={kCenterX} y2={rows.z1c} />

        {/* Synthesis nodes */}
        <TooltipProvider>
          <g opacity={dim("ideaGenerator")}> <Tooltip><TooltipTrigger asChild><g><Node x={cols[2]-zoneW/2+20} y={rows.z2a-34} w={zoneW-40} label="Idea Extrapolator" sublabel="Extrapolate, propose" highlight={isOn("ideaGenerator")} /></g></TooltipTrigger><TooltipContent>LLM — Extrapolate insights, propose extensions</TooltipContent></Tooltip></g>
          <g opacity={dim("criticAgent")}> <Tooltip><TooltipTrigger asChild><g><Node x={cols[2]-zoneW/2+20} y={rows.z2b-34} w={zoneW-40} label="Critic Agent" sublabel="Counterpoints, limits" highlight={isOn("criticAgent")} /></g></TooltipTrigger><TooltipContent>Agent — Find counterpoints and limitations</TooltipContent></Tooltip></g>
          <g opacity={dim("synthesizer")}><Tooltip><TooltipTrigger asChild><g><Node x={cols[2]-zoneW/2+20} y={rows.z2c-34} w={zoneW-40} label="Synthesizer" sublabel="Schema: intro/body/conclusion" highlight={isOn("synthesizer")} /></g></TooltipTrigger><TooltipContent>LLM w/ schema — Merge into coherent draft</TooltipContent></Tooltip></g>
        </TooltipProvider>
          {/* Synthesis arrows */}
          {/* Knowledge → Idea Extrapolator */}
          <Arrow x1={kNodeX + kNodeW} y1={rows.z1b} x2={sNodeX} y2={rows.z2a} />
          <Arrow x1={kNodeX + kNodeW} y1={rows.z1c} x2={sNodeX} y2={rows.z2a} />
          {/* Idea → Critic → Synthesizer (vertical) */}
          <Arrow x1={sCenterX} y1={rows.z2a} x2={sCenterX} y2={rows.z2b} />
          <Arrow x1={sCenterX} y1={rows.z2b} x2={sCenterX} y2={rows.z2c} />

          {/* Distribution */}
          <g opacity={dim("zoneDistribution")}> 
            <Node x={cols[3]-zoneW/2+20} y={rows.z3a-28} w={zoneW-40} h={56} label="Draft — Podcast" />
            <Node x={cols[3]-zoneW/2+20} y={rows.z3b-28} w={zoneW-40} h={56} label="Draft — Blog" />
            <Node x={cols[3]-zoneW/2+20} y={rows.z3c-28} w={zoneW-40} h={56} label="Draft — Notebook" />
            <Node x={cols[3]-zoneW/2+20} y={rows.z3d-28} w={zoneW-40} h={56} label="Draft — Social" />
          {/* Synthesizer → each draft */}
          <Arrow x1={sRightX} y1={rows.z2c} x2={dLeftX} y2={rows.z3a} />
          <Arrow x1={sRightX} y1={rows.z2c} x2={dLeftX} y2={rows.z3b} />
          <Arrow x1={sRightX} y1={rows.z2c} x2={dLeftX} y2={rows.z3c} />
          <Arrow x1={sRightX} y1={rows.z2c} x2={dLeftX} y2={rows.z3d} />
          </g>

          {/* Final outputs to the right of distribution */}
          <g>
            <rect x={cols[3]+220} y={rows.z3b-28} width={140} height={56} rx={12} fill="none" stroke="rgba(34,211,238,0.9)" />
            <text x={cols[3]+290} y={rows.z3b+2} textAnchor="middle" fontSize="15" fill="rgba(255,255,255,0.95)">Blog</text>
            <rect x={cols[3]+220} y={rows.z3a-28} width={140} height={56} rx={12} fill="none" stroke="rgba(34,211,238,0.9)" />
            <text x={cols[3]+290} y={rows.z3a+2} textAnchor="middle" fontSize="15" fill="rgba(255,255,255,0.95)">Podcast</text>
            <rect x={cols[3]+220} y={rows.z3c-28} width={140} height={56} rx={12} fill="none" stroke="rgba(34,211,238,0.9)" />
            <text x={cols[3]+290} y={rows.z3c+2} textAnchor="middle" fontSize="15" fill="rgba(255,255,255,0.95)">Notebook</text>
            <rect x={cols[3]+220} y={rows.z3d-28} width={140} height={56} rx={12} fill="none" stroke="rgba(34,211,238,0.9)" />
            <text x={cols[3]+290} y={rows.z3d+2} textAnchor="middle" fontSize="15" fill="rgba(255,255,255,0.95)">Social</text>
            {/* arrows from drafts to outputs */}
            <Arrow x1={cols[3]+200} y1={rows.z3b} x2={cols[3]+220} y2={rows.z3b} />
            <Arrow x1={cols[3]+200} y1={rows.z3a} x2={cols[3]+220} y2={rows.z3a} />
            <Arrow x1={cols[3]+200} y1={rows.z3c} x2={cols[3]+220} y2={rows.z3c} />
            <Arrow x1={cols[3]+200} y1={rows.z3d} x2={cols[3]+220} y2={rows.z3d} />
          </g>
        </g>

        {/* Tagline */}
        <text x={vbW/2} y={vbH-40} textAnchor="middle" fontSize="12" fill="rgba(255,255,255,0.6)">From research to reach — one governed system.</text>
      </svg>
    </div>
  );
}


