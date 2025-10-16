import React from "react";

export default function Logo({
  variant = "mark", // "mark" | "wordmark"
  title = "ALBUS",
  className = "",
  size = 28,
  src,
  tone = "onDark", // "onDark" uses light fill; "onLight" uses dark fill
}) {
  const defaultSrc = variant === "wordmark"
    ? "/brand/logo-wordmark.svg"
    : tone === "onDark" ? "/brand/logo-dark.svg" : "/brand/logo.svg";
  const resolved = src || defaultSrc;
  const alt = title;
  const style = size && variant !== "wordmark" ? { width: size, height: size } : undefined;
  if (variant === "wordmark") {
    return <img src={resolved} alt={alt} className={className} />;
  }
  return <img src={resolved} alt={alt} className={className} style={style} />;
}


