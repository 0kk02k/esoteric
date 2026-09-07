"use client";

import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Panel } from "./Panel";
import { Button } from "./Button";
import { Shield } from "lucide-react";
import Link from "next/link";

/**
 * Consent gehört auf die Landing — nie in den Reading-Flow. Dort würde ein
 * Overlay die erste Eingabe blockieren und die Zustimmung vor das erste
 * Wertmoment zwingen (design.md:521, „Erst Wert, dann Verpflichtung").
 */
export function ConsentNotice() {
  const pathname = usePathname();
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (pathname !== "/") return;
    const consent = localStorage.getItem("eso_consent");
    if (!consent) {
      const timer = setTimeout(() => setIsVisible(true), 1500);
      return () => clearTimeout(timer);
    }
  }, [pathname]);

  const handleAccept = () => {
    localStorage.setItem("eso_consent", "accepted");
    setIsVisible(false);
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 50 }}
          className="fixed z-[100] flex justify-center pointer-events-none max-sm:bottom-3 max-sm:left-3 max-sm:right-3 sm:bottom-6 sm:left-6 sm:right-6"
        >
          <Panel className="max-w-xl w-full p-4 sm:p-8 border-gold/30 bg-surface/90 backdrop-blur-xl shadow-[0_20px_50px_rgba(0,0,0,0.5)] pointer-events-auto">
            {/* Mobil: schmaler Streifen — Hero und CTA bleiben sichtbar */}
            <div className="sm:hidden flex items-center gap-3">
              <Shield className="w-5 h-5 text-gold shrink-0" aria-hidden="true" />
              <p className="text-xs text-text-secondary leading-snug flex-1">
                Notwendige Cookies, anonyme Nutzung.{" "}
                <Link href="/privacy" className="text-gold underline underline-offset-2">Details</Link>
              </p>
              <Button onClick={handleAccept} className="h-11 px-4 text-xs shrink-0">
                Einverstanden
              </Button>
            </div>

            {/* Desktop: das volle Panel */}
            <div className="hidden sm:flex flex-col gap-6">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl rotate-45 border border-gold/20 flex items-center justify-center shrink-0 mt-1">
                  <Shield className="w-5 h-5 text-gold -rotate-45" />
                </div>
                <div className="space-y-2">
                  <h3 className="font-display text-xl text-text">Konsens &amp; Privatsphäre</h3>
                  <p className="text-sm text-text-secondary leading-relaxed">
                    ESO nutzt technisch notwendige Cookies und verarbeitet Geburtsdaten zur Erstellung deiner Readings.
                    Mit der Nutzung der Plattform stimmst du unserer{" "}
                    <Link href="/privacy" className="text-gold hover:underline">Datenschutzerklärung</Link>{" "}
                    und unseren{" "}
                    <Link href="/terms" className="text-gold hover:underline">Nutzungsbedingungen</Link>{" "}
                    zu.
                  </p>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <Button onClick={handleAccept} className="flex-1 h-11 text-xs uppercase tracking-widest font-mono">
                  Einverstanden
                </Button>
                <Link href="/privacy" className="flex-1">
                  <Button variant="ghost" className="w-full h-11 text-xs uppercase tracking-widest font-mono">
                    Details
                  </Button>
                </Link>
              </div>
            </div>
          </Panel>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
