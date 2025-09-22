# Diagram Requirements for Learn More Page

## General Design Requirements

- Style: Minimal, vector-based, flat or slight gradient. No photorealism, no clipart.
- Colors: Brand palette (Carbon Black, Alpine White, Gunmetal Grey, Glacier Silver). Single cyan accent only.
- Typography: Use site font; labels align with H4/H5 sizing.
- Consistency: Same stroke weight, icon style, and corner radius across diagrams.
- Responsiveness: Prefer SVG. Provide a stacked/simplified mobile variant.

---

## Diagram 1 — From Nodes to Systems

Purpose: Show progression from atomic → complex → governed.

Spec:
- Left: 3–4 circles labeled “LLM,” “Tool,” “Agent.”
- Middle: Arrows linking circles, wrapped in a rectangle labeled “Workflow.”
- Right: Workflow inside a glowing box/cube labeled “System.”
- Badges near System: “Reusable,” “Governed,” “Composable.”
- Footer tagline: “Nodes → Workflows → Systems”.

Libraries allowed:
- Lucide/Heroicons for icons (brain, wrench, compass). Badge = shield/check.

Do NOT:
- Add decorative arrows, heavy gradients, or 3D beyond subtle glow.

---

## Diagram 2 — What Makes Them Different

Purpose: Value framing (3-pillar grid).

Spec:
- 3 columns: Icon, Bold label, 1-line subtext.

Content:
- Leverage: stacked blocks — “Capture once, apply everywhere.”
- Network: connected dots — “More systems → more combinations.”
- Trust: shield/check — “Provenance and guardrails by default.”

Libraries allowed:
- Lucide, Heroicons, Feather.

Do NOT:
- Use long paragraphs. Keep scan-friendly.

---

## Diagram 3 (Optional) — Where This Goes

Purpose: Vision closer — “living fabric”.

Spec:
- Expanding lattice of small nodes with faint lines; subtle gradient glow.
- Caption overlay: “A living fabric of designed intelligence.”

Libraries allowed:
- Network-graph SVG plus light styling; subtle animation okay.

Do NOT:
- Lean into blockchain/web3 aesthetics. Keep subtle and abstract.
