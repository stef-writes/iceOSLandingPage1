import React, { useEffect } from "react";
import { Button } from "../components/ui/button";
import { Card, CardContent } from "../components/ui/card";
import { Toaster } from "../components/ui/sonner";
import { Link } from "react-router-dom";
import { Brain, ArrowRight } from "lucide-react";

const Nav = () => (
  <div className="fixed top-0 left-0 right-0 z-40 backdrop-blur-xl bg-[rgba(10,12,14,0.5)] border-b border-white/10">
    <div className="mx-auto max-w-7xl px-6 py-3 flex items-center justify-between">
      <Link to="/" className="flex items-center gap-2">
        <div className="h-7 w-7 rounded-md bg-cyan-400/20 border border-cyan-300/30 grid place-items-center text-cyan-300">
          <Brain className="h-4 w-4" />
        </div>
        <span className="text-sm font-semibold tracking-wider text-white/90">iceOS</span>
      </Link>
      <div className="hidden md:flex items-center gap-7 text-sm text-white/70">
        <Link to="/philosophy" className="hover:text-white transition-colors">Philosophy</Link>
        <a href="/#what" className="hover:text-white transition-colors">What</a>
        <a href="/#why" className="hover:text-white transition-colors">Why</a>
        <a href="/#cta" className="hover:text-white transition-colors">Early Access</a>
      </div>
      <div className="flex items-center gap-3">
        <a href="/#cta">
          <Button className="h-9 px-4 bg-cyan-500 text-white hover:bg-cyan-400 shadow-[0_8px_30px_rgba(34,211,238,0.25)]">
            Join Waitlist
          </Button>
        </a>
      </div>
    </div>
  </div>
);

export default function Philosophy() {
  useEffect(() => {
    document.documentElement.style.scrollBehavior = "smooth";
    return () => { document.documentElement.style.scrollBehavior = "auto"; };
  }, []);

  return (
    <div className="dark theme-ice min-h-screen bg-[#0b0d0e] text-white">
      <Nav />
      <main className="pt-28 md:pt-32 pb-10">
        <section className="mx-auto max-w-7xl px-6">
          <h1 className="text-3xl md:text-5xl font-semibold tracking-tight">Philosophy</h1>
          <p className="mt-4 text-white/70 max-w-3xl">A vision for independent-creator infrastructure.</p>
          <div className="mt-8 grid gap-6">
            <Card className="bg-white/5 border-white/10 backdrop-blur-2xl"><CardContent className="p-6 text-white/80 leading-relaxed">[Vision] Placeholder: Why iceOS exists. The world where expertise is legible, durable, and deployable.</CardContent></Card>
            <Card className="bg-white/5 border-white/10 backdrop-blur-2xl"><CardContent className="p-6 text-white/80 leading-relaxed">[How it works] Placeholder: Turn expertise into living systems; encode, test, compose, deploy.</CardContent></Card>
            <Card className="bg-white/5 border-white/10 backdrop-blur-2xl"><CardContent className="p-6 text-white/80 leading-relaxed">[Underlying philosophy] Placeholder: Creators own their systems. Judgment compounds when it becomes infrastructure.</CardContent></Card>
          </div>
          <div className="mt-8">
            <Link to="/" className="inline-flex"><Button className="bg-cyan-500 hover:bg-cyan-400 text-white">Back to Home <ArrowRight className="h-4 w-4 ml-1" /></Button></Link>
          </div>
        </section>
      </main>
      <Toaster position="top-center" richColors closeButton />
    </div>
  );
}