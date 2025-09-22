import React from "react";

// Minimal practice diagram: renders a few nodes and curved edges.
// Focus: spacing, sizing, strokes, and typography. No interactivity.

export default function Diagram({
  tokens,
  nodeW = 200,
  nodeH = 60,
  gapX = 180,
  gapY = 110,
  radius = 12,
  strokeW = 1.4,
  showGrid = false,
}) {
  const vbW = nodeW * 3 + gapX * 2 + 120;
  const vbH = nodeH * 3 + gapY * 2 + 120;

  // Grid helpers
  const gridStep = 40;
  const majorStep = 160;
  const gridCols = Array.from({ length: Math.floor(vbW / gridStep) + 1 }, (_, i) => i * gridStep);
  const gridRows = Array.from({ length: Math.floor(vbH / gridStep) + 1 }, (_, i) => i * gridStep);

  // Positions
  const originX = 60; // left padding
  const originY = 60; // top padding
  const col = (i) => originX + i * (nodeW + gapX);
  const row = (j) => originY + j * (nodeH + gapY);

  const nodes = [
    { id: "A", x: col(0), y: row(1), label: "Input" },
    { id: "B", x: col(1), y: row(0), label: "Research" },
    { id: "C", x: col(1), y: row(2), label: "Synthesis" },
    { id: "D", x: col(2), y: row(1), label: "Output" },
  ];

  const center = (n) => ({ cx: n.x + nodeW / 2, cy: n.y + nodeH / 2 });

  // Choose an anchor point on the rectangle edge facing the target to avoid crossing text
  const anchorFor = (from, to) => {
    const f = center(from);
    const t = center(to);
    const dx = t.cx - f.cx;
    const dy = t.cy - f.cy;
    const pad = 8; // pull point slightly outside the rect
    // If mostly horizontal movement, exit/enter from left/right sides
    if (Math.abs(dx) >= Math.abs(dy)) {
      const fromX = dx >= 0 ? from.x + nodeW + pad : from.x - pad;
      const fromY = f.cy;
      const toX = dx >= 0 ? to.x - pad : to.x + nodeW + pad;
      const toY = center(to).cy;
      return { from: { x: fromX, y: fromY }, to: { x: toX, y: toY } };
    }
    // Mostly vertical movement, use top/bottom edges
    const fromY = dy >= 0 ? from.y + nodeH + pad : from.y - pad;
    const fromX = f.cx;
    const toY = dy >= 0 ? to.y - pad : to.y + nodeH + pad;
    const toX = center(to).cx;
    return { from: { x: fromX, y: fromY }, to: { x: toX, y: toY } };
  };

  const cubicPath = (p1, p2) => {
    const midX = (p1.x + p2.x) / 2;
    // Horizontal tangents at ends for smoothness
    const c1 = { x: midX, y: p1.y };
    const c2 = { x: midX, y: p2.y };
    return `M ${p1.x} ${p1.y} C ${c1.x} ${c1.y} ${c2.x} ${c2.y} ${p2.x} ${p2.y}`;
  };

  // --- Obstacle-aware routing helpers ---
  const inflate = (rect, pad) => ({ x: rect.x - pad, y: rect.y - pad, w: nodeW + pad * 2, h: nodeH + pad * 2 });
  const pointInRect = (x, y, r) => x >= r.x && x <= r.x + r.w && y >= r.y && y <= r.y + r.h;
  const segsIntersect = (p, p2, q, q2) => {
    const o = (a,b,c) => Math.sign((b.y-a.y)*(c.x-b.x) - (b.x-a.x)*(c.y-b.y));
    const onSeg = (a,b,c) => Math.min(a.x,b.x) <= c.x && c.x <= Math.max(a.x,b.x) && Math.min(a.y,b.y) <= c.y && c.y <= Math.max(a.y,b.y);
    const o1 = o(p,p2,q), o2 = o(p,p2,q2), o3 = o(q,q2,p), o4 = o(q,q2,p2);
    if (o1 !== o2 && o3 !== o4) return true;
    if (o1 === 0 && onSeg(p,p2,q)) return true;
    if (o2 === 0 && onSeg(p,p2,q2)) return true;
    if (o3 === 0 && onSeg(q,q2,p)) return true;
    if (o4 === 0 && onSeg(q,q2,p2)) return true;
    return false;
  };
  const segmentIntersectsRect = (a, b, r) => {
    if (pointInRect(a.x, a.y, r) || pointInRect(b.x, b.y, r)) return true;
    const tl = { x: r.x, y: r.y }, tr = { x: r.x + r.w, y: r.y }, bl = { x: r.x, y: r.y + r.h }, br = { x: r.x + r.w, y: r.y + r.h };
    return (
      segsIntersect(a,b,tl,tr) || segsIntersect(a,b,tr,br) || segsIntersect(a,b,br,bl) || segsIntersect(a,b,bl,tl)
    );
  };
  const sampleCubicHitsRect = (p1, p2, rects) => {
    const midX = (p1.x + p2.x) / 2;
    const c1 = { x: midX, y: p1.y };
    const c2 = { x: midX, y: p2.y };
    const steps = 28;
    let prev = { x: p1.x, y: p1.y };
    for (let i = 1; i <= steps; i++) {
      const t = i / steps;
      const x = Math.pow(1 - t, 3) * p1.x + 3 * Math.pow(1 - t, 2) * t * c1.x + 3 * (1 - t) * Math.pow(t, 2) * c2.x + Math.pow(t, 3) * p2.x;
      const y = Math.pow(1 - t, 3) * p1.y + 3 * Math.pow(1 - t, 2) * t * c1.y + 3 * (1 - t) * Math.pow(t, 2) * c2.y + Math.pow(t, 3) * p2.y;
      const cur = { x, y };
      for (const r of rects) {
        if (segmentIntersectsRect(prev, cur, r)) return true;
      }
      prev = cur;
    }
    return false;
  };
  const pathFromPolyline = (pts) => `M ${pts[0].x} ${pts[0].y} ` + pts.slice(1).map(p => `L ${p.x} ${p.y}`).join(" ");
  const findOrthogonalRoute = (fromPt, toPt, obstacles) => {
    const minX = Math.min(fromPt.x, toPt.x) + 20;
    const maxX = Math.max(fromPt.x, toPt.x) - 20;
    const midX = (fromPt.x + toPt.x) / 2;
    const candidates = [midX, midX - 60, midX + 60, midX - 120, midX + 120];
    const isClear = (a,b) => obstacles.every(r => !segmentIntersectsRect(a,b,r));
    for (const viaX of candidates) {
      if (viaX <= minX || viaX >= maxX) continue;
      const p1 = { x: viaX, y: fromPt.y };
      const p2 = { x: viaX, y: toPt.y };
      if (isClear(fromPt, p1) && isClear(p1, p2) && isClear(p2, toPt)) {
        return pathFromPolyline([fromPt, p1, p2, toPt]);
      }
    }
    // Fallback: vertical detour using midY
    const minY = Math.min(fromPt.y, toPt.y) + 20;
    const maxY = Math.max(fromPt.y, toPt.y) - 20;
    const midY = (fromPt.y + toPt.y) / 2;
    const candY = [midY, midY - 60, midY + 60, midY - 120, midY + 120];
    for (const viaY of candY) {
      if (viaY <= minY || viaY >= maxY) continue;
      const p1 = { x: fromPt.x, y: viaY };
      const p2 = { x: toPt.x, y: viaY };
      if (isClear(fromPt, p1) && isClear(p1, p2) && isClear(p2, toPt)) {
        return pathFromPolyline([fromPt, p1, p2, toPt]);
      }
    }
    // If all fails, straight line (should rarely happen)
    return pathFromPolyline([fromPt, toPt]);
  };

  return (
    <svg role="img" aria-label="Practice Diagram" viewBox={`0 0 ${vbW} ${vbH}`} width="100%" height="100%" preserveAspectRatio="xMidYMid meet">
      <defs>
        <marker id="pdArrow" markerWidth="8" markerHeight="8" refX="6" refY="4" orient="auto">
          <path d="M0,0 L8,4 L0,8 Z" fill={tokens.colors.accentStrong} />
        </marker>
      </defs>

      {showGrid && (
        <g>
          {gridCols.map((x) => (
            <line key={`gx-${x}`} x1={x} y1={0} x2={x} y2={vbH} stroke={x % majorStep === 0 ? tokens.colors.gridMajor : tokens.colors.gridMinor} strokeWidth={x % majorStep === 0 ? 1 : 0.5} />
          ))}
          {gridRows.map((y) => (
            <line key={`gy-${y}`} x1={0} y1={y} x2={vbW} y2={y} stroke={y % majorStep === 0 ? tokens.colors.gridMajor : tokens.colors.gridMinor} strokeWidth={y % majorStep === 0 ? 1 : 0.5} />
          ))}
        </g>
      )}

      {/* Edges (connect at rectangle edges, not through labels) */}
      <g>
        {(() => {
          const infl = nodes.filter(n => n.id !== "A" && n.id !== "B").map(n => inflate({ x: n.x, y: n.y }, 10));
          const { from, to } = anchorFor(nodes[0], nodes[1]);
          const collide = sampleCubicHitsRect(from, to, infl);
          const d = collide ? findOrthogonalRoute(from, to, infl) : cubicPath(from, to);
          return <path d={d} stroke={tokens.colors.accentStrong} strokeWidth={strokeW + 0.2} fill="none" markerEnd="url(#pdArrow)" strokeLinecap="round" strokeLinejoin="round" />;
        })()}
        {(() => {
          const infl = nodes.filter(n => n.id !== "A" && n.id !== "C").map(n => inflate({ x: n.x, y: n.y }, 10));
          const { from, to } = anchorFor(nodes[0], nodes[2]);
          const collide = sampleCubicHitsRect(from, to, infl);
          const d = collide ? findOrthogonalRoute(from, to, infl) : cubicPath(from, to);
          return <path d={d} stroke={tokens.colors.accentStrong} strokeWidth={strokeW + 0.2} fill="none" markerEnd="url(#pdArrow)" strokeLinecap="round" strokeLinejoin="round" />;
        })()}
        {(() => {
          const infl = nodes.filter(n => n.id !== "B" && n.id !== "D").map(n => inflate({ x: n.x, y: n.y }, 10));
          const { from, to } = anchorFor(nodes[1], nodes[3]);
          const collide = sampleCubicHitsRect(from, to, infl);
          const d = collide ? findOrthogonalRoute(from, to, infl) : cubicPath(from, to);
          return <path d={d} stroke={tokens.colors.accentStrong} strokeWidth={strokeW} fill="none" markerEnd="url(#pdArrow)" strokeLinecap="round" strokeLinejoin="round" />;
        })()}
        {(() => {
          const infl = nodes.filter(n => n.id !== "C" && n.id !== "D").map(n => inflate({ x: n.x, y: n.y }, 10));
          const { from, to } = anchorFor(nodes[2], nodes[3]);
          const collide = sampleCubicHitsRect(from, to, infl);
          const d = collide ? findOrthogonalRoute(from, to, infl) : cubicPath(from, to);
          return <path d={d} stroke={tokens.colors.accentStrong} strokeWidth={strokeW} fill="none" markerEnd="url(#pdArrow)" strokeLinecap="round" strokeLinejoin="round" />;
        })()}
      </g>

      {/* Nodes */}
      {nodes.map((n) => (
        <g key={n.id}>
          <rect x={n.x} y={n.y} width={nodeW} height={nodeH} rx={radius} fill="none" stroke={tokens.colors.strokeStrong} />
          <text x={n.x + nodeW / 2} y={n.y + nodeH / 2 + 5} textAnchor="middle" fontSize="15" fill={tokens.colors.textPrimary}>{n.label}</text>
        </g>
      ))}
    </svg>
  );
}


