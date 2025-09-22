import React from "react";

// Data-driven graph diagram with lanes/rows. Guarantees clean edges.

const TYPE_BADGE = {
  llm: "LLM",
  code: "Code",
  agent: "Agent",
  condition: "Guard",
  output: "Output",
};

const TYPE_TO_SUBTITLE = {
  llm: "Interpret & transform",
  code: "Deterministic logic",
  agent: "Reasoning + memory + tools",
  condition: "Decision framework",
  output: "Action / result",
};

export default function Diagram({
  tokens,
  data,
  gapX = 240,
  gapY = 110,
  nodeW = 420,
  nodeH = 96,
  radius = 12,
  strokeW = 2,
  showGrid = false,
  lean = true,
}) {
  if (!data) return null;
  const nodes = data.nodes || [];
  const edges = data.edges || [];

  const lanes = Math.max(...nodes.map(n => n.lane), 0) + 1;
  const rows = Math.max(...nodes.map(n => n.order), 0) + 1;
  const vbW = nodeW * lanes + gapX * (lanes - 1) + 120;
  let vbH = nodeH * rows + gapY * (rows - 1) + 120;

  const originX = 60; const originY = 60;
  const col = (i) => originX + i * (nodeW + gapX);
  const row = (j) => originY + j * (nodeH + gapY);

  // Variant and dynamic height calculation (prioritize readability)
  const variantBase = { compact: 78, standard: 104, rich: 132 };
  const getVariant = (n) => {
    if (lean) return (n.subtitle ? "standard" : "compact");
    return n.variant || (n.prompt || n.tools || n.schema ? "rich" : (n.subtitle ? "standard" : "compact"));
  };

  // First pass: estimate per-node required height from content presence
  const preliminary = nodes.map(n => {
    const variant = getVariant(n);
    const hasSubtitle = variant !== "compact" && Boolean(n.subtitle || TYPE_TO_SUBTITLE[n.type]);
    const hasPrompt = !lean && variant === "rich" && Boolean(n.prompt);
    const hasPills = !lean && variant === "rich" && ((Array.isArray(n.tools) && n.tools.length > 0) || (n.schema && Object.keys(n.schema || {}).length > 0));
    const topPad = 30; // badge + spacing
    const header = 28; // larger header line block
    const gapSmall = 8;
    const subtitleH = hasSubtitle ? 20 : 0;
    const promptH = hasPrompt ? 16 : 0;
    const pillsH = hasPills ? 20 : 0;
    const bottomPad = 12;
    const contentH = topPad + header + (hasSubtitle ? gapSmall + subtitleH : 0) + (hasPrompt ? gapSmall + promptH : 0) + (hasPills ? 8 + pillsH : 0) + bottomPad;
    const minH = variantBase[variant] || 64;
    const hReq = Math.max(minH, contentH);
    return { ...n, variant, w: nodeW, hReq };
  });

  // Compute each row's height (max of its nodes); update canvas height
  const rowHeights = Array.from({ length: rows }, (_, r) => {
    const inRow = preliminary.filter(n => n.order === r);
    return inRow.length ? Math.max(nodeH, ...inRow.map(n => n.hReq)) : nodeH;
  });
  vbH = rowHeights.reduce((a, h) => a + h, 0) + gapY * (rows - 1) + 120;

  const rowTop = (j) => {
    let y = originY;
    for (let i = 0; i < j; i++) y += rowHeights[i] + gapY;
    return y;
  };

  // Second pass: position nodes centered within dynamic row cells
  const positioned = preliminary.map(n => {
    const cellTop = rowTop(n.order);
    const hCell = rowHeights[n.order];
    const y = cellTop + (hCell - n.hReq) / 2;
    return { ...n, x: col(n.lane), y, h: n.hReq };
  });

  const byId = Object.fromEntries(positioned.map(n => [n.id, n]));

  const gridStep = 40; const majorStep = 160;
  const gridCols = Array.from({ length: Math.floor(vbW / gridStep) + 1 }, (_, i) => i * gridStep);
  const gridRows = Array.from({ length: Math.floor(vbH / gridStep) + 1 }, (_, i) => i * gridStep);

  const center = (n) => ({ cx: n.x + n.w / 2, cy: n.y + n.h / 2 });
  const anchorFor = (from, to) => {
    const f = center(from), t = center(to);
    const dx = t.cx - f.cx, dy = t.cy - f.cy; const pad = 8;
    if (Math.abs(dx) >= Math.abs(dy)) {
      const fromX = dx >= 0 ? from.x + from.w + pad : from.x - pad; const fromY = f.cy;
      const toX = dx >= 0 ? to.x - pad : to.x + to.w + pad; const toY = center(to).cy;
      return { from: { x: fromX, y: fromY }, to: { x: toX, y: toY } };
    }
    const fromY = dy >= 0 ? from.y + from.h + pad : from.y - pad; const fromX = f.cx;
    const toY = dy >= 0 ? to.y - pad : to.y + to.h + pad; const toX = center(to).cx;
    return { from: { x: fromX, y: fromY }, to: { x: toX, y: toY } };
  };
  const cubicPath = (p1, p2) => {
    const midX = (p1.x + p2.x) / 2; const c1 = { x: midX, y: p1.y }; const c2 = { x: midX, y: p2.y };
    return `M ${p1.x} ${p1.y} C ${c1.x} ${c1.y} ${c2.x} ${c2.y} ${p2.x} ${p2.y}`;
  };
  const inflate = (n, pad) => ({ x: n.x - pad, y: n.y - pad, w: n.w + pad * 2, h: n.h + pad * 2 });
  const pointInRect = (x,y,r) => x >= r.x && x <= r.x + r.w && y >= r.y && y <= r.y + r.h;
  const segsIntersect = (p,p2,q,q2) => {
    const o = (a,b,c) => Math.sign((b.y-a.y)*(c.x-b.x) - (b.x-a.x)*(c.y-b.y));
    const onSeg = (a,b,c) => Math.min(a.x,b.x) <= c.x && c.x <= Math.max(a.x,b.x) && Math.min(a.y,b.y) <= c.y && c.y <= Math.max(a.y,b.y);
    const o1=o(p,p2,q), o2=o(p,p2,q2), o3=o(q,q2,p), o4=o(q,q2,p2);
    if (o1!==o2 && o3!==o4) return true; if (o1===0&&onSeg(p,p2,q)) return true; if (o2===0&&onSeg(p,p2,q2)) return true; if (o3===0&&onSeg(q,q2,p)) return true; if (o4===0&&onSeg(q,q2,p2)) return true; return false;
  };
  const segmentIntersectsRect = (a,b,r) => {
    if (pointInRect(a.x,a.y,r) || pointInRect(b.x,b.y,r)) return true;
    const tl={x:r.x,y:r.y}, tr={x:r.x+r.w,y:r.y}, bl={x:r.x,y:r.y+r.h}, br={x:r.x+r.w,y:r.y+r.h};
    return segsIntersect(a,b,tl,tr)||segsIntersect(a,b,tr,br)||segsIntersect(a,b,br,bl)||segsIntersect(a,b,bl,tl);
  };
  const sampleCubicHitsRect = (p1,p2,rects) => {
    const midX=(p1.x+p2.x)/2; const c1={x:midX,y:p1.y}; const c2={x:midX,y:p2.y};
    const steps=28; let prev={x:p1.x,y:p1.y};
    for(let i=1;i<=steps;i++){ const t=i/steps;
      const x=Math.pow(1-t,3)*p1.x+3*Math.pow(1-t,2)*t*c1.x+3*(1-t)*Math.pow(t,2)*c2.x+Math.pow(t,3)*p2.x;
      const y=Math.pow(1-t,3)*p1.y+3*Math.pow(1-t,2)*t*c1.y+3*(1-t)*Math.pow(t,2)*c2.y+Math.pow(t,3)*p2.y; const cur={x,y};
      for(const r of rects){ if(segmentIntersectsRect(prev,cur,r)) return true; } prev=cur; }
    return false;
  };
  const pathFromPolyline = (pts)=>`M ${pts[0].x} ${pts[0].y} `+pts.slice(1).map(p=>`L ${p.x} ${p.y}`).join(" ");
  const findOrthogonalRoute = (fromPt,toPt,obstacles)=>{
    const minX=Math.min(fromPt.x,toPt.x)+20; const maxX=Math.max(fromPt.x,toPt.x)-20; const midX=(fromPt.x+toPt.x)/2; const candidates=[midX,midX-60,midX+60,midX-120,midX+120];
    const isClear=(a,b)=>obstacles.every(r=>!segmentIntersectsRect(a,b,r));
    for(const viaX of candidates){ if(viaX<=minX||viaX>=maxX) continue; const p1={x:viaX,y:fromPt.y}; const p2={x:viaX,y:toPt.y}; if(isClear(fromPt,p1)&&isClear(p1,p2)&&isClear(p2,toPt)) return pathFromPolyline([fromPt,p1,p2,toPt]); }
    const minY=Math.min(fromPt.y,toPt.y)+20; const maxY=Math.max(fromPt.y,toPt.y)-20; const midY=(fromPt.y+toPt.y)/2; const candY=[midY,midY-60,midY+60,midY-120,midY+120];
    for(const viaY of candY){ if(viaY<=minY||viaY>=maxY) continue; const p1={x:fromPt.x,y:viaY}; const p2={x:toPt.x,y:viaY}; if(isClear(fromPt,p1)&&isClear(p1,p2)&&isClear(p2,toPt)) return pathFromPolyline([fromPt,p1,p2,toPt]); }
    return pathFromPolyline([fromPt,toPt]);
  };

  return (
    <svg role="img" aria-label="Graph Diagram" viewBox={`0 0 ${vbW} ${vbH}`} width="100%" height="100%" preserveAspectRatio="xMidYMid meet">
      <defs>
        <marker id="gdArrow" markerWidth="8" markerHeight="8" refX="6" refY="4" orient="auto">
          <path d="M0,0 L8,4 L0,8 Z" fill={tokens.colors.accentStrong} />
        </marker>
      </defs>

      {showGrid && (
        <g>
          {gridCols.map(x => (<line key={`gx-${x}`} x1={x} y1={0} x2={x} y2={vbH} stroke={x%majorStep===0?tokens.colors.gridMajor:tokens.colors.gridMinor} strokeWidth={x%majorStep===0?1:0.5} />))}
          {gridRows.map(y => (<line key={`gy-${y}`} x1={0} y1={y} x2={vbW} y2={y} stroke={y%majorStep===0?tokens.colors.gridMajor:tokens.colors.gridMinor} strokeWidth={y%majorStep===0?1:0.5} />))}
        </g>
      )}

      {/* Edges */}
      <g>
        {edges.map((e, idx) => {
          const a = byId[e.from]; const b = byId[e.to]; if(!a||!b) return null;
          const { from, to } = anchorFor(a,b);
          const obstacles = positioned.filter(n => n.id!==a.id && n.id!==b.id).map(n => inflate(n, 10));
          const collide = sampleCubicHitsRect(from,to,obstacles);
          const d = collide ? findOrthogonalRoute(from,to,obstacles) : cubicPath(from,to);
          return (<path key={idx} d={d} stroke={tokens.colors.accentStrong} strokeWidth={strokeW} fill="none" markerEnd="url(#gdArrow)" strokeLinecap="round" strokeLinejoin="round" />);
        })}
      </g>

      {/* Nodes */}
      {positioned.map((n) => {
        const subtitle = n.subtitle || TYPE_TO_SUBTITLE[n.type] || "";
        const prompt = n.prompt;
        const pills = [];
        if (Array.isArray(n.tools)) {
          for (const t of n.tools) pills.push(String(t));
        }
        if (n.schema && typeof n.schema === "object") {
          try {
            for (const k of Object.keys(n.schema)) {
              const v = n.schema[k];
              pills.push(`${k}:${String(v)}`);
            }
          } catch {}
        }
        const badge = TYPE_BADGE[n.type] || "";
        const showPrompt = n.variant === "rich" && !!prompt;
        const showPills = n.variant === "rich" && pills.length > 0;
        return (
          <g key={n.id}>
            <rect x={n.x} y={n.y} width={nodeW} height={n.h} rx={radius} fill="none" stroke={tokens.colors.strokeStrong} />
            {badge && (
              <g>
                <rect x={n.x + 10} y={n.y + 10} width={52} height={18} rx={9} fill={tokens.colors.surfaceSoft} stroke={tokens.colors.strokeSoft} />
                <text x={n.x + 36} y={n.y + 23} textAnchor="middle" fontSize="11" fill={tokens.colors.textSecondary}>{badge}</text>
              </g>
            )}
            <text x={n.x + nodeW / 2} y={n.y + 40} textAnchor="middle" fontSize="16" fill={tokens.colors.textPrimary}>{n.label || n.type}</text>
            {subtitle && n.variant !== "compact" && (<text x={n.x + nodeW / 2} y={n.y + 62} textAnchor="middle" fontSize="13" fill={tokens.colors.textMuted}>{subtitle}</text>)}
            {showPrompt && (<text x={n.x + nodeW / 2} y={n.y + 70} textAnchor="middle" fontSize="11" fill={tokens.colors.textMuted}>{prompt}</text>)}
            {showPills && (() => {
              const y = n.y + n.h - 12;
              const padX = 6; const padY = 3; const gap = 6; const charW = 6;
              const sizes = pills.map(txt => ({ txt, w: Math.min(nodeW - 24, 2 * padX + Math.max(30, txt.length * charW)), h: 16 }));
              const totalW = sizes.reduce((a, s) => a + s.w, 0) + gap * (sizes.length - 1);
              let x = n.x + (nodeW - totalW) / 2;
              return (
                <g>
                  {sizes.map((s, i) => {
                    const pill = (
                      <g key={i}>
                        <rect x={x} y={y - s.h + padY} width={s.w} height={s.h} rx={8} fill={tokens.colors.surfaceSoft} stroke={tokens.colors.strokeSoft} />
                        <text x={x + s.w / 2} y={y - 4} textAnchor="middle" fontSize="10" fill={tokens.colors.textMuted}>{s.txt}</text>
                      </g>
                    );
                    x += s.w + gap;
                    return pill;
                  })}
                </g>
              );
            })()}
          </g>
        );
      })}
    </svg>
  );
}


