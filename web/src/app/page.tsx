"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Button } from "@/components/Button";
import { Panel } from "@/components/Panel";
import { Sparkles, Compass, Cpu, ArrowRight } from "lucide-react";

export default function Home() {
  return (
    <div className="flex flex-col flex-1">
      {/* Hero Section */}
      <section className="relative flex flex-col items-center justify-center flex-1 px-4 pt-20 pb-16 sm:pt-32 sm:pb-24 text-center overflow-hidden">
        {/* Kinetic Hero Element */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.8, rotate: -10 }}
          animate={{ opacity: 1, scale: 1, rotate: 0 }}
          transition={{ duration: 1.5, ease: "easeOut" }}
          className="relative w-32 h-32 sm:w-48 sm:h-48 mb-12"
        >
          <div className="absolute inset-0 border-2 border-gold/20 rounded-full animate-[spin_20s_linear_infinite]" />
          <div className="absolute inset-4 border border-gold/40 rounded-full animate-[spin_15s_linear_infinite_reverse]" />
          <div className="absolute inset-0 flex items-center justify-center">
            <Sparkles className="w-10 h-10 sm:w-16 sm:h-16 text-gold drop-shadow-[0_0_15px_rgba(200,164,93,0.5)]" />
          </div>
          
          {/* Orbital Dots */}
          {[...Array(3)].map((_, i) => (
            <motion.div
              key={i}
              animate={{ rotate: 360 }}
              transition={{ duration: 10 + i * 5, repeat: Infinity, ease: "linear" }}
              className="absolute inset-0"
            >
              <div 
                className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-gold shadow-[0_0_10px_rgba(200,164,93,0.8)]" 
                style={{ top: i * 15 + '%' }}
              />
            </motion.div>
          ))}
        </motion.div>

        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="text-4xl sm:text-7xl font-display font-semibold tracking-tight text-text leading-[1.1] max-w-3xl mb-6"
        >
          <span className="text-gold italic font-medium">KI-Grimoire</span>
        </motion.h1>

        <motion.p 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="text-lg sm:text-xl text-text-secondary leading-relaxed max-w-xl mb-12"
        >
          Ein Cyber-Mystik-Erlebnis, das Astrologie und Tarot mit KI verschmilzt.
        </motion.p>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1 }}
          className="flex flex-col items-center gap-4"
        >
          <Link href="/reading">
            <Button className="h-14 px-10 text-lg group">
              Reading starten
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Button>
          </Link>
          <p className="text-sm font-mono text-gold/60 uppercase tracking-widest">
            Kostenlos & unbegrenzt
          </p>
        </motion.div>
      </section>

      {/* Features Grid */}
      <section className="px-4 py-24 bg-surface/30 border-y border-gold/10 backdrop-blur-sm">
        <div className="mx-auto max-w-6xl">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: <Compass className="w-6 h-6" />,
                title: "Präzise Berechnung",
                desc: "Wir nutzen die Swiss Ephemeris für astronomisch exakte Planetenstände zum Zeitpunkt deiner Geburt.",
              },
              {
                icon: <Sparkles className="w-6 h-6" />,
                title: "Tarot-Resonanz",
                desc: "Gezogene Karten werden nach dem Golden-Dawn-System mit deinem persönlichen Chart korreliert.",
              },
              {
                icon: <Cpu className="w-6 h-6" />,
                title: "KI-Synthese",
                desc: "Keine fertigen Bausteine. KI generiert eine einzigartige, poetische Deutung deiner aktuellen Situation.",
              },
            ].map((feature, i) => (
              <Panel key={i} className="group hover:border-gold/30 transition-colors">
                <div className="w-12 h-12 rounded-full border border-gold/20 flex items-center justify-center mb-6 text-gold group-hover:scale-110 transition-transform">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-display text-text mb-4">{feature.title}</h3>
                <p className="text-text-secondary leading-relaxed">
                  {feature.desc}
                </p>
              </Panel>
            ))}
          </div>
        </div>
      </section>

      {/* Footer / Disclaimer */}
      <footer className="px-4 py-16 text-center border-t border-gold/5 bg-bg/80">
        <div className="mx-auto max-w-2xl">
          <div className="flex justify-center gap-6 mb-8 text-gold/40">
            <div className="w-[1px] h-12 bg-gradient-to-b from-transparent via-gold/20 to-transparent" />
            <Sparkles className="w-5 h-5" />
            <div className="w-[1px] h-12 bg-gradient-to-b from-transparent via-gold/20 to-transparent" />
          </div>
          <p className="text-sm text-text-muted leading-relaxed mb-8">
            ESO ist ein Werkzeug zur Selbsterkenntnis und Reflexion. Wir geben keine rechtlichen, 
            medizinischen oder finanziellen Ratschläge. Deine Daten bleiben privat und verschlüsselt.
          </p>
          <div className="flex flex-wrap justify-center gap-8 text-xs font-mono uppercase tracking-widest text-gold/60">
            <Link href="/readings" className="hover:text-gold transition-colors underline decoration-gold/20 underline-offset-4">Readings</Link>
            <Link href="#" className="hover:text-gold transition-colors underline decoration-gold/20 underline-offset-4">Datenschutz</Link>
            <Link href="#" className="hover:text-gold transition-colors underline decoration-gold/20 underline-offset-4">Impressum</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
