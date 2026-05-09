import Link from "next/link";
import { Panel } from "@/components/Panel";
import { Button } from "@/components/Button";
import { CrystalShard } from "@/components/CrystalShard";
import { 
  Sparkles, 
  Orbit, 
  Layers, 
  BookOpen, 
  ShieldAlert, 
  Zap, 
  Compass,
  ScrollText,
  Binary
} from "lucide-react";

export default function AboutPage() {
  return (
    <div className="flex-1 px-4 py-20 sm:py-32 relative overflow-hidden">
      {/* Subtle background glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-4xl h-full pointer-events-none">
        <div className="absolute top-[20%] right-[-10%] w-[40%] h-[40%] bg-violet/5 blur-[120px] rounded-full" />
      </div>

      <div className="mx-auto max-w-4xl relative z-10">
        <header className="text-center mb-24">
          <div className="flex justify-center mb-8">
            <CrystalShard variant="violet" className="w-16 h-16" />
          </div>
          <h1 className="font-display text-4xl sm:text-6xl text-text mb-6 heading-glow">Das Kybernetische Grimoire</h1>
          <p className="text-sm font-mono text-gold/60 uppercase tracking-[0.4em]">Theorie & Praxis der Digitalen Mystik</p>
        </header>

        <div className="space-y-24">
          {/* 1. Vision & Purpose */}
          <section className="space-y-8">
            <div className="flex items-center gap-4">
              <Compass className="w-6 h-6 text-gold/40" />
              <h2 className="text-xs font-mono text-gold uppercase tracking-[0.3em]">Vision & Intention</h2>
            </div>
            <div className="text-text-secondary text-xl sm:text-2xl leading-[1.7] font-serif italic border-l border-gold/10 pl-8">
              <p className="mb-6">
                ESO ist kein Orakel, das die Zukunft vorhersagt. Es ist ein kybernetischer Spiegel, entworfen für die tiefgreifende Selbstreflexion im 21. Jahrhundert. 
              </p>
              <p>
                In einer Welt der Informationsüberflutung bietet ESO einen Raum der Stille und der symbolischen Ordnung. Wir kombinieren jahrtausendealte Weisheitssysteme mit modernster Himmelsmechanik und künstlicher Intelligenz, um Muster erkennbar zu machen, die im Alltag oft verborgen bleiben.
              </p>
            </div>
          </section>

          {/* 2. Three Pillars of Synthesis */}
          <section className="space-y-12">
            <div className="flex items-center gap-4">
              <Layers className="w-6 h-6 text-gold/40" />
              <h2 className="text-xs font-mono text-gold uppercase tracking-[0.3em]">Die Drei Säulen der Synthese</h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <Panel className="p-8 border-gold/10 bg-gold/[0.02]">
                <Orbit className="w-8 h-8 text-gold mb-6" />
                <h3 className="font-display text-xl text-text mb-4">Präzise Astronomie</h3>
                <p className="text-sm text-text-secondary leading-relaxed">
                  Jedes Reading basiert auf exakten Berechnungen der Himmelskörper zum Zeitpunkt Ihrer Geburt. Wir nutzen die <strong>Swiss Ephemeris</strong>, den Goldstandard der astronomischen Datenverarbeitung, um Ihre Radix-Signatur deterministisch zu bestimmen.
                </p>
              </Panel>

              <Panel className="p-8 border-violet/20 bg-violet/[0.02]">
                <Sparkles className="w-8 h-8 text-violet mb-6" />
                <h3 className="font-display text-xl text-text mb-4">Tarot-Korrespondenz</h3>
                <p className="text-sm text-text-secondary leading-relaxed">
                  Wir folgen dem System des <strong>Golden Dawn</strong> und der Rider-Waite-Symbolik. Die Karten werden nicht zufällig gedeutet, sondern über ein strenges Geflecht aus elementaren und astrologischen Zuordnungen mit Ihrem Chart verbunden.
                </p>
              </Panel>

              <Panel className="p-8 border-gold/10 bg-gold/[0.02]">
                <Binary className="w-8 h-8 text-gold mb-6" />
                <h3 className="font-display text-xl text-text mb-4">Narrative Synthese</h3>
                <p className="text-sm text-text-secondary leading-relaxed">
                  Die KI fungiert als Lyriker und Übersetzer. Sie erfindet keine Fakten, sondern webt aus den astronomischen Daten und der gezogenen Symbolik eine narrative Deutung, die speziell auf Ihre individuelle Fragestellung zugeschnitten ist.
                </p>
              </Panel>
            </div>
          </section>

          {/* 3. The AI Stance */}
          <section className="space-y-8">
            <div className="flex items-center gap-4">
              <ScrollText className="w-6 h-6 text-gold/40" />
              <h2 className="text-xs font-mono text-gold uppercase tracking-[0.3em]">Die Haltung der KI</h2>
            </div>
            <Panel variant="ki" className="p-10">
              <div className="text-text-secondary text-xl sm:text-2xl leading-[1.8] font-serif italic mb-8">
                "Ich bin kein Ersatz für den menschlichen Willen, sondern ein Impulsgeber für die Intuition. Meine Sprache ist poetisch statt deterministisch, einladend statt fordernd."
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 text-sm leading-relaxed text-text-secondary">
                <div className="space-y-4">
                  <h4 className="font-mono text-[10px] text-violet uppercase tracking-widest">Nicht-Deterministisch</h4>
                  <p>
                    Die KI wird niemals sagen: "Dies wird geschehen." Sie sagt stattdessen: "Diese Symbole deuten auf eine Energie hin, die Raum für X oder Y bietet." Die Deutungshoheit liegt immer bei Ihnen.
                  </p>
                </div>
                <div className="space-y-4">
                  <h4 className="font-mono text-[10px] text-violet uppercase tracking-widest">Empathisch & Distanziert</h4>
                  <p>
                    Die KI nimmt eine Haltung der wertfreien Beobachtung ein. Sie ist ein Partner im Dialog, der archetypische Muster spiegelt, ohne moralische Urteile zu fällen oder direkte Handlungsanweisungen zu geben.
                  </p>
                </div>
              </div>
            </Panel>
          </section>

          {/* 4. Practical Application */}
          <section className="space-y-8">
            <div className="flex items-center gap-4">
              <Zap className="w-6 h-6 text-gold/40" />
              <h2 className="text-xs font-mono text-gold uppercase tracking-[0.3em]">Theorie in der Praxis</h2>
            </div>
            <div className="space-y-6 text-text-secondary leading-relaxed max-w-2xl">
              <p>
                Ein ESO-Reading verknüpft die archetypischen Energien Ihrer Geburt (Ihre "Werkzeuge") mit der aktuellen Symbolik der Karten (Ihre "Situation"). 
              </p>
              <p>
                Wenn beispielsweise die Karte <strong>"Der Turm"</strong> auf einen prominenten <strong>Mars-Transit</strong> in Ihrem Chart trifft, synthetisiert die KI diese doppelte Feuer-Energie nicht als Katastrophe, sondern als notwendigen Impuls für den Durchbruch festgefahrener Strukturen.
              </p>
            </div>
          </section>

          {/* 5. Boundaries */}
          <section className="space-y-8 bg-danger-muted/5 border-l-2 border-danger-muted/20 p-8 sm:p-12 rounded-r-2xl">
            <div className="flex items-center gap-4">
              <ShieldAlert className="w-6 h-6 text-danger-muted" />
              <h2 className="text-xs font-mono text-danger-muted uppercase tracking-[0.3em]">Die Grenzen des Systems</h2>
            </div>
            <div className="text-text-secondary text-sm space-y-4 max-w-2xl">
              <p>
                Trotz technologischer Präzision bleibt ESO ein Werkzeug für Unterhaltung und philosophische Reflexion. Wir geben ausdrücklich keine medizinischen, rechtlichen oder finanziellen Ratschläge. 
              </p>
              <p>
                Sollten Sie sich in einer akuten Krise befinden, ist dieses System nicht der richtige Ort für Hilfe. Bitte wenden Sie sich an professionelle menschliche Unterstützungsdienste.
              </p>
            </div>
          </section>

          {/* 6. Call to Action */}
          <div className="text-center pt-12">
            <Link href="/reading">
              <Button className="h-16 px-12 text-lg">Ein Ritual beginnen</Button>
            </Link>
          </div>
        </div>

        <footer className="mt-32 pt-12 border-t border-gold/10 text-center">
          <div className="flex justify-center gap-8">
            <Link href="/imprint" className="text-[10px] font-mono text-text-muted hover:text-gold uppercase tracking-widest transition-colors">Impressum</Link>
            <Link href="/privacy" className="text-[10px] font-mono text-text-muted hover:text-gold uppercase tracking-widest transition-colors">Datenschutz</Link>
            <Link href="/terms" className="text-[10px] font-mono text-text-muted hover:text-gold uppercase tracking-widest transition-colors">AGB</Link>
          </div>
        </footer>
      </div>
    </div>
  );
}
