import React, { useEffect } from "react";
import Nav from "../components/Nav";
import { AspectRatio } from "../components/ui/aspect-ratio";

export default function Learn() {
  useEffect(() => {
    document.documentElement.style.scrollBehavior = "smooth";
    return () => {
      document.documentElement.style.scrollBehavior = "auto";
    };
  }, []);

  return (
    <div className="dark theme-ice min-h-screen bg-[#0C0812] text.white">
      <div className="fixed inset-0 -z-20 bg-[radial-gradient(1200px_500px_at_80%_-10%,rgba(174,60,224,0.10),transparent)]" />
      <Nav />
      <main className="relative pt-28 md:pt-32 pb-16">
        <section className="mx-auto max-w-7xl px-6">
          <h1 className="text-3xl md:text-4xl font-semibold tracking-tight text-white">How It Works</h1>
          <p className="mt-3 text-white/70 max-w-3xl">A simple, image-only gallery to preview flows. Replace these placeholders with your real diagrams or screenshots when ready.</p>
        </section>

        <section className="mx-auto max-w-7xl px-6 mt-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {[1,2,3,4,5,6].map((i) => (
              <AspectRatio key={i} ratio={16/9}>
                <div className="w-full h-full rounded-lg border border-white/10 bg-[#0b0d0e] grid place-items-center text-white/60">
                  <div className="text-center">
                    <div className="text-sm">Placeholder {i}</div>
                    <div className="mt-1 text-xs text-white/40">Drop an image here later</div>
                  </div>
                </div>
              </AspectRatio>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}


