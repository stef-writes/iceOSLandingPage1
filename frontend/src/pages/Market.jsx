import React, { useEffect } from "react";
import { Button } from "../components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Toaster } from "../components/ui/sonner";
import { Link, useLocation } from "react-router-dom";
import Nav from "../components/Nav";
import { Brain, Users, Briefcase, LineChart, ArrowRight } from "lucide-react";


export default function Market() {
  useEffect(() => {
    document.documentElement.style.scrollBehavior = "smooth";
    return () => { document.documentElement.style.scrollBehavior = "auto"; };
  }, []);

  return (
    <div className="dark theme-ice min-h-screen bg-[#0b0d0e] text-white">
      <div className="fixed inset-0 -z-20 bg-[radial-gradient(1200px_500px_at_80%_-10%,rgba(34,211,238,0.08),transparent)]" />
      <Nav />
      <main className="pt-28 md:pt-32 pb-12 motion-safe:animate-fade-in-up" />
      <Toaster position="top-center" richColors closeButton />
    </div>
  );
}


