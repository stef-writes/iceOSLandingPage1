import React, { useEffect } from "react";
import Nav from "../components/Nav";

export default function Vision() {
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
        <section className="mx-auto max-w-4xl px-6">
          <h1 className="text-3xl md:text-4xl font-semibold tracking-tight text-white">Vision</h1>
          <p className="mt-4 text-white/70 leading-relaxed">
            Placeholder copy: Share the future we’re building toward. Describe how independent creators leverage iceOS to
            scale their judgment, collaborate across systems, and own their stack. Replace this with real narrative and
            visuals as they’re ready.
          </p>
        </section>
      </main>
    </div>
  );
}


