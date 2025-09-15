import React, { useEffect, useMemo, useState } from "react";
import { Button } from "../components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Input } from "../components/ui/input";
import { Textarea } from "../components/ui/textarea";
import { Label } from "../components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/select";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "../components/ui/accordion";
import { Badge } from "../components/ui/badge";
import { Separator } from "../components/ui/separator";
import { Toaster } from "../components/ui/sonner";
import { toast } from "sonner";
import { content, saveWaitlistEntry, getWaitlistEntries } from "../mock/mock";
import {
  ArrowRight,
  Boxes,
  GitBranch,
  Network,
  Brain,
  Zap,
  ShieldCheck,
  Mail,
  User,
} from "lucide-react";

const iconMap = { Boxes, GitBranch, Network };

const Nav = () => {
  return (
    <div className="fixed top-0 left-0 right-0 z-40 backdrop-blur-xl bg-[rgba(10,12,14,0.5)] border-b border-white/10">
      <div className="mx-auto max-w-7xl px-6 py-3 flex items-center justify-between">
        <a href="#top" className="flex items-center gap-2">
          <div className="h-7 w-7 rounded-md bg-cyan-400/20 border border-cyan-300/30 grid place-items-center text-cyan-300">
            <Brain className="h-4 w-4" />
          </div>
          <span className="text-sm font-semibold tracking-wider text-white/90">iceOS</span>
        </a>
        <div className="hidden md:flex items-center gap-7 text-sm text-white/70">
          <a href="#building" className="hover:text-white transition-colors">Product</a>
          <a href="#why" className="hover:text-white transition-colors">Why</a>
          <a href="#who" className="hover:text-white transition-colors">Who</a>
          <a href="#cta" className="hover:text-white transition-colors">Early Access</a>
        </div>
        <div className="flex items-center gap-3">
          <a href="#cta">
            <Button className="h-9 px-4 bg-cyan-500 text-white hover:bg-cyan-400 shadow-[0_8px_30px_rgba(34,211,238,0.25)]">
              Join Waitlist
            </Button>
          </a>
        </div>
      </div>
    </div>
  );
};

