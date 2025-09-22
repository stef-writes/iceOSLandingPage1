import React, { useEffect, useState } from "react";
import { diagramPresets } from "./presets";
import { diagramTokens } from "./tokens";

// Minimal registry. Register diagrams here as you add them.
const registry = Object.freeze({
  practice: () => import("./practice/Diagram.jsx"),
  graph: () => import("./graph/Diagram.jsx"),
  // example: polymath: () => import("./polymath/Diagram.jsx"),
});

export default function DiagramHost({
  name,
  preset,
  config,
  minHeight = 420,
  aspect = null, // e.g., 16/9
  className = "",
  loadingText = "Diagram loading…",
  errorText = "Diagram failed to load",
}) {
  const Loader = name ? registry[name] : null;
  const [Comp, setComp] = useState(null);
  const [error, setError] = useState(null);

  const merged = {
    ...(preset ? diagramPresets[preset] : {}),
    ...(config || {}),
  };

  useEffect(() => {
    let active = true;
    setComp(null);
    setError(null);
    if (!Loader) return;
    Loader()
      .then((m) => {
        if (!active) return;
        setComp(() => m.default || m.Diagram || null);
      })
      .catch((e) => {
        if (!active) return;
        setError(e);
      });
    return () => {
      active = false;
    };
  }, [name]);

  const containerStyle = aspect
    ? {
        minHeight,
        position: "relative",
        paddingTop: `${100 / aspect}%`,
        background: "#0b0d0e",
        border: "1px solid rgba(255,255,255,0.1)",
        borderRadius: 8,
      }
    : {
        minHeight,
        background: "#0b0d0e",
        border: "1px solid rgba(255,255,255,0.1)",
        borderRadius: 8,
        padding: 12,
      };

  const innerStyle = aspect ? { position: "absolute", inset: 12 } : {};

  return (
    <div className={className} style={containerStyle}>
      {Comp ? (
        <div style={innerStyle}>
          <Comp {...merged} tokens={diagramTokens} />
        </div>
      ) : error ? (
        <div style={{ color: "#ff6b6b", fontSize: 12, padding: 12 }}>{errorText}</div>
      ) : (
        <div style={{ color: "rgba(255,255,255,0.6)", fontSize: 12, padding: 12 }}>{loadingText}</div>
      )}
    </div>
  );
}


