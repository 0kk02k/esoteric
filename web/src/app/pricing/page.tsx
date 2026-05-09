"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Panel } from "@/components/Panel";
import { Button } from "@/components/Button";
import { CrystalShard } from "@/components/CrystalShard";
import { Sparkles, Check, ArrowRight, Zap, Star, Shield } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

const PLANS = [
  {
    name: "Free",
    price: "0€",
    description: "Der Einstieg in das Kybernetische Grimoire.",
    features: [
      "3 Readings pro Tag",
      "Basis-Chart-Berechnung",
      "1 Follow-up pro Reading",
      "Anonyme Nutzung",
    ],
    cta: "Kostenlos starten",
    href: "/reading",
    variant: "ghost",
  },
  {
    name: "Plus",
    price: "12€",
    period: "/ Monat",
    description: "Für tiefere Einsichten und regelmäßige Reflexion.",
    features: [
      "20 Readings pro Tag",
      "Detaillierte Aspekt-Analyse",
      "5 Follow-ups pro Reading",
      "Vollständiges Archiv",
      "Priorisierter KI-Zugriff",
    ],
    cta: "Plus freischalten",
    href: "/api/simulate-plus", // For now, we use a simulation route
    variant: "primary",
    highlight: true,
  },
  {
    name: "Premium",
    price: "49€",
    period: " Einmalig",
    description: "Ein umfassender, handgefertigter digitaler Report.",
    features: [
      "Alles aus Plus für 1 Monat",
      "Vollständige Radix-Analyse",
      "Transite für 12 Monate",
      "Individuelle Tarot-Synthese",
      "Druckbares PDF-Grimoire",
    ],
    cta: "Report anfragen",
    href: "#",
    variant: "secondary",
  },
];

export default function PricingPage() {
  const [simulating, setSimulating] = useState(false);

  const handleSimulatePlus = async () => {
    setSimulating(true);
    try {
      const res = await fetch("/api/simulate-plus", { method: "POST" });
      if (res.ok) {
        window.location.href = "/reading";
      } else {
        const data = await res.json();
        alert(data.error || "Simulation failed. Please log in first.");
      }
    } catch (err) {
      console.error(err);
      alert("Simulation failed.");
    } finally {
      setSimulating(false);
    }
  };

  return (
    <div className="flex-1 px-4 py-20 sm:py-32 relative overflow-hidden">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-4xl h-full pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-violet-deep/10 blur-[120px] rounded-full" />
        <div className="absolute bottom-[10%] right-[-5%] w-[30%] h-[30%] bg-gold/5 blur-[100px] rounded-full" />
      </div>

      <div className="mx-auto max-w-6xl relative z-10">
        <div className="text-center mb-20">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex justify-center mb-8"
          >
            <CrystalShard variant="gold" className="w-24 h-24" />
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl sm:text-6xl font-display font-semibold text-text mb-6 heading-glow"
          >
            Erweitere deinen Horizont
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-xl text-text-secondary max-w-2xl mx-auto leading-relaxed"
          >
            Wähle den Pfad, der deine Reise am besten unterstützt. 
            Von gelegentlichen Impulsen bis zur tiefen symbolischen Arbeit.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch">
          {PLANS.map((plan, i) => (
            <motion.div
              key={plan.name}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 * (i + 1) }}
              className="flex"
            >
              <Panel 
                className={cn(
                  "flex-1 flex flex-col p-8 sm:p-10 relative group transition-all duration-500",
                  plan.highlight ? "border-gold/40 bg-gold/5 shadow-[0_0_40px_rgba(200,164,93,0.08)]" : "hover:border-gold/20"
                )}
              >
                {plan.highlight && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-gold text-bg text-[10px] font-mono font-bold uppercase tracking-[0.2em] px-4 py-1.5 rounded-full shadow-[0_0_20px_rgba(200,164,93,0.4)]">
                    Empfohlen
                  </div>
                )}

                <div className="mb-8">
                  <h3 className="text-sm font-mono text-gold/60 uppercase tracking-[0.3em] mb-4">{plan.name}</h3>
                  <div className="flex items-baseline gap-1">
                    <span className="text-4xl sm:text-5xl font-display text-text">{plan.price}</span>
                    {plan.period && <span className="text-sm text-text-muted font-mono uppercase tracking-widest">{plan.period}</span>}
                  </div>
                </div>

                <p className="text-sm text-text-secondary leading-relaxed mb-8 min-h-[3rem]">
                  {plan.description}
                </p>

                <ul className="space-y-4 mb-10 flex-1">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-start gap-3 text-sm text-text-secondary group-hover:text-text transition-colors">
                      <div className="w-5 h-5 rounded-full border border-gold/20 flex items-center justify-center shrink-0 mt-0.5">
                        <Check className="w-3 h-3 text-gold" />
                      </div>
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>

                {plan.name === "Plus" ? (
                  <Button 
                    onClick={handleSimulatePlus}
                    disabled={simulating}
                    className="w-full h-14 group"
                  >
                    {simulating ? "Verarbeitung..." : plan.cta}
                    <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                  </Button>
                ) : (
                  <Link href={plan.href} className="w-full">
                    <Button 
                      variant={plan.variant as any} 
                      className="w-full h-14 group"
                    >
                      {plan.cta}
                      <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                    </Button>
                  </Link>
                )}
              </Panel>
            </motion.div>
          ))}
        </div>

        <div className="mt-24 text-center">
          <div className="inline-flex flex-wrap justify-center gap-12 p-8 glass-panel rounded-3xl border-gold/10">
            <div className="flex items-center gap-3">
              <Shield className="w-5 h-5 text-gold/40" />
              <span className="text-[10px] font-mono text-text-muted uppercase tracking-widest">Sichere Zahlung</span>
            </div>
            <div className="flex items-center gap-3">
              <Zap className="w-5 h-5 text-gold/40" />
              <span className="text-[10px] font-mono text-text-muted uppercase tracking-widest">Sofortzugriff</span>
            </div>
            <div className="flex items-center gap-3">
              <Star className="w-5 h-5 text-gold/40" />
              <span className="text-[10px] font-mono text-text-muted uppercase tracking-widest">Kein Abo-Zwang</span>
            </div>
          </div>
          <p className="mt-12 text-xs text-text-muted max-w-xl mx-auto leading-loose italic">
            Zahlungen werden über Stripe abgewickelt. Simulation Mode: Der Button "Plus freischalten" simuliert eine erfolgreiche Zahlung für Testzwecke (erfordert Login).
          </p>
        </div>
      </div>
    </div>
  );
}
