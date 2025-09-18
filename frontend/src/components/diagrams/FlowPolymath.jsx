import React, { useCallback, useEffect } from "react";
import ReactFlow, { Background, addEdge, useEdgesState, useNodesState, Position } from "reactflow";
import "reactflow/dist/style.css";

const initialNodes = [
  { id: "input", position: { x: 0, y: 220 }, data: { label: "Transcript / Paper / Notes" }, style: { width: 240 }, sourcePosition: Position.Right },
  { id: "k-ra", position: { x: 320, y: 140 }, data: { label: "Research Agent" }, style: { width: 220 }, targetPosition: Position.Left, sourcePosition: Position.Right },
  { id: "k-pl", position: { x: 320, y: 240 }, data: { label: "Philosophy Lens" }, style: { width: 220 }, targetPosition: Position.Left, sourcePosition: Position.Right },
  { id: "k-te", position: { x: 320, y: 340 }, data: { label: "Technical Explainer" }, style: { width: 220 }, targetPosition: Position.Left, sourcePosition: Position.Right },
  { id: "s-ig", position: { x: 640, y: 160 }, data: { label: "Idea Extrapolator" }, style: { width: 240 }, targetPosition: Position.Left, sourcePosition: Position.Right },
  { id: "s-ca", position: { x: 640, y: 260 }, data: { label: "Critic Agent" }, style: { width: 240 }, targetPosition: Position.Left, sourcePosition: Position.Right },
  { id: "s-sz", position: { x: 640, y: 360 }, data: { label: "Synthesizer" }, style: { width: 260 }, targetPosition: Position.Left, sourcePosition: Position.Right },
  { id: "d-pod", position: { x: 980, y: 140 }, data: { label: "Draft — Podcast" }, style: { width: 200 }, targetPosition: Position.Left },
  { id: "d-blog", position: { x: 980, y: 220 }, data: { label: "Draft — Blog" }, style: { width: 200 }, targetPosition: Position.Left },
  { id: "d-note", position: { x: 980, y: 300 }, data: { label: "Draft — Notebook" }, style: { width: 200 }, targetPosition: Position.Left },
  { id: "d-social", position: { x: 980, y: 380 }, data: { label: "Draft — Social" }, style: { width: 200 }, targetPosition: Position.Left },
];

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
        proOptions={{ hideAttribution: true }}
        defaultEdgeOptions={{ type: "smoothstep", style: { stroke: "#22d3ee" } }}
        style={{ background: "#0b0d0e" }}
      >
        <Background color="rgba(255,255,255,0.06)" gap={24} />
        
      </ReactFlow>
    </div>
  );
}


