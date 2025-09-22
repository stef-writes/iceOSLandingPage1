# iceOS Flagship Diagram Spec — “From Raw Thought to Published System”

(for Learn More page — sole visual, high-signal)

---

## 1. Visual Logic (Structure)

- Input (far left): Transcript / raw text seed (audio, notes, conversation)
- Zone 1: Idea Refinement Zone (Philosophical Flow)
  - Cluster: reflection, research, synthesis
  - Overlay label: Creative Process Zone
- Zone 2: Publication Zone (Workflow)
  - Channel-specific adaptations
  - Overlay label: Distribution Zone
- Output (far right): Multi-channel (blog, newsletter, tweet)

Connections:
- Transcript → Reflection/Synthesis cluster → Publication workflow → Multi-channel outputs.

---

## 2. Content (Nodes + Hover Cards)

Node A: Transcript Input
- Label: Transcript
- Type: Ingest Node
- Hover:
  - Input: Raw notes, podcast transcript, meeting log.
  - Formats: text, audio (speech-to-text).

Creative Process Zone (Philosophical Flow)
- Node B: Idea Extrapolator
  - Type: LLM Node
  - Hover: Expands seed ideas into potential directions.
- Node C: Research Agent
  - Type: Agent Node (with tools)
  - Hover: Finds supporting context, examples, references.
- Node D: Reflect & Synthesize
  - Type: Evaluator / LLM
  - Hover: Distills key arguments, aligns with creator’s values.

Overlay caption: Creative Process Zone — Encode reflection, research, and synthesis into reusable judgment.

Publication Zone (Workflow)
- Node E: Draft for Blog
  - Type: LLM Node
  - Hover: Format content for long-form blog.
- Node F: Draft for Newsletter
  - Type: LLM Node
  - Hover: Adapt tone for subscribers.
- Node G: Draft for Social (Tweet Thread)
  - Type: LLM Node
  - Hover: Condense into viral-ready thread.

Overlay caption: Distribution Zone — Adapt outputs for multiple channels automatically.

Output (far right)
- Blog icon, Email icon, Twitter icon — glowing to represent published outputs.

---

## 3. Design / Implementation Spec

Style
- iceOS frontend aesthetic (canvas + nodes)
- Nodes: rounded rectangles with icon + label
- Edges: straight or slight-curved arrows
- Zones: semi-transparent highlight overlays with label
- Input/Output icons: mic, document, envelope, bird

Interaction
- Hover node → tooltip card: Node type + plain-English description (optional small config snippet)

Implementation
- Phase 1: Static SVG with hover tooltips
- Phase 2: Interactive mini-cards
- Responsive: On mobile, zones stack vertically; flows remain clear
