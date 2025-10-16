import React from "react";
import { Button } from "./button";

export function PrimaryButton({ className = "", ...props }) {
  return (
    <Button
      className={`bg-[hsl(var(--primary))] text-[hsl(var(--primary-foreground))] hover:opacity-95 shadow-[0_8px_24px_rgba(0,0,0,0.6)] rounded-[12px] ${className}`}
      {...props}
    />
  );
}

export function SecondaryButton({ className = "", ...props }) {
  return (
    <Button
      variant="outline"
      className={`text-[hsl(var(--foreground))] border-[hsl(var(--primary)/0.35)] hover:border-[hsl(var(--product)/0.6)] hover:bg-[linear-gradient(135deg,rgba(198,58,244,0.08),rgba(70,189,244,0.08))] rounded-[12px] ${className}`}
      {...props}
    />
  );
}

export function GradientBorderButton({ className = "", ...props }) {
  return (
    <span className="inline-flex rounded-[12px] p-[1px] bg-albus-gradient">
      <Button
        className={`rounded-[12px] border-0 bg-card text-[hsl(var(--foreground))] hover:bg-card/90 shadow-glass ${className}`}
        {...props}
      />
    </span>
  );
}
