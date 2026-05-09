import Link from "next/link";
import { Panel } from "@/components/Panel";
import { Button } from "@/components/Button";
import { ArrowLeft, ShieldCheck, Scale, FileText } from "lucide-react";

export default function ImpressumPage() {
  return (
    <div className="flex-1 px-4 py-20 sm:py-32">
      <div className="mx-auto max-w-3xl flex flex-col gap-12">
        <header className="space-y-4">
          <Link href="/" className="inline-flex items-center gap-2 text-xs font-mono text-gold/60 hover:text-gold uppercase tracking-widest transition-colors mb-4">
            <ArrowLeft className="w-4 h-4" /> Home
          </Link>
          <h1 className="font-display text-4xl sm:text-6xl text-text heading-glow">Impressum</h1>
        </header>

        <Panel className="p-8 sm:p-12 space-y-12">
          <section className="space-y-4">
            <h2 className="text-xs font-mono text-gold uppercase tracking-[0.3em]">Angaben gemäß § 5 TMG</h2>
            <div className="text-text-secondary leading-relaxed font-serif italic text-xl">
              <p>[Dein Vorname] [Dein Nachname]</p>
              <p>[Deine Straße] [Hausnummer]</p>
              <p>[PLZ] [Stadt]</p>
            </div>
          </section>

          <section className="space-y-4">
            <h2 className="text-xs font-mono text-gold uppercase tracking-[0.3em]">Kontakt</h2>
            <div className="text-text-secondary leading-relaxed font-serif italic text-xl">
              <p>Telefon: [Deine Telefonnummer]</p>
              <p>E-Mail: [Deine E-Mail-Adresse]</p>
            </div>
          </section>

          <section className="space-y-4">
            <h2 className="text-xs font-mono text-gold uppercase tracking-[0.3em]">Redaktionell verantwortlich</h2>
            <div className="text-text-secondary leading-relaxed font-serif italic text-xl">
              <p>[Dein Name]</p>
              <p>[Deine Anschrift]</p>
            </div>
          </section>

          <section className="space-y-4">
            <h2 className="text-xs font-mono text-gold uppercase tracking-[0.3em]">EU-Streitschlichtung</h2>
            <p className="text-text-secondary leading-relaxed text-sm">
              Die Europäische Kommission stellt eine Plattform zur Online-Streitbeilegung (OS) bereit: 
              <a href="https://ec.europa.eu/consumers/odr/" target="_blank" rel="noopener noreferrer" className="text-gold hover:underline ml-1">https://ec.europa.eu/consumers/odr/</a>.
              Unsere E-Mail-Adresse finden Sie oben im Impressum.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-xs font-mono text-gold uppercase tracking-[0.3em]">Verbraucherstreitbeilegung/Universalschlichtungsstelle</h2>
            <p className="text-text-secondary leading-relaxed text-sm">
              Wir sind nicht bereit oder verpflichtet, an Streitbeilegungsverfahren vor einer Verbraucherschlichtungsstelle teilzunehmen.
            </p>
          </section>
        </Panel>

        <footer className="flex flex-wrap gap-8 justify-center pt-8 border-t border-gold/10">
          <Link href="/privacy" className="text-[10px] font-mono text-text-muted hover:text-gold uppercase tracking-widest transition-colors">Datenschutz</Link>
          <Link href="/terms" className="text-[10px] font-mono text-text-muted hover:text-gold uppercase tracking-widest transition-colors">AGB</Link>
        </footer>
      </div>
    </div>
  );
}
