import React, { useCallback, useEffect } from "react";
import ReactFlow, { Background, addEdge, useEdgesState, useNodesState, Position, Handle } from "reactflow";
import "reactflow/dist/style.css";

const initialNodes = [
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

function EduNode({ data }) {
  const [hovered, setHovered] = React.useState(false);
  const showHint = data?.showHint === true;
  const title = data?.cardTitle;
  const body = data?.cardBody;
  return (
    <div style={{ position: "relative" }} onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)}>
      <div style={{ padding: "10px 12px", borderRadius: 12, border: "1px solid rgba(255,255,255,0.45)", background: "transparent" }}>
        <div style={{ fontSize: 14, lineHeight: 1.2 }}>{data?.label}</div>
        {showHint ? (
          <div className="absolute -top-1.5 -right-1.5" aria-hidden="true">
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-300 opacity-40" />
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-cyan-400" />
            </span>
          </div>
        ) : null}
        <Handle type="target" position={Position.Left} style={{ background: "#22d3ee" }} />
        <Handle type="source" position={Position.Right} style={{ background: "#22d3ee" }} />
      </div>
      {showHint && hovered ? (
        <div className="absolute -top-3 left-1/2 -translate-x-1/2 -translate-y-full z-50 w-64 rounded-md border border-white/10 bg-white/95 p-3 text-black shadow-xl" style={{ pointerEvents: "none" }}>
          {title ? <div className="text-xs font-semibold tracking-wide text-black/70">{title}</div> : null}
          {body ? <div className="mt-1.5 text-sm leading-snug">{body}</div> : null}
        </div>
      ) : null}
    </div>
  );
}

const initialEdges = [
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

export default function FlowPolymath({ highlight = {} }) {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

  // map highlight keys to node ids
  const keyToNodeIds = {
    input: ["input"],
    researchAgent: ["k-ra"],
    philosophyLens: ["k-pl"],
    technicalExplainer: ["k-te"],
    ideaGenerator: ["s-ig"],
    criticAgent: ["s-ca"],
    synthesizer: ["s-sz"],
    zoneDistribution: ["d-pod", "d-blog", "d-note", "d-social"],
  };

  // Build highlighted set with simple path rules
  const baseHighlightIds = new Set(
    Object.entries(highlight)
      .filter(([, on]) => !!on)
      .flatMap(([k]) => keyToNodeIds[k] || [])
  );
  // If any synthesis node is highlighted, highlight the full synthesis trio
  const synthesisIds = new Set(["s-ig", "s-ca", "s-sz"]);
  if (["s-ig", "s-ca", "s-sz"].some((id) => baseHighlightIds.has(id))) {
    synthesisIds.forEach((id) => baseHighlightIds.add(id));
  }
  // If distribution is highlighted, include synthesizer to show the connection
  if (["d-pod", "d-blog", "d-note", "d-social"].some((id) => baseHighlightIds.has(id))) {
    baseHighlightIds.add("s-sz");
  }
  const highlightedNodeIds = baseHighlightIds;

  useEffect(() => {
    const nextNodes = initialNodes.map((n) => {
      const isHi = highlightedNodeIds.size > 0 && highlightedNodeIds.has(n.id);
      const dimOthers = highlightedNodeIds.size > 0;
      const base = n.style || {};
      return {
        ...n,
        style: {
          ...base,
          // Only tweak visuals when highlighted; otherwise preserve default node theme
          borderColor: isHi ? "#22d3ee" : base.borderColor,
          borderWidth: isHi ? 2 : base.borderWidth,
          background: isHi ? "rgba(34,211,238,0.16)" : base.background,
          color: isHi ? "#ffffff" : base.color,
          fontWeight: isHi ? 600 : base.fontWeight,
          // Keep label readability: don't dim below 0.85
          opacity: dimOthers && !isHi ? 0.85 : 1,
        },
      };
    });
    setNodes(nextNodes);

    const highlightedEdgeIds = new Set();
    // If a node is highlighted, highlight edges connected between highlighted nodes as well as outbound from highlighted synthesizer to drafts when zoneDistribution
    initialEdges.forEach((e) => {
      if (highlightedNodeIds.has(e.source) || highlightedNodeIds.has(e.target)) {
        highlightedEdgeIds.add(e.id);
      }
    });

    const nextEdges = initialEdges.map((e) => {
      const isHi = highlightedEdgeIds.size > 0 && highlightedEdgeIds.has(e.id);
      const dimOthers = highlightedEdgeIds.size > 0;
      return {
        ...e,
        style: {
          stroke: isHi ? "#22d3ee" : dimOthers ? "rgba(255,255,255,0.25)" : "#22d3ee",
          strokeWidth: isHi ? 2.4 : 1.3,
          opacity: dimOthers && !isHi ? 0.55 : 1,
        },
      };
    });
    setEdges(nextEdges);
  }, [setNodes, setEdges, highlight]);
  const onConnect = useCallback((params) => setEdges((eds) => addEdge({ ...params, animated: true }, eds)), [setEdges]);

  return (
    <div style={{ width: "100%", height: 520 }}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        fitView
        zoomOnScroll={false}
        zoomOnPinch={false}
        zoomOnDoubleClick={false}
        panOnDrag={false}
        panOnScroll={false}
        nodesDraggable={false}
        nodesConnectable={false}
        elementsSelectable={false}
        nodeTypes={{ eduNode: EduNode }}
        proOptions={{ hideAttribution: true }}
        defaultEdgeOptions={{ type: "smoothstep", style: { stroke: "#22d3ee" } }}
        style={{ background: "#0b0d0e" }}
      >
        <Background color="rgba(255,255,255,0.06)" gap={24} />
        
      </ReactFlow>
    </div>
  );
}


