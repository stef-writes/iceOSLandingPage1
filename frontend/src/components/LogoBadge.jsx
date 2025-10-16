import React from "react";
import Logo from "./Logo";

export default function LogoBadge({
  size = 28,
  className = "",
  tone = "onDark",
  title = "ALBUS",
  src, // optional: use PNG or custom asset
  alt,
  compact = false,
  scale = 1,
}) {
  return (
    <span className={`inline-flex ${compact ? "rounded-[8px]" : "rounded-[10px]"} p-[1px] bg-albus-gradient ${className}`}>
      <span className={`relative ${compact ? "rounded-[8px]" : "rounded-[10px]"} bg-card border border-white/10 shadow-glass overflow-hidden`}>
        <span className={`block ${compact ? "p-0" : "p-1.5"}`}>
          {src ? (
            <img src={src} alt={alt || title} style={{ width: size, height: size, transform: `scale(${scale})`, transformOrigin: "center" }} />
          ) : (
            <span style={{ display: "inline-block", width: size, height: size, transform: `scale(${scale})`, transformOrigin: "center" }}>
              <Logo size={size} tone={tone} title={title} />
            </span>
          )}
        </span>
        <span className={`pointer-events-none absolute inset-0 ${compact ? "rounded-[8px]" : "rounded-[10px]"} overflow-hidden`}>
          <span className="absolute inset-0 bg-[linear-gradient(180deg,rgba(255,255,255,0.22),rgba(255,255,255,0)_35%)]" />
        </span>
      </span>
    </span>
  );
}


