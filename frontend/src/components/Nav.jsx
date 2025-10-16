import React from "react";
import { Link, useLocation } from "react-router-dom";
import { Button } from "./ui/button";
import { Brain } from "lucide-react";

export default function Nav() {
  const location = useLocation();
  const isHome = location.pathname === "/";
  const isLearn = false;
  const linkBase = "transition-colors hover:underline underline-offset-4 decoration-white/30";

  return (
    <div className="fixed top-0 left-0 right-0 z-40 backdrop-blur-xl bg-[rgba(12,8,18,0.6)] border-b border-white/10">
      <div className="mx-auto max-w-7xl px-6 py-3 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <div className="h-7 w-7 rounded-md bg-[rgba(174,60,224,0.20)] border border-[rgba(174,60,224,0.30)] grid place-items-center text-[#AE3CE0]">
            <Brain className="h-4 w-4" />
          </div>
          <span className="text-sm font-semibold tracking-wider text-white/90">iceOS</span>
        </Link>

        <div className="hidden md:flex items-center gap-7 text-sm text-white/70">
          <Link to="/" className={`${linkBase} ${isHome ? "text-white" : "hover:text-white"}`}>Home</Link>
          
        </div>

        <div className="flex items-center gap-3">
          <a href="/#cta">
            <Button className="h-9 px-4 bg-[#AE3CE0] text-white hover:bg-[#9b2fd1] shadow-[0_8px_30px_rgba(174,60,224,0.28)] focus-visible:ring-[#AE3CE0] focus-visible:ring-offset-1 focus-visible:ring-offset-[#0C0812]">
              Join Waitlist
            </Button>
          </a>
        </div>
      </div>
    </div>
  );
}


