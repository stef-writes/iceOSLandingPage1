import React from "react";
import { Handle, Position } from "reactflow";
import EduHoverCard from "./EduHoverCard";

export default function EduNode({ data }) {
  const [hovered, setHovered] = React.useState(false);
  const ref = React.useRef(null);
  const [rect, setRect] = React.useState(null);
  const showHint = data?.showHint === true;
  const title = data?.cardTitle;
  const body = data?.cardBody;

  React.useEffect(() => {
    if (!ref.current) return;
    setRect(ref.current.getBoundingClientRect());
  }, [hovered]);

  return (
    <div ref={ref} style={{ position: "relative" }} onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)}>
      <div style={{ padding: "10px 12px", borderRadius: 12, border: "1px solid rgba(255,255,255,0.45)", background: "transparent" }}>
        <div style={{ fontSize: 14, lineHeight: 1.2 }}>{data?.label}</div>
        {showHint ? (
          <div className="absolute -top-1.5 -right-1.5" aria-hidden>
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-300 opacity-40" />
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-cyan-400" />
            </span>
          </div>
        ) : null}
        <Handle type="target" position={Position.Left} style={{ background: "#22d3ee" }} />
        <Handle type="source" position={Position.Right} style={{ background: "#22d3ee" }} />
      </div>
      <EduHoverCard anchorRect={rect} title={title} body={body} visible={showHint && hovered} />
    </div>
  );
}


