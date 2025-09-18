import React from "react";
import { createPortal } from "react-dom";

export default function EduHoverCard({ anchorRect, title, body, visible }) {
  if (!visible || !anchorRect || typeof document === "undefined") return null;

  const top = anchorRect.top;
  const left = anchorRect.left + anchorRect.width / 2;

  return createPortal(
    <div style={{ position: "fixed", top, left, transform: "translate(-50%, -8px)", zIndex: 1000, pointerEvents: "none" }}>
      <div className="w-64 rounded-md border border-white/10 bg-white/95 p-3 text-black shadow-xl">
        {title ? <div className="text-xs font-semibold tracking-wide text-black/70">{title}</div> : null}
        {body ? <div className="mt-1.5 text-sm leading-snug">{body}</div> : null}
      </div>
    </div>,
    document.body
  );
}


