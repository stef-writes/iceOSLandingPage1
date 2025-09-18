import { Position } from "reactflow";

export const initialNodes = [
  { id: "input", type: "eduNode", position: { x: 0, y: 220 }, data: { label: "Transcript / Paper / Notes", showHint: true, cardTitle: "Input", cardBody: "Text/audio seed for the system." }, style: { width: 240 }, sourcePosition: Position.Right, draggable: false, selectable: false },
  { id: "k-ra", type: "eduNode", position: { x: 320, y: 140 }, data: { label: "Research Agent", showHint: true, cardTitle: "Research Agent", cardBody: "Pulls context and references." }, style: { width: 220 }, targetPosition: Position.Left, sourcePosition: Position.Right, draggable: false, selectable: false },
  { id: "k-pl", type: "eduNode", position: { x: 320, y: 240 }, data: { label: "Philosophy Lens", showHint: true, cardTitle: "Philosophy Lens", cardBody: "Aligns ethics/values; gates outputs." }, style: { width: 220 }, targetPosition: Position.Left, sourcePosition: Position.Right, draggable: false, selectable: false },
  { id: "k-te", type: "eduNode", position: { x: 320, y: 340 }, data: { label: "Technical Explainer", showHint: true, cardTitle: "Technical Explainer", cardBody: "Structure as math/code/pseudocode." }, style: { width: 220 }, targetPosition: Position.Left, sourcePosition: Position.Right, draggable: false, selectable: false },
  { id: "s-ig", type: "eduNode", position: { x: 640, y: 160 }, data: { label: "Idea Extrapolator", showHint: true, cardTitle: "Idea Extrapolator", cardBody: "Expand and propose directions." }, style: { width: 240 }, targetPosition: Position.Left, sourcePosition: Position.Right, draggable: false, selectable: false },
  { id: "s-ca", type: "eduNode", position: { x: 640, y: 260 }, data: { label: "Critic Agent", showHint: true, cardTitle: "Critic Agent", cardBody: "Stress-test ideas; find limits." }, style: { width: 240 }, targetPosition: Position.Left, sourcePosition: Position.Right, draggable: false, selectable: false },
  { id: "s-sz", type: "eduNode", position: { x: 640, y: 360 }, data: { label: "Synthesizer", showHint: true, cardTitle: "Synthesizer", cardBody: "Merge into a coherent draft with schema." }, style: { width: 260 }, targetPosition: Position.Left, sourcePosition: Position.Right, draggable: false, selectable: false },
  { id: "d-pod", type: "eduNode", position: { x: 980, y: 140 }, data: { label: "Draft — Podcast", showHint: true, cardTitle: "Podcast Adapter", cardBody: "Format for audio outline." }, style: { width: 200 }, targetPosition: Position.Left, draggable: false, selectable: false },
  { id: "d-blog", type: "eduNode", position: { x: 980, y: 220 }, data: { label: "Draft — Blog", showHint: false }, style: { width: 200 }, targetPosition: Position.Left, draggable: false, selectable: false },
  { id: "d-note", type: "eduNode", position: { x: 980, y: 300 }, data: { label: "Draft — Notebook", showHint: true, cardTitle: "Notebook Adapter", cardBody: "Format as code/tech explainer." }, style: { width: 200 }, targetPosition: Position.Left, draggable: false, selectable: false },
  { id: "d-social", type: "eduNode", position: { x: 980, y: 380 }, data: { label: "Draft — Social", showHint: false }, style: { width: 200 }, targetPosition: Position.Left, draggable: false, selectable: false },
];

export const initialEdges = [
  { id: "e0", source: "input", target: "k-ra", animated: true },
  { id: "e1", source: "k-ra", target: "k-pl", animated: true },
  { id: "e2", source: "k-pl", target: "k-te", animated: true },
  { id: "e3", source: "k-pl", target: "s-ig", animated: true },
  { id: "e3b", source: "k-te", target: "s-ig", animated: true },
  { id: "e4", source: "s-ig", target: "s-ca", animated: true },
  { id: "e5", source: "s-ca", target: "s-sz", animated: true },
  { id: "e6", source: "s-sz", target: "d-pod", animated: true },
  { id: "e7", source: "s-sz", target: "d-blog", animated: true },
  { id: "e8", source: "s-sz", target: "d-note", animated: true },
  { id: "e9", source: "s-sz", target: "d-social", animated: true },
];


