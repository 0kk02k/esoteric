import Link from "next/link";
import { Panel } from "@/components/Panel";
import { ArrowLeft } from "lucide-react";

export default function TermsPage() {
  return (
    <div className="flex-1 px-4 py-20 sm:py-32">
      <div className="mx-auto max-w-4xl flex flex-col gap-12">
        <header className="space-y-4">
          <Link href="/" className="inline-flex items-center gap-2 text-xs font-mono text-gold/60 hover:text-gold uppercase tracking-widest transition-colors mb-4">
            <ArrowLeft className="w-4 h-4" /> Home
          </Link>
          <h1 className="font-display text-4xl sm:text-6xl text-text heading-glow">AGB</h1>
          <p className="text-sm font-mono text-gold/60 uppercase tracking-widest">Nutzungsbedingungen</p>
        </header>

        <Panel className="p-8 sm:p-12 space-y-12">
          <section className="space-y-6">
            <h2 className="text-xs font-mono text-gold uppercase tracking-[0.3em]">1. Gegenstand der Nutzung</h2>
            <div className="space-y-4 text-text-secondary leading-relaxed text-sm">
              <p>
                ESO stellt eine KI-gestützte Plattform zur symbolischen Reflexion bereit. Die erzeugten Inhalte basieren auf astronomischen Berechnungen und Tarot-Symbolik.
              </p>
            </div>
          </section>

          <section className="space-y-6">
            <h2 className="text-xs font-mono text-gold uppercase tracking-[0.3em]">2. Haftungsausschluss und Disclaimer</h2>
            <div className="space-y-4 text-text-secondary leading-relaxed text-sm bg-danger-muted/5 border-l-2 border-danger-muted/40 p-6">
              <p className="font-bold text-text">WICHTIGER HINWEIS:</p>
              <p>
                ESO bietet keine medizinische, rechtliche, psychologische oder finanzielle Beratung. Die Deutungen sind als rein symbolische Reflexionsimpulse und zur Unterhaltung zu verstehen.
              </p>
              <p>
                In akuten Lebenskrisen wenden Sie sich bitte an professionelle Hilfestellen (z.B. Telefonseelsorge).
              </p>
            </div>
          </section>

          <section className="space-y-6">
            <h2 className="text-xs font-mono text-gold uppercase tracking-[0.3em]">3. Abonnements (Plus)</h2>
            <div className="space-y-4 text-text-secondary leading-relaxed text-sm">
              <p>
                Mit dem Abschluss eines Plus-Abonnements erhält der Nutzer erweiterte Nutzungslimits. Die Kündigung ist jederzeit zum Ende der Laufzeit möglich.
              </p>
            </div>
          </section>

          <section className="space-y-6">
            <h2 className="text-xs font-mono text-gold uppercase tracking-[0.3em]">4. Nutzungsrecht</h2>
            <div className="space-y-4 text-text-secondary leading-relaxed text-sm">
              <p>
                Die generierten Texte sind für die persönliche Nutzung bestimmt. Eine gewerbliche Weiterverwertung der generierten Readings ist untersagt.
              </p>
            </div>
          </section>
        </Panel>

        <footer className="flex justify-center pt-8 border-t border-gold/10">
          <Link href="/privacy" className="text-[10px] font-mono text-text-muted hover:text-gold uppercase tracking-widest transition-colors">Datenschutz</Link>
        </footer>
      </div>
    </div>
  );
}
