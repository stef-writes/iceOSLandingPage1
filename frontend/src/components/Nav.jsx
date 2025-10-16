import React from "react";
import { Link, useLocation } from "react-router-dom";
import { Button } from "./ui/button";
import { GradientBorderButton } from "./ui/brand-buttons";
import { Brain } from "lucide-react";
import Logo from "./Logo";
import LogoBadge from "./LogoBadge";

export default function Nav() {
  const location = useLocation();
  const isHome = location.pathname === "/";
  const isLearn = location.pathname === "/learn";
  const linkBase = "transition-colors hover:underline underline-offset-4 decoration-white/30";

  return (
    <div className="fixed top-0 left-0 right-0 z-40 backdrop-blur-xl bg-[hsl(var(--background)/0.6)] border-b border-white/10">
      <div className="mx-auto max-w-7xl px-6 py-3 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <LogoBadge compact size={26} scale={1.22} src="/brand/logopic.png" alt="ALBUS" />
          <span className="text-sm font-semibold tracking-wider text-white/90">ALBUS</span>
        </Link>

        <div className="hidden md:flex items-center gap-7 text-sm text-white/70">
          <Link to="/" className={`${linkBase} ${isHome ? "text-white" : "hover:text-white"}`}>Home</Link>
          <Link to="/learn" className={`${linkBase} ${isLearn ? "text-white" : "hover:text-white"}`}>Learn</Link>
        </div>

        <div className="flex items-center gap-3">
          <a href="/#cta">
            <GradientBorderButton className="h-9 px-4">
              Join Waitlist
            </GradientBorderButton>
          </a>
        </div>
      </div>
    </div>
  );
}