const Hero = () => {
  return (
    <section id="top" className="relative pt-28 md:pt-32 pb-10 md:pb-16">
      {/* Decorative layers */}
      <div className="absolute inset-0 -z-10">
        <div className="pointer-events-none absolute -top-24 right-0 h-80 w-80 rounded-full blur-3xl bg-cyan-400/20" />
        <div className="pointer-events-none absolute bottom-0 -left-20 h-72 w-72 rounded-full blur-3xl bg-teal-500/10" />
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(1000px_400px_at_80%_0%,rgba(34,211,238,0.10),transparent)]" />
      </div>

      <div className="mx-auto max-w-7xl px-6">
        <div className="max-w-3xl">
          <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 backdrop-blur-xl text-xs text-white/70">
            <Zap className="h-3.5 w-3.5 text-cyan-300" />
            Pre‑launch invite program
          </div>
          <h1 className="mt-5 text-4xl md:text-6xl font-semibold tracking-tight text-white">
            {content.sections.hero.headline}
          </h1>
          <p className="mt-4 text-lg md:text-xl text-white/70">
            {content.sections.hero.subhead}
          </p>
          <p className="mt-3 text-base md:text-lg text-white/60">
            {content.sections.hero.body}
          </p>

          <div className="mt-8 flex flex-col sm:flex-row gap-3">
            <a href="#cta">
              <Button className="group h-11 px-5 bg-cyan-500 hover:bg-cyan-400 text-white shadow-[0_8px_30px_rgba(34,211,238,0.25)]">
                {content.sections.hero.cta}
                <ArrowRight className="h-4 w-4 ml-1 transition-transform group-hover:translate-x-0.5" />
              </Button>
            </a>
            <a href="#building" className="inline-flex h-11 items-center justify-center rounded-md border border-white/10 bg-white/5 px-5 text-white/80 hover:text-white hover:bg-white/10">
              See how it works
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

const PillarCard = ({ title, desc, Icon }) => (
  <Card className="bg-white/5 border-white/10 backdrop-blur-2xl hover:bg-white/7 transition-colors">
    <CardHeader className="flex-row items-center gap-3">
      <div className="h-9 w-9 rounded-md bg-cyan-400/15 border border-cyan-300/30 grid place-items-center text-cyan-300">
        <Icon className="h-4 w-4" />
      </div>
      <CardTitle className="text-white font-semibold">{title}</CardTitle>
    </CardHeader>
    <CardContent>
      <p className="text-white/70 text-sm leading-relaxed">{desc}</p>
    </CardContent>
  </Card>
);

const Building = () => {
  return (
    <section id="building" className="relative py-10 md:py-16">
      <div className="mx-auto max-w-7xl px-6">
        <div className="max-w-3xl">
          <h2 className="text-2xl md:text-3xl font-semibold text-white">{content.sections.building.title}</h2>
          <p className="mt-2 text-white/70">{content.sections.building.lead}</p>
          <p className="mt-3 text-white/60 max-w-2xl">{content.sections.building.copy}</p>
        </div>
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-5">
          {content.sections.building.pillars.map((p) => {
            const Ico = iconMap[p.icon] || Boxes;
            return <PillarCard key={p.title} title={p.title} desc={p.desc} Icon={Ico} />;
          })}
        </div>
      </div>
    </section>
  );
};

const WhyMatters = () => (
  <section id="why" className="relative py-10 md:py-16">
    <div className="mx-auto max-w-7xl px-6 grid md:grid-cols-2 gap-10 items-start">
      <div>
        <h3 className="text-2xl md:text-3xl font-semibold text-white">{content.sections.matters.title}</h3>
        <p className="mt-4 text-white/70 leading-relaxed">{content.sections.matters.copy}</p>
      </div>
      <div>
        <Card className="bg-white/5 border-white/10 backdrop-blur-2xl">
          <CardContent className="pt-6 text-white/80 text-sm leading-relaxed">
            <div className="flex items-center gap-2 text-white/70">
              <ShieldCheck className="h-4 w-4 text-teal-300" />
              Reproducible
            </div>
            <Separator className="my-3 bg-white/10" />
            <div className="flex items-center gap-2 text-white/70">
              <GitBranch className="h-4 w-4 text-cyan-300" />
              Composable
            </div>
            <Separator className="my-3 bg-white/10" />
            <div className="flex items-center gap-2 text-white/70">
              <Zap className="h-4 w-4 text-cyan-200" />
              Testable
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  </section>
);

const Audience = () => (
  <section id="who" className="py-10 md:py-16">
    <div className="mx-auto max-w-7xl px-6">
      <h3 className="text-2xl md:text-3xl font-semibold text-white">{content.sections.audience.title}</h3>
      <div className="mt-4 flex flex-wrap gap-2">
        {content.sections.audience.chips.map((c) => (
          <Badge key={c} className="bg-white/5 text-white border border-white/10">
            {c}
          </Badge>
        ))}
      </div>
      <ul className="mt-5 grid gap-2 text-white/70 list-disc pl-5 max-w-2xl">
        {content.sections.audience.bullets.map((b) => (
          <li key={b}>{b}</li>
        ))}
      </ul>
    </div>
  </section>
);

const WhyNow = () => (
  <section className="py-10 md:py-16">
    <div className="mx-auto max-w-7xl px-6 grid md:grid-cols-2 gap-10 items-center">
      <div>
        <h3 className="text-2xl md:text-3xl font-semibold text-white">{content.sections.whyNow.title}</h3>
        <p className="mt-4 text-white/70 leading-relaxed max-w-2xl">{content.sections.whyNow.copy}</p>
      </div>
      <div className="relative">
        <div className="rounded-xl bg-white/5 border border-white/10 backdrop-blur-2xl p-6">
          <div className="flex items-start gap-3 text-white/80">
            <Brain className="h-5 w-5 text-cyan-300 mt-0.5" />
            <p className="text-sm leading-relaxed">
              Encode judgment once, run it everywhere. Treat expertise as software — versioned, tested, and deployed.
            </p>
          </div>
          <Separator className="my-4 bg-white/10" />
          <div className="flex items-start gap-3 text-white/80">
            <Network className="h-5 w-5 text-teal-300 mt-0.5" />
            <p className="text-sm leading-relaxed">
              Integrate across surfaces: ops dashboards, internal tools, products, and more.
            </p>
          </div>
        </div>
      </div>
    </div>
  </section>
);

const useWaitlist = () => {
  const existing = useMemo(() => getWaitlistEntries(), []);
  const [submissions, setSubmissions] = useState(existing);

  const submit = (payload) => {
    const saved = saveWaitlistEntry(payload);
    setSubmissions([saved, ...submissions]);
    return saved;
  };

  return { submissions, submit };
};

const Waitlist = () => {
  const { submit } = useWaitlist();
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("");
  const [usecase, setUsecase] = useState("");
  const [saving, setSaving] = useState(false);

  const onSubmit = (e) => {
    e.preventDefault();
    if (!email) {
      toast.error("Please enter your email");
      return;
    }
    setSaving(true);
    const payload = { email, role, usecase };
    setTimeout(() => {
      submit(payload);
      setSaving(false);
      toast.success("You're on the list ✨");
      setEmail("");
      setRole("");
      setUsecase("");
    }, 600);
  };

  return (
    <section id="cta" className="py-12 md:py-16">
      <div className="mx-auto max-w-7xl px-6 grid md:grid-cols-2 gap-10 items-center">
        <div>
          <h3 className="text-2xl md:text-3xl font-semibold text-white">{content.sections.finalCta.title}</h3>
          <p className="mt-4 text-white/70 leading-relaxed max-w-2xl">{content.sections.finalCta.copy}</p>

          <div className="mt-6">
            <Accordion type="single" collapsible className="w-full">
              {content.sections.extrasAccordion.map((item, idx) => (
                <AccordionItem key={idx} value={`item-${idx}`}>
                  <AccordionTrigger className="text-white/90">{item.q}</AccordionTrigger>
                  <AccordionContent className="text-white/70">{item.a}</AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </div>
        <div>
          <form onSubmit={onSubmit} className="rounded-xl border border-white/10 bg-white/5 backdrop-blur-2xl p-5">
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
                    className="pl-9 bg-black/40 border-white/10 text-white placeholder:text-white/40 focus-visible:ring-cyan-400"
                  />
                </div>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="role" className="text-white/80">Role</Label>
                <Select value={role} onValueChange={setRole}>
                  <SelectTrigger id="role" className="bg-black/40 border-white/10 text-white">
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
                  className="min-h-[96px] bg-black/40 border-white/10 text-white placeholder:text-white/40 focus-visible:ring-cyan-400"
                />
              </div>
              <Button
                type="submit"
                disabled={saving}
                className="h-11 bg-cyan-500 hover:bg-cyan-400 text-white shadow-[0_8px_30px_rgba(34,211,238,0.25)]">
                {saving ? "Joining…" : content.sections.finalCta.cta}
                {!saving && <ArrowRight className="h-4 w-4 ml-1" />}
              </Button>
              <p className="text-xs text-white/50">This is a frontend-only mock. Entries are stored locally on your browser.</p>
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
      <div className="flex items-center gap-4">
        <a href="#building" className="hover:text-white">Product</a>
        <a href="#why" className="hover:text-white">Why</a>
        <a href="#who" className="hover:text-white">Who</a>
        <a href="#cta" className="hover:text-white">Join</a>
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
    <div className="dark theme-ice min-h-screen bg-[#0b0d0e] text-white">
      {/* page bg subtle noise and grid */}
      <div className="fixed inset-0 -z-20 bg-[radial-gradient(1200px_500px_at_80%_-10%,rgba(34,211,238,0.08),transparent)]" />
      <Nav />
      <main className="relative">
        <Hero />
        <Building />
        <WhyMatters />
        <Audience />
        <WhyNow />
        <Waitlist />
      </main>
      <Footer />
      <Toaster position="top-center" richColors closeButton />
    </div>
  );
}