"use client";

/**
 * Statische Himmelsmechanik: Der Hintergrund ruht. Keine Dauerschleifen,
 * keine Partikel — Bewegung gehört den Ritual-Momenten (Kartenwahl, Synthese),
 * nicht der Bühne. design.md: „Wenige starke visuelle Momente statt dauernder
 * Effekte."
 */
export const CelestialBackground = () => {
  return (
    <div className="fixed inset-0 z-[-1] overflow-hidden pointer-events-none bg-celestial">
      {/* Central Sun/Engine Hub — stillgestellte Mechanik */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] opacity-15">
        <div className="absolute inset-0 rounded-full border border-gold/10 flex items-center justify-center">
          {/* Outer Ring with markers */}
          <div className="absolute inset-0 border-[0.5px] border-gold/20 rounded-full after:content-[''] after:absolute after:top-0 after:left-1/2 after:-translate-x-1/2 after:w-1 after:h-4 after:bg-gold/40" />

          {/* Zodiac/Symbol Ring */}
          <div className="w-[70%] h-[70%] rounded-full border border-gold/10 relative">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-gold/50 glow-gold" />
          </div>
        </div>

        {/* Inner Mechanics */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[40%] h-[40%] border-[0.5px] border-gold/20 rounded-full">
          <div className="absolute top-1/2 left-0 w-full h-[0.5px] bg-gold/10" />
          <div className="absolute top-0 left-1/2 w-[0.5px] h-full bg-gold/10" />
        </div>
      </div>
    </div>
  );
};
