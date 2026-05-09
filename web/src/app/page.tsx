"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Button } from "@/components/Button";
import { Panel } from "@/components/Panel";
import { CrystalShard } from "@/components/CrystalShard";
import { Sparkles, Star, Moon, ArrowRight, Zap, ChevronDown } from "lucide-react";

const FEATURES = [
  {
    title: "Kybernetische Astrologie",
    description: "Präzise Berechnung deiner Himmelskörper mittels Swiss Ephemeris. Wir weben deine Radix-Signatur in jede Deutung ein.",
    icon: Star,
  },
  {
    title: "Symbolisches Tarot",
    description: "Keine generischen Texte. Jede Karte wird im Kontext deines Geburtscharts und deiner spezifischen Frage analysiert.",
    icon: Moon,
  },
  {
    title: "Narrative Synthese",
    description: "Unsere KI fungiert als symbolischer Übersetzer, der poetische Tiefe mit analytischer Klarheit verbindet.",
    icon: Sparkles,
  }
];

export default function LandingPage() {
  return (
    <div className="flex-1 flex flex-col">
      {/* Hero Section */}
      <section className="relative pt-20 pb-24 sm:pb-32 overflow-hidden px-4 min-h-[92vh] flex flex-col justify-center">
        <div className="mx-auto max-w-6xl relative z-10 w-full">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-8 items-center">
            {/* Text Column */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
              className="order-2 lg:order-1 text-center lg:text-left"
            >
              <div className="mb-6 inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-gold/15 bg-gold/5">
                <span className="w-1.5 h-1.5 rounded-full bg-gold animate-pulse" />
                <span className="text-[10px] font-mono text-gold/80 uppercase tracking-[0.25em]">Digitales Grimoire</span>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-display font-semibold tracking-tight text-text leading-[1.08] max-w-3xl mb-6">
                Dein Spiegel aus Sternen, Symbolen und <span className="text-gold italic font-medium heading-glow">KI</span>
              </h1>
              <p className="text-lg sm:text-xl text-text-secondary max-w-xl mx-auto lg:mx-0 mb-10 leading-relaxed">
                ESO ist ein digitales Grimoire für die moderne Zeit. Wir verbinden exakte Astronomie mit archetypischem Tarot zu einer einzigartigen Reflexions-Experience.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
                <Link href="/reading">
                  <Button className="h-14 px-10 text-lg group">
                    Ein Ritual beginnen
                    <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </Link>
                <Link href="/about">
                  <Button variant="ghost" className="h-14 px-8 text-gold hover:bg-gold/5">
                    Philosophie entdecken
                  </Button>
                </Link>
              </div>
            </motion.div>

            {/* Crystal Column */}
            <motion.div
              initial={{ opacity: 0, scale: 0.85 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1.4, ease: "easeOut" }}
              className="order-1 lg:order-2 flex justify-center lg:justify-end relative"
            >
              <div className="relative w-56 h-56 sm:w-72 sm:h-72 lg:w-96 lg:h-96">
                <CrystalShard variant="gold" synthesizing={true} className="w-full h-full" />
                {/* Ambient Aura — vertical ellipse */}
                <div 
                  className="absolute inset-0 -z-10 animate-pulse"
                  style={{
                    background: "radial-gradient(ellipse 45% 65% at 50% 50%, rgba(200,164,93,0.12), transparent 70%)",
                    filter: "blur(60px)",
                  }}
                />
              </div>
            </motion.div>
          </div>
        </div>

        {/* Floating background elements */}
        <div className="absolute top-1/2 left-0 -translate-y-1/2 w-full h-full pointer-events-none -z-10">
          <CrystalShard variant="gold" className="absolute top-[10%] left-[5%] w-32 h-32 opacity-15 blur-sm" />
          <CrystalShard variant="violet" className="absolute bottom-[20%] right-[10%] w-48 h-48 opacity-10 blur-md" />
        </div>

        {/* Scroll Indicator */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5, duration: 1 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-3"
        >
          <span className="text-[9px] font-mono text-text-muted uppercase tracking-[0.3em]">Scrollen</span>
          <div className="scroll-indicator">
            <ChevronDown className="w-5 h-5 text-gold/50" />
          </div>
        </motion.div>
      </section>

      {/* Transition gradient */}
      <div className="h-24 bg-gradient-to-b from-transparent to-surface/30 pointer-events-none" />

      {/* Features */}
      <section className="py-24 px-4 bg-surface/30 border-y border-gold/5">
        <div className="mx-auto max-w-6xl">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 lg:gap-16">
            {FEATURES.map((feature, i) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.2 }}
              >
                {/* Diamond icon frame */}
                <div className="mb-6 w-12 h-12 flex items-center justify-center">
                  <div 
                    className="w-full h-full bg-gold/10 border border-gold/20 flex items-center justify-center"
                    style={{ clipPath: "polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)" }}
                  >
                    <feature.icon className="w-5 h-5 text-gold" style={{ transform: "rotate(0deg)" }} />
                  </div>
                </div>
                <h3 className="text-xl font-display text-text mb-4">{feature.title}</h3>
                <p className="text-text-secondary leading-relaxed text-sm">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-32 px-4 relative overflow-hidden">
        <div className="mx-auto max-w-4xl">
          <Panel className="p-8 sm:p-16 text-center border-gold/20 bg-gold/[0.02]">
            <Zap className="w-12 h-12 text-gold mx-auto mb-8 opacity-50" />
            <h2 className="text-3xl sm:text-5xl font-display text-text mb-6">Bereit für eine neue Perspektive?</h2>
            <p className="text-text-secondary mb-10 text-lg max-w-xl mx-auto">
              Tritt ein in den kybernetischen Raum. Keine Registrierung für das erste Reading erforderlich.
            </p>
            <Link href="/reading">
              <Button className="h-16 px-12 text-xl">
                Jetzt starten
              </Button>
            </Link>
          </Panel>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-16 px-4 border-t border-gold/10">
        <div className="mx-auto max-w-6xl">
          <div className="flex flex-col items-center gap-10">
            <div className="flex items-center gap-2">
              <CrystalShard className="w-6 h-6" />
              <span className="text-lg font-display text-text italic">ESO</span>
            </div>
            
            {/* Elegant disclaimer */}
            <Panel variant="ki" className="max-w-2xl mx-auto py-6 px-8 text-center">
              <p className="text-[10px] font-mono text-violet/60 uppercase tracking-[0.2em] mb-3">
                Disclaimer
              </p>
              <p className="text-xs font-mono text-text-muted leading-relaxed">
                ESO ist ein Werkzeug zur Selbsterkenntnis und Reflexion. Wir geben keine rechtlichen, 
                medizinischen oder finanziellen Ratschläge. Deine Daten bleiben privat und verschlüsselt.
              </p>
            </Panel>

            <div className="flex flex-wrap justify-center gap-8 text-xs font-mono uppercase tracking-widest text-gold/60">
              <Link href="/about" className="hover:text-gold transition-colors underline decoration-gold/20 underline-offset-4">Philosophie</Link>
              <Link href="/imprint" className="hover:text-gold transition-colors underline decoration-gold/20 underline-offset-4">Impressum</Link>
              <Link href="/privacy" className="hover:text-gold transition-colors underline decoration-gold/20 underline-offset-4">Datenschutz</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
