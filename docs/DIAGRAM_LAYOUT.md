# Diagram Layout & Sizing Principles Prompt

Goal: Create a scalable, high-signal diagram that visualizes how iceOS turns raw thought → structured systems, blending traditional workflows, LLM flows, and philosophical flows. Must stay legible as nodes, branches, and annotations are added.

## 1. Canvas & Grid
- Grid-based layout (12–16 column flexible grid)
- Zone padding ≥ 32px around each group
- Horizontal spacing between node columns ≥ 48px
- Zones auto-resize with content; keep min width ratio 1:1.5 (H:W)

## 2. Node Sizing
- Standard node size: 120–160px × 60–80px
- If label wraps, increase height; never shrink width below 100px
- Hover-expanded nodes render as overlay cards (not inline)

## 3. Flow & Branching
- Primary flow left → right
- Max 3 layers deep visible; deeper flows via hover expansion
- Parallel branches spaced ≥ 60px vertically
- Sub-DAGs indicated with expand icon; reveal mini child flow in overlay

## 4. Zones
- Rounded rectangles, transparent fill, label top-left
- Zones scale with nodes, maintain 24px inner margin
- If crowded, split into sub-zones (e.g., Research, Synthesis)

## 5. Notes & Annotations
- Right-justified side callouts with connector lines
- Notes float; do not shift node layout
- Note typography 80–90% of node label, lighter gray

## 6. Interaction / Hover
- Hover card:
  - Node type (LLM, Tool, Agent, Evaluator)
  - Plain-English function
  - Optional config snippet
- Sup-DAGs: show mini child workflow in card without breaking layout

## 7. Scaling & Responsiveness
- Desktop: zones horizontal
- Tablet: zones stack vertically
- Mobile: zones collapse to accordions
- Keep primary flow visible without horizontal scroll

## 8. Aesthetic
- Dark canvas, light outlines, cyan highlights
- Thin cyan arrows, consistent curvature
- Hover overlays: semi-transparent black, soft shadow

## Implementation Hint
- Use force-directed + grid hybrid (Dagre/D3 or Mermaid with spacing rules)
- Prioritize legibility over density; if >9 nodes per zone, push detail into hoverable sup-DAGs
