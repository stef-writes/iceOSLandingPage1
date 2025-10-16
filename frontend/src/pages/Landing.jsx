import React, { useEffect, useState } from "react";
import { Button } from "../components/ui/button";
import { GradientBorderButton, PrimaryButton } from "../components/ui/brand-buttons";
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
} from "lucide-react";


const Hero = () => {
  return (
    <section id="top" className="relative pt-28 md:pt-32 pb-10 motion-safe:animate-fade-in-up">
      {/* Decorative layers */}
      <div className="absolute inset-0 -z-10">
        <div className="pointer-events-none absolute -top-24 right-0 h-80 w-80 rounded-full blur-3xl bg-[hsl(var(--primary)/0.20)]" />
        <div className="pointer-events-none absolute bottom-0 -left-20 h-72 w-72 rounded-full blur-3xl bg-[hsl(var(--accent)/0.10)]" />
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(1000px_400px_at_80%_0%,hsl(var(--primary)/0.10),transparent)]" />
      </div>

      <div className="mx-auto max-w-7xl px-6">
        <div className="max-w-3xl">
          <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 backdrop-blur-2xl text-xs text-white/70">
            <Zap className="h-3.5 w-3.5 text-[hsl(var(--primary))]" />
            <span className="rounded-full px-2 py-0.5 bg-[hsl(var(--product)/0.12)] text-[hsl(var(--product))] border border-[hsl(var(--product)/0.30)]">iceOS</span>
            <span className="text-white/60">by ALBUS</span>
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
              <GradientBorderButton className="group h-11 px-5">
                {content.sections.hero.cta}
                <ArrowRight className="h-4 w-4 ml-1 transition-transform group-hover:translate-x-0.5" />
              </GradientBorderButton>
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
      <Card className="bg-card border-white/10 backdrop-blur-2xl shadow-glass">
        <CardHeader className="flex flex-row items-center justify-between p-6">
          <CardTitle className="text-white/90 flex items-center gap-2">
            <Play className="h-4 w-4 text-[#6FD6FF]" /> {content.sections.demo.title}
            <span className="ml-2 text-xs text-white/50">{content.sections.demo.status.replace('-', ' ')}</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="pb-6 px-6">
          <AspectRatio ratio={16/9}>
            <div className="w-full h-full grid place-items-center rounded-lg border border-white/10 bg-card text-white/70">
              {content.sections.demo.note}
            </div>
          </AspectRatio>
        </CardContent>
      </Card>
    </div>
  </section>
);

// Relation band removed for a cleaner, more subtle hierarchy

const WhatItIs = () => (
  <section id="what" className="py-10 scroll-mt-24">
    <div className="mx-auto max-w-7xl px-6">
      <h2 className="text-2xl md:text-3xl font-semibold text-white">Your Expertise, Productized</h2>
      <p className="mt-3 text-white/70 max-w-3xl leading-relaxed">Capture decision frameworks and creative processes as reusable blueprints. What makes your thinking unique becomes your most valuable asset.</p>
    </div>
  </section>
);

const WhatMakesItDifferent = () => (
  <section id="different" className="py-10 scroll-mt-24">
    <div className="mx-auto max-w-7xl px-6">
      <h2 className="mt-3 text-2xl md:text-3xl font-semibold text-white">Beyond Task Automation</h2>
      <p className="mt-3 italic text-white/70">Other tools give outputs. iceOS makes your judgment the product.</p>
      <ul className="mt-3 list-disc pl-5 space-y-1 text-white/70">
        <li><span className="font-medium text-white/80">Reusable</span> → Build once, run anywhere</li>
        <li><span className="font-medium text-white/80">Composable</span> → Combine systems to create new capabilities</li>
        <li><span className="font-medium text-white/80">Governed</span> → Version control for your thinking</li>
      </ul>
    </div>
  </section>
);

const WhyItMatters = () => (
  <section id="why" className="py-10 scroll-mt-24">
    <div className="mx-auto max-w-7xl px-6">
      <h3 className="mt-3 text-2xl md:text-3xl font-semibold text-white">Why This Matters Now</h3>
      <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="rounded-lg border border-white/10 bg-card shadow-glass p-4">
          <div className="text-white font-medium">Scale Your Impact</div>
          <p className="mt-1 text-white/70 text-sm">Reach more people without more hours.</p>
        </div>
        <div className="rounded-lg border border-white/10 bg-card shadow-glass p-4">
          <div className="text-white font-medium">Predictable Economics</div>
          <p className="mt-1 text-white/70 text-sm">Per-run pricing like cloud compute.</p>
        </div>
        <div className="rounded-lg border border-white/10 bg-card shadow-glass p-4">
          <div className="text-white font-medium">Own Your Stack</div>
          <p className="mt-1 text-white/70 text-sm">Build beyond platform constraints.</p>
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
      toast.success("You're on the list! ✨");
      setEmail("");
      setRole("");
      setUsecase("");
      setHp("");
    } catch (err) {
      const status = err?.response?.status;
      const msg = status === 409 ? "You're already signed up" : (err?.response?.data?.detail || "Something went wrong");
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
                <Label htmlFor="role" className="text-white/80">What you do</Label>
                <Select value={role} onValueChange={setRole}>
                  <SelectTrigger id="role" className="bg-black/40 border-white/10 text-white focus-visible:ring-cyan-400 focus-visible:ring-offset-1 focus-visible:ring-offset-[#0b0d0e]">
                    <SelectValue placeholder="Select your role" />
                  </SelectTrigger>
                  <SelectContent className="bg-[#0b0d0e] text-white border-white/10">
                    {[
                      "Founder / Creator",
                      "Operator",
                      "Engineer",
                      "Consultant",
                      "Designer",
                      "Other",
                    ].map((r) => (
                      <SelectItem key={r} value={r}>{r}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="usecase" className="text-white/80">What expertise would you turn into a system?</Label>
                <Textarea
                  id="usecase"
                  value={usecase}
                  onChange={(e) => setUsecase(e.target.value)}
                  placeholder="What expertise would you turn into a system?"
                  className="min-h-[96px] bg-black/40 border-white/10 text-white placeholder:text-white/40 focus-visible:ring-cyan-400 focus-visible:ring-offset-1 focus-visible:ring-offset-[#0b0d0e]"
                />
              </div>
              <GradientBorderButton
                type="submit"
                disabled={saving}
                className="h-11">
                {saving ? "Joining…" : content.sections.finalCta.cta}
                {!saving && <ArrowRight className="h-4 w-4 ml-1" />}
              </GradientBorderButton>
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
        <div className="h-6 w-6 rounded-md bg-[rgba(174,60,224,0.20)] border border-[rgba(174,60,224,0.30)] grid place-items-center text-[#AE3CE0]">
          <Brain className="h-3.5 w-3.5" />
        </div>
        <span>© {new Date().getFullYear()} ALBUS</span>
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
    <div className="dark theme-ice min-h-screen bg-[#0C0812] text.white">
      {/* page bg subtle noise and grid */}
      <div className="fixed inset-0 -z-20 bg-[radial-gradient(1200px_500px_at_80%_-10%,rgba(174,60,224,0.10),transparent)]" />
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