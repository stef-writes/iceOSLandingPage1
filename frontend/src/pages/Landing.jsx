import React, { useEffect, useState } from "react";
import { Button } from "../components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Input } from "../components/ui/input";
import { Textarea } from "../components/ui/textarea";
import { Label } from "../components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/select";
import { AspectRatio } from "../components/ui/aspect-ratio";
import { Toaster } from "../components/ui/sonner";
import { toast } from "sonner";
import { content } from "../mock/mock";
import { createWaitlist } from "../lib/api";
import { Link, useLocation } from "react-router-dom";
import Nav from "../components/Nav";
import {
  ArrowRight,
  Brain,
  Zap,
  Mail,
  Play,
  Eye,
} from "lucide-react";


const Hero = () => {
  return (
    <section id="top" className="relative pt-28 md:pt-32 pb-10 motion-safe:animate-fade-in-up">
      {/* Decorative layers */}
      <div className="absolute inset-0 -z-10">
        <div className="pointer-events-none absolute -top-24 right-0 h-80 w-80 rounded-full blur-3xl bg-cyan-400/20" />
        <div className="pointer-events-none absolute bottom-0 -left-20 h-72 w-72 rounded-full blur-3xl bg-teal-500/10" />
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(1000px_400px_at_80%_0%,rgba(34,211,238,0.10),transparent)]" />
      </div>

      <div className="mx-auto max-w-7xl px-6">
        <div className="max-w-3xl">
          <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 backdrop-blur-2xl text-xs text-white/70">
            <Zap className="h-3.5 w-3.5 text-cyan-300" />
            {content.sections.hero.eyebrow}
          </div>
          <h1 className="mt-5 text-4xl md:text-6xl font-semibold tracking-tight text-white">
            {content.sections.hero.headline}
          </h1>
          <p className="mt-4 text-lg md:text-xl text-white/70">
            {content.sections.hero.subhead}
          </p>
          {content.sections?.hero?.accent && (
            <p className="mt-2 text-sm text-white/60">
              {content.sections.hero.accent}
            </p>
          )}

          <div className="mt-8 flex flex-col sm:flex-row gap-3">
            <a href="#cta">
              <Button className="group h-11 px-5 bg-cyan-500 hover:bg-cyan-400 text-white shadow-[0_8px_30px_rgba(34,211,238,0.25)] focus-visible:ring-cyan-400 focus-visible:ring-offset-1 focus-visible:ring-offset-[#0b0d0e]">
                {content.sections.hero.cta}
                <ArrowRight className="h-4 w-4 ml-1 transition-transform group-hover:translate-x-0.5" />
              </Button>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

const Demo = () => (
  <section id="demo" className="py-10 motion-safe:animate-fade-in-up scroll-mt-24">
    <div className="mx-auto max-w-7xl px-6">
      <Card className="bg-white/5 border-white/10 backdrop-blur-2xl">
        <CardHeader className="flex flex-row items-center justify-between p-6">
          <CardTitle className="text-white/90 flex items-center gap-2">
            <Play className="h-4 w-4 text-cyan-300" /> {content.sections.demo.title}
            <span className="ml-2 text-xs text-white/50">{content.sections.demo.status.replace('-', ' ')}</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="pb-6 px-6">
          <AspectRatio ratio={16/9}>
            <div className="w-full h-full grid place-items-center rounded-lg border border-white/10 bg-gradient-to-b from-white/5 to-transparent text-white/70">
              {content.sections.demo.note}
            </div>
          </AspectRatio>
        </CardContent>
      </Card>
    </div>
  </section>
);

const WhatItIs = () => (
  <section id="what" className="py-10 scroll-mt-24">
    <div className="mx-auto max-w-7xl px-6">
      <h2 className="text-2xl md:text-3xl font-semibold text-white">From nodes to systems</h2>
      <p className="mt-3 text-white/70 max-w-3xl leading-relaxed">Design judgment — not just tasks — reproducible, shareable, and improvable.</p>
    </div>
  </section>
);

const WhatMakesItDifferent = () => (
  <section id="different" className="py-10 scroll-mt-24">
    <div className="mx-auto max-w-7xl px-6">
      <div className="flex items-center gap-2 text-white/60 text-xs">
        <Eye className="h-4 w-4 text-cyan-300/80" />
        <span>What makes it different</span>
      </div>
      <h2 className="mt-3 text-2xl md:text-3xl font-semibold text-white">What makes it different</h2>
      <p className="mt-3 italic text-white/70">Other tools give outputs. iceOS makes thinking a design material.</p>
      <ul className="mt-3 list-disc pl-5 space-y-1 text-white/70">
        <li><span className="font-medium text-white/80">Network</span> → Designed systems can be shared, remixed, and scaled.</li>
        <li><span className="font-medium text-white/80">Trust</span> → Designed thinking is inspectable, governed, and improvable.</li>
      </ul>
    </div>
  </section>
);

const WhyItMatters = () => (
  <section id="why" className="py-10 scroll-mt-24">
    <div className="mx-auto max-w-7xl px-6">
      <div className="flex items-center gap-2 text-white/60 text-xs">
        <Eye className="h-4 w-4 text-cyan-300/80" />
        <span>Why it matters now</span>
      </div>
      <h3 className="mt-3 text-2xl md:text-3xl font-semibold text-white">Why it matters now</h3>
      <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="rounded-lg border border-white/10 bg-white/[0.02] p-4">
          <div className="text-white font-medium">Composability</div>
          <p className="mt-1 text-white/70 text-sm">Mix workflows and philosophies to create new capabilities.</p>
        </div>
        <div className="rounded-lg border border-white/10 bg-white/[0.02] p-4">
          <div className="text-white font-medium">Cost clarity</div>
          <p className="mt-1 text-white/70 text-sm">Like cloud compute — predictable, per-run economics.</p>
        </div>
        <div className="rounded-lg border border-white/10 bg-white/[0.02] p-4">
          <div className="text-white font-medium">Influence Intelligence</div>
          <p className="mt-1 text-white/70 text-sm">Generate the judgment you value.</p>
        </div>
      </div>
    </div>
  </section>
);

const Waitlist = () => {
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("");
  const [usecase, setUsecase] = useState("");
  const [hp, setHp] = useState(""); // honeypot
  const [saving, setSaving] = useState(false);

  const onSubmit = async (e) => {
    e.preventDefault();
    if (!email) {
      toast.error("Please enter your email");
      return;
    }
    try {
      setSaving(true);
      const payload = { email, role: role || undefined, usecase: usecase || undefined, hp: hp || undefined };
      await createWaitlist(payload);
      toast.success("You're on the list ✨");
      setEmail("");
      setRole("");
      setUsecase("");
      setHp("");
    } catch (err) {
      const status = err?.response?.status;
      const msg = status === 409 ? "You're already on the list." : (err?.response?.data?.detail || "Something went wrong. Please try again.");
      toast.error(String(msg));
    } finally {
      setSaving(false);
    }
  };

  return (
    <section id="cta" className="py-10 scroll-mt-24">
      <div className="mx-auto max-w-7xl px-6 grid lg:grid-cols-2 gap-10 items-start">
        <div>
          <h3 className="text-2xl md:text-3xl font-semibold text-white">{content.sections.finalCta.title}</h3>
          <p className="mt-4 text-white/70 leading-relaxed max-w-2xl">{content.sections.finalCta.copy}</p>
        </div>
        <div>
          <form onSubmit={onSubmit} className="rounded-xl border border-white/10 bg-white/5 backdrop-blur-2xl p-6">
            <input type="text" value={hp} onChange={(e)=>setHp(e.target.value)} className="hidden" aria-hidden="true" tabIndex="-1" autoComplete="off" />
            <div className="grid gap-4">
              <div className="grid gap-2">
                <Label htmlFor="email" className="text-white/80">Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-white/40" />
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@company.com"
                    className="pl-9 bg-black/40 border-white/10 text-white placeholder:text-white/40 focus-visible:ring-cyan-400 focus-visible:ring-offset-1 focus-visible:ring-offset-[#0b0d0e]"
                  />
                </div>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="role" className="text-white/80">Role</Label>
                <Select value={role} onValueChange={setRole}>
                  <SelectTrigger id="role" className="bg-black/40 border-white/10 text-white focus-visible:ring-cyan-400 focus-visible:ring-offset-1 focus-visible:ring-offset-[#0b0d0e]">
                    <SelectValue placeholder="Select a role" />
                  </SelectTrigger>
                  <SelectContent className="bg-[#0b0d0e] text-white border-white/10">
                    {[
                      "Founder / Creator",
                      "Operator / Ops",
                      "Engineer",
                      "System Designer",
                      "Other",
                    ].map((r) => (
                      <SelectItem key={r} value={r}>{r}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="usecase" className="text-white/80">What will you build?</Label>
                <Textarea
                  id="usecase"
                  value={usecase}
                  onChange={(e) => setUsecase(e.target.value)}
                  placeholder="Briefly describe your system or judgment you want to scale"
                  className="min-h-[96px] bg-black/40 border-white/10 text-white placeholder:text-white/40 focus-visible:ring-cyan-400 focus-visible:ring-offset-1 focus-visible:ring-offset-[#0b0d0e]"
                />
              </div>
              <Button
                type="submit"
                disabled={saving}
                className="h-11 bg-cyan-500 hover:bg-cyan-400 text-white shadow-[0_8px_30px_rgba(34,211,238,0.25)] focus-visible:ring-cyan-400 focus-visible:ring-offset-1 focus-visible:ring-offset-[#0b0d0e]">
                {saving ? "Joining…" : content.sections.finalCta.cta}
                {!saving && <ArrowRight className="h-4 w-4 ml-1" />}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
};

const Footer = () => (
  <footer className="mt-8 border-t border-white/10">
    <div className="mx-auto max-w-7xl px-6 py-6 flex flex-col md:flex-row items-center justify-between gap-3 text-white/60 text-sm">
      <div className="flex items-center gap-2">
        <div className="h-6 w-6 rounded-md bg-cyan-400/20 border border-cyan-300/30 grid place-items-center text-cyan-300">
          <Brain className="h-3.5 w-3.5" />
        </div>
        <span>© {new Date().getFullYear()} iceOS</span>
      </div>
    </div>
  </footer>
);

export default function Landing() {
  useEffect(() => {
    // Smooth scroll behavior for anchor links
    document.documentElement.style.scrollBehavior = "smooth";
    return () => {
      document.documentElement.style.scrollBehavior = "auto";
    };
  }, []);

  return (
    <div className="dark theme-ice min-h-screen bg-[#0b0d0e] text.white">
      {/* page bg subtle noise and grid */}
      <div className="fixed inset-0 -z-20 bg-[radial-gradient(1200px_500px_at_80%_-10%,rgba(34,211,238,0.08),transparent)]" />
      <Nav />
      <main className="relative">
        <Hero />
        <Demo />
        <WhatItIs />
        <WhatMakesItDifferent />
        <WhyItMatters />
        <Waitlist />
      </main>
      <Footer />
      <Toaster position="top-center" richColors closeButton />
    </div>
  );
}