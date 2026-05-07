import Link from "next/link";

export default function Home() {
  return (
    <div className="flex flex-col flex-1 items-center justify-center min-h-screen px-4">
      <main className="flex flex-col items-center gap-12 max-w-lg text-center py-24">
        <div className="w-24 h-24 rounded-full border-2 border-gold/40 flex items-center justify-center">
          <span className="text-gold text-4xl font-display">&#9734;</span>
        </div>

        <div className="space-y-4">
          <h1 className="text-4xl sm:text-5xl font-display font-semibold tracking-tight text-text leading-tight">
            Dein Spiegel aus Sternen, Karten und KI.
          </h1>
          <p className="text-lg text-text-secondary leading-relaxed">
            Ziehe drei Tarot-Karten und erhalte eine symbolische Deutung auf
            Basis deines Geburtshoroskops, deiner Frage und aktueller Transite.
          </p>
        </div>

        <div className="flex flex-col gap-3 w-full max-w-xs">
          <Link
            href="/reading/test"
            className="flex h-12 items-center justify-center rounded-[var(--radius-card)] bg-gold text-[#09080D] font-semibold text-base transition-all hover:bg-gold-soft hover:shadow-[0_0_20px_rgba(200,164,93,0.3)]"
          >
            Reading starten
          </Link>
          <span className="text-sm text-text-muted leading-relaxed">
            KI-generierte symbolische Reflexion. Keine professionelle Beratung.
          </span>
        </div>
      </main>
    </div>
  );
}
