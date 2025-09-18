import React, { useEffect } from "react";
import Nav from "../components/Nav";
import { Toaster } from "../components/ui/sonner";
import { Workflow, Eye, ChevronRight } from "lucide-react";
import PolymathDiagram from "../components/diagrams/PolymathDiagram";

export default function LearnMore() {
  useEffect(() => {
    document.documentElement.style.scrollBehavior = "smooth";
    return () => { document.documentElement.style.scrollBehavior = "auto"; };
  }, []);

  return (
    <div className="dark theme-ice min-h-screen bg-[#0b0d0e] text-white">
      <div className="fixed inset-0 -z-20 bg-[radial-gradient(1200px_500px_at_80%_-10%,rgba(34,211,238,0.08),transparent)]" />
      <Nav />
      <main className="pt-28 md:pt-32 pb-12 motion-safe:animate-fade-in-up">
        <section className="mx-auto max-w-7xl px-6">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 backdrop-blur-xl text-xs text-white/70">Learn More</div>
            <h1 className="mt-4 text-3xl md:text-5xl font-semibold tracking-tight">Build systems that think with your judgment</h1>
            <p className="mt-3 text-white/70">iceOS turns what makes us human — expertise, decision frameworks, creative processes, and values — into modular systems anyone can run.</p>
          </div>

          <div className="mt-10 mx-auto max-w-3xl border-t border-white/10" />

          {/* From Nodes to Systems */}
          <div className="py-10 grid md:grid-cols-5 gap-8 items-start">
            <div className="md:col-span-3 max-w-3xl">
              <div className="flex items-center gap-2 text-white/60 text-xs">
                <Workflow className="h-4 w-4 text-cyan-300/80" />
                <span>From Nodes to Systems</span>
              </div>
              <h2 className="mt-3 text-2xl md:text-3xl font-semibold text-white">From nodes to systems</h2>
              <p className="mt-3 text-white/70">You don’t just automate tasks. You design thinking.</p>
              <p className="mt-2 text-white/70">With nodes, you design reasoning steps.</p>
              <p className="mt-1.5 text-white/70">With workflows, you design processes.</p>
              <p className="mt-1.5 text-white/70">With systems, you design judgment itself — reproducible, shareable, and improvable.</p>

              <div className="mt-4 flex flex-wrap items-center gap-2 text-sm text-white/80">
                <span className="px-3 py-1 rounded-full bg-white/5 border border-white/10">Nodes</span>
                <ChevronRight className="h-4 w-4 text-white/40" aria-hidden="true" />
                <span className="px-3 py-1 rounded-full bg-white/5 border border-white/10">Workflows</span>
                <ChevronRight className="h-4 w-4 text-white/40" aria-hidden="true" />
                <span className="px-3 py-1 rounded-full bg-white/5 border border-white/10">Systems</span>
              </div>
            </div>
          </div>

          <div className="mx-auto max-w-3xl border-t border-white/10" />

          {/* Polymath Diagram (scaffold) */}
          <div className="py-6">
            <PolymathDiagram />
          </div>

          <div className="mx-auto max-w-3xl border-t border-white/10" />

          {/* What makes it different */}
          <div className="py-10 grid md:grid-cols-5 gap-8 items-start">
            <div className="md:col-span-3 max-w-3xl">
              <div className="flex items-center gap-2 text-white/60 text-xs">
                <Eye className="h-4 w-4 text-cyan-300/80" />
                <span>What makes it different</span>
              </div>
              <h2 className="mt-3 text-2xl md:text-3xl font-semibold text-white">What makes it different</h2>
              <p className="mt-3 italic text-white/70">Other tools give outputs. iceOS makes thinking a design material.</p>
              <ul className="mt-3 list-disc pl-5 space-y-1 text-white/70">
                <li><span className="font-medium text-white/80">Leverage</span> → Capture once, apply everywhere.</li>
                <li><span className="font-medium text-white/80">Network</span> → Designed systems can be shared, remixed, and scaled.</li>
                <li><span className="font-medium text-white/80">Trust</span> → Designed thinking is inspectable, governed, and improvable.</li>
              </ul>
            </div>
          </div>

          <div className="mx-auto max-w-3xl border-t border-white/10" />

          {/* Why it matters now */}
          <div className="py-10">
            <div className="flex items-center gap-2 text-white/60 text-xs">
              <Eye className="h-4 w-4 text-cyan-300/80" />
              <span>Why it matters now</span>
            </div>
            <h2 className="mt-3 text-2xl md:text-3xl font-semibold text-white">Why it matters now</h2>
            <div className="mt-5 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="rounded-lg border border-white/10 bg-white/[0.02] p-4">
                <div className="text-white font-medium">Leverage</div>
                <p className="mt-1 text-white/70 text-sm">Design Thinking; apply it infinitely.</p>
              </div>
              <div className="rounded-lg border border-white/10 bg-white/[0.02] p-4">
                <div className="text-white font-medium">Reliability</div>
                <p className="mt-1 text-white/70 text-sm">Consistent outcomes, auditable logic, no surprises.</p>
              </div>
              <div className="rounded-lg border border-white/10 bg-white/[0.02] p-4">
                <div className="text-white font-medium">Composability</div>
                <p className="mt-1 text-white/70 text-sm">Mix workflows and philosophies to create new capabilities.</p>
              </div>
              <div className="rounded-lg border border-white/10 bg-white/[0.02] p-4">
                <div className="text-white font-medium">Cost clarity</div>
                <p className="mt-1 text-white/70 text-sm">Like cloud compute — predictable, per-run economics.</p>
              </div>
            </div>
          </div>

          <div className="mx-auto max-w-3xl border-t border-white/10" />

          {/* Where this goes */}
          <div className="py-10">
            <div className="flex items-center gap-2 text-white/60 text-xs">
              <Eye className="h-4 w-4 text-cyan-300/80" />
              <span>Where this goes</span>
            </div>
            <h2 className="mt-3 text-2xl md:text-3xl font-semibold text-white">Where this goes</h2>
            <div className="mt-3 rounded-xl border border-white/10 bg-white/[0.03] p-6">
              <p className="text-white/70">The future of intelligence is designed — not discovered by accident. As more creators design their ways of thinking, intelligence becomes a living fabric we can all build on.</p>
            </div>
          </div>
        </section>
      </main>
      <Toaster position="top-center" richColors closeButton />
    </div>
  );
}


