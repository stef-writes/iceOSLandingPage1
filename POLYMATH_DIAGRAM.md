# Node Layout Spec: Polymath Workflow

## Input
- Node: Transcript / Research Input
  - Type: Input Node
  - Label: “Transcript / Paper / Notes”

---

## Zone 1: Knowledge Zone (extract + contextualize)
- Research Agent (Agent Node)
  - Action: Pull supporting sources, extract references.
- Philosophy Lens (Evaluator Node)
  - Action: Check ethical/value/bias context.
- Technical Explainer (LLM Node)
  - Action: Summarize into structured math/code/pseudocode.

Flow: Transcript → Research Agent → [Philosophy Lens + Technical Explainer] → Synthesis Zone

---

## Zone 2: Synthesis Zone (generate + reconcile)
- Idea Generator (LLM Node)
  - Action: Extrapolate insights, propose extensions.
- Critic Agent (Agent Node)
  - Action: Find counterpoints, limitations.
- Synthesizer (LLM Node with schema)
  - Action: Merge into coherent draft (intro/body/conclusion).

Flow: Knowledge Zone outputs → Idea Generator → Critic Agent → Synthesizer

---

## Zone 3: Distribution Zone (adapt + publish)
- Draft — Podcast Outline (Workflow Node) → Output: Podcast draft
- Draft — Blog (Workflow Node) → Output: Blog article
- Draft — Notebook (Workflow Node) → Output: Code / technical explainer
- Draft — Social Thread (Workflow Node) → Output: Social thread

Flow: Synthesizer → [Podcast Draft, Blog Draft, Notebook Draft, Social Thread Draft] → Outputs

---

# Design Layering Spec

1. Zones as responsibility areas
   - Rectangles with subtle tint/glow.
   - Title above each zone (Knowledge, Synthesis, Distribution).

2. Nodes
   - Rounded rectangles.
   - Icon hints (🔍 research, ⚖️ philosophy lens, 🤖 LLM, 🧩 agent).
   - Consistent sizing (160 × 60px min).

3. Flow arrows
   - Straight or lightly curved.
   - Cyan glow.

4. Optional hover sup-DAGs
   - Example: Philosophy Lens → Bias Check → Value Alignment → Pass/Fail.
   - Mini-DAGs scaled 70–80%.

5. Annotations
   - Small technical-style notes near nodes.

---

# End-to-End User Perspective
1. Starts with raw input (transcript, notes).
2. Knowledge zone contextualizes and checks.
3. Synthesis balances creativity with critique.
4. Distribution adapts into multiple modalities.

---

# Diagram Design Spec: Polymath Workflow

## Overall Canvas
- Layout: Left → Right
- Grid: 4 columns (Input, Knowledge, Synthesis, Distribution)
- Row Height: 140–160px
- Zone Padding: 24px
- Node Spacing: 80px horizontal, 60px vertical

## Zone Structure
1) Input Zone (col 1)
- Node: “Transcript / Research Input” (160 × 60), vertically centered

2) Knowledge Zone (col 2)
- Title: Knowledge Zone
- Stack: Research Agent (top), Philosophy Lens (mid), Technical Explainer (bottom)
- Arrows: Input → Research Agent; branch to Philosophy Lens and Technical Explainer

3) Synthesis Zone (col 3)
- Title: Synthesis Zone
- Triangular layout: Idea Generator (top-left), Critic Agent (top-right), Synthesizer (bottom-center)
- Arrows: Generator → Critic → Synthesizer

4) Distribution Zone (col 4)
- Title: Distribution Zone
- Stack: Podcast Outline, Blog, Notebook, Social Thread
- Each → Output Node (Podcast, Blog, Notebook, Social)

## Node Design
- Rounded rect radius 8
- Base 160 × 60 (expandable on hover)
- Icons: 🧩 agent, 🤖 LLM, ⚖️ evaluator, 🔗 workflow
- Label bold 14–16px; sublabel 12px gray

## Arrow Design
- 2px cyan stroke, light glow, rounded heads

## Hover Sup-DAG Behavior
- Hover → overlay card on right (300 × 200) with mini child flow

## Annotations
- Italic, bottom-left near nodes

## Diagram Tagline
> From research to reach — iceOS weaves technical insight, philosophical depth, and public communication into one governed system.
