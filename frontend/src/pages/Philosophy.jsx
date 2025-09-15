import React, { useEffect } from "react";
import { Button } from "../components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Toaster } from "../components/ui/sonner";
import { Link } from "react-router-dom";
import { Brain, ArrowRight, Target, Lightbulb, BookOpenText, Users } from "lucide-react";

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
      {/* accent background */}
      <div className="fixed inset-0 -z-20 bg-[radial-gradient(1200px_500px_at_80%_-10%,rgba(34,211,238,0.08),transparent)]" />
      <Nav />
      <main className="pt-28 md:pt-32 pb-12">
        <section className="mx-auto max-w-7xl px-6">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 backdrop-blur-xl text-xs text-white/70">Philosophy</div>
            <h1 className="mt-4 text-3xl md:text-5xl font-semibold tracking-tight">A vision for independent‑creator infrastructure</h1>
            <p className="mt-3 text-white/70">Alignment with the home’s Obsidian + Ice system.</p>
          </div>

          <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-5 md:gap-6">
            {/* Mission */}
            <Card className="bg-white/5 border-white/10 backdrop-blur-2xl">
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center gap-2 text-white">
                  <Target className="h-4 w-4 text-cyan-300" /> Mission
                </CardTitle>
              </CardHeader>
              <CardContent className="text-white/80 leading-relaxed space-y-3">
                <p className="font-semibold text-white">Codify and commoditize expertise.</p>
                <p>
                  Turn deep knowledge — from craft skills to decision frameworks — into modular building blocks anyone can use. iceOS makes expertise reproducible, testable, and scalable — so creators can build systems that think and act with their judgment.
                </p>
              </CardContent>
            </Card>

            {/* Vision */}
            <Card className="bg-white/5 border-white/10 backdrop-blur-2xl">
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center gap-2 text-white">
                  <Lightbulb className="h-4 w-4 text-cyan-300" /> Vision
                </CardTitle>
              </CardHeader>
              <CardContent className="text-white/80 leading-relaxed space-y-3">
                <p className="font-semibold text-white">Wisdom, Emerging.</p>
                <p>
                  The future of intelligence depends on capturing not just data, but judgment — the patterns of thought that create progress. By making expertise legible and composable, iceOS enables AI to inherit and extend the best of human thinking.
                </p>
              </CardContent>
            </Card>

            {/* Problem */}
            <Card className="bg-white/5 border-white/10 backdrop-blur-2xl">
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center gap-2 text-white">
                  <BookOpenText className="h-4 w-4 text-cyan-300" /> The Problem
                </CardTitle>
              </CardHeader>
              <CardContent className="text-white/80 leading-relaxed">
                <ul className="list-disc pl-5 space-y-2">
                  <li>Expertise is trapped — locked in heads, PDFs, and siloed systems.</li>
                  <li>Application is expensive — hiring and consulting are high-friction.</li>
                  <li>Knowledge transfer is lossy — judgment rarely survives beyond the expert.</li>
                </ul>
              </CardContent>
            </Card>

            {/* Target Market */}
            <Card className="bg-white/5 border-white/10 backdrop-blur-2xl">
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center gap-2 text-white">
                  <Users className="h-4 w-4 text-cyan-300" /> Target Market
                </CardTitle>
              </CardHeader>
              <CardContent className="text-white/80 leading-relaxed">
                <ul className="list-disc pl-5 space-y-2">
                  <li>Creators / SMEs: consultants, analysts, educators, solopreneurs.</li>
                  <li>Operators: founders, product managers, teams that need leverage.</li>
                  <li>Knowledge System Designers: people who want to encode how they think.</li>
                </ul>
              </CardContent>
            </Card>
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