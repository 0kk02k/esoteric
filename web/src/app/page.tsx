import Link from "next/link";

export default function Home() {
  return (
    <div className="flex flex-col flex-1 min-h-screen">
      {/* Hero */}
      <section className="flex flex-col items-center justify-center flex-1 px-4 py-16 sm:py-24 text-center">
        <div className="w-20 h-20 rounded-full border-2 border-gold/40 flex items-center justify-center mb-8">
          <span className="text-gold text-3xl font-display">&#9734;</span>
        </div>

        <h1 className="text-3xl sm:text-5xl font-display font-semibold tracking-tight text-text leading-tight max-w-lg mb-4">
          Dein Spiegel aus Sternen, Karten und KI.
        </h1>
        <p className="text-base sm:text-lg text-text-secondary leading-relaxed max-w-md mb-8">
          Ziehe drei Tarot-Karten und erhalte eine symbolische Deutung auf
          Basis deines Geburtshoroskops, deiner Frage und aktueller Transite.
        </p>

        <div className="flex flex-col gap-3 w-full max-w-xs">
          <Link
            href="/reading"
            className="flex h-12 items-center justify-center rounded-[var(--radius-card)] bg-gold text-[#09080D] font-semibold text-base transition-all hover:bg-gold-soft hover:shadow-[0_0_20px_rgba(200,164,93,0.3)]"
          >
            Reading starten
          </Link>
          <span className="text-sm text-text-muted leading-relaxed">
            Kostenlos. Kein Account nötig.
          </span>
        </div>
      </section>

      {/* How it works */}
      <section className="border-t border-border px-4 py-16">
        <div className="mx-auto max-w-2xl">
          <h2 className="font-display text-xl text-text text-center mb-10">
            So funktioniert&apos;s
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
            {[
              {
                step: "01",
                title: "Frage stellen",
                desc: "Beschreibe dein Thema oder stelle eine offene Frage.",
              },
              {
                step: "02",
                title: "Karten ziehen",
                desc: "Drei Tarot-Karten werden für dich gezogen und aufgedeckt.",
              },
              {
                step: "03",
                title: "Deutung erhalten",
                desc: "Die KI verknüpft Karten, Frage und optional dein Horoskop.",
              },
            ].map((item) => (
              <div key={item.step} className="flex flex-col gap-3 text-center">
                <span className="text-xs font-mono text-gold">{item.step}</span>
                <h3 className="font-display text-base text-text">{item.title}</h3>
                <p className="text-sm text-text-muted leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Limits & AI notice */}
      <section className="border-t border-border px-4 py-12">
        <div className="mx-auto max-w-lg text-center">
          <p className="text-sm text-text-muted leading-relaxed">
            ESO ist ein symbolisches Reflexionsinstrument. Es ersetzt keine medizinische,
            therapeutische, rechtliche oder finanzielle Beratung. Die KI-generierten
            Texte sind keine Vorhersagen, sondern Einladungen zur Selbsterkenntnis.
          </p>
          <p className="text-xs text-text-muted mt-4">
            3 kostenlose Readings pro Tag. Powered by KI.
          </p>
        </div>
      </section>
    </div>
  );
}
