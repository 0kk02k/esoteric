import Link from "next/link";
import { Panel } from "@/components/Panel";
import { ArrowLeft } from "lucide-react";

export default function PrivacyPage() {
  return (
    <div className="flex-1 px-4 py-20 sm:py-32">
      <div className="mx-auto max-w-4xl flex flex-col gap-12">
        <header className="space-y-4">
          <Link href="/" className="inline-flex items-center gap-2 text-xs font-mono text-gold/60 hover:text-gold uppercase tracking-widest transition-colors mb-4">
            <ArrowLeft className="w-4 h-4" /> Home
          </Link>
          <h1 className="font-display text-4xl sm:text-6xl text-text heading-glow">Datenschutz</h1>
          <p className="text-sm font-mono text-gold/60 uppercase tracking-widest">Version 1.0 — Stand: Mai 2026</p>
        </header>

        <Panel className="p-8 sm:p-12 space-y-12">
          <section className="space-y-6">
            <h2 className="text-xs font-mono text-gold uppercase tracking-[0.3em]">1. Datenschutz auf einen Blick</h2>
            <div className="space-y-4 text-text-secondary leading-relaxed text-sm">
              <p>
                Die folgenden Hinweise geben einen einfachen Überblick darüber, was mit Ihren personenbezogenen Daten passiert, wenn Sie diese Website besuchen. Personenbezogene Daten sind alle Daten, mit denen Sie persönlich identifiziert werden können.
              </p>
              <h3 className="text-gold font-display text-lg italic mt-6">Datenerfassung auf dieser Website</h3>
              <p>
                Die Datenverarbeitung auf dieser Website erfolgt durch den Websitebetreiber. Dessen Kontaktdaten können Sie dem Impressum dieser Website entnehmen.
              </p>
            </div>
          </section>

          <section className="space-y-6">
            <h2 className="text-xs font-mono text-gold uppercase tracking-[0.3em]">2. Besondere Hinweise zu ESO (KI & Astrologie)</h2>
            <div className="space-y-4 text-text-secondary leading-relaxed text-sm border-l border-gold/20 pl-6">
              <h3 className="text-gold font-display text-lg italic">Verarbeitung von Geburtsdaten</h3>
              <p>
                ESO verarbeitet Geburtsdaten (Datum, Zeit, Ort), um astronomische Berechnungen durchzuführen. Diese Daten werden zur Erstellung Ihres Readings an unsere Backend-Systeme übermittelt.
              </p>
              <h3 className="text-gold font-display text-lg italic">Künstliche Intelligenz (KI)</h3>
              <p>
                Ihre Fragen und die berechneten Symbole werden an KI-Schnittstellen (OpenRouter/Anthropic/Google) übermittelt, um die narrative Deutung zu erzeugen. Wir achten darauf, dass keine unnötigen personenbezogenen Daten übertragen werden. Die KI nutzt diese Daten nicht zum Training ihrer Modelle.
              </p>
            </div>
          </section>

          <section className="space-y-6">
            <h2 className="text-xs font-mono text-gold uppercase tracking-[0.3em]">3. Datenspeicherung und Löschung</h2>
            <div className="space-y-4 text-text-secondary leading-relaxed text-sm">
              <p>
                Readings werden unter einer anonymen Session-ID oder Ihrem Benutzerkonto gespeichert. Sie haben jederzeit das Recht, Ihre Readings oder Ihr gesamtes Profil über die Benutzeroberfläche zu löschen.
              </p>
            </div>
          </section>

          <section className="space-y-6">
            <h2 className="text-xs font-mono text-gold uppercase tracking-[0.3em]">4. Ihre Rechte</h2>
            <div className="space-y-4 text-text-secondary leading-relaxed text-sm">
              <p>
                Sie haben jederzeit das Recht auf unentgeltliche Auskunft über Herkunft, Empfänger und Zweck Ihrer gespeicherten personenbezogenen Daten. Sie haben außerdem ein Recht auf Berichtigung oder Löschung dieser Daten.
              </p>
            </div>
          </section>
        </Panel>

        <footer className="flex justify-center pt-8 border-t border-gold/10">
          <Link href="/imprint" className="text-[10px] font-mono text-text-muted hover:text-gold uppercase tracking-widest transition-colors">Impressum</Link>
        </footer>
      </div>
    </div>
  );
}
