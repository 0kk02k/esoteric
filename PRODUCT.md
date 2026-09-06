# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

- **Primär:** Deutschsprachige (DACH), die anonyme, personalisierte und ästhetisch hochwertige Selbstreflexion suchen; mobile-first; bereit, für hochwertige Personalisierung zu zahlen (Quelle: `recherche.md`).
- **Nicht-Zielgruppe (MVP):** Nutzer, die medizinische, rechtliche oder finanzielle Entscheidungen delegieren wollen.
- **Aktuelle Phase:** Geschlossene Beta per Einladung (Link/Zugangscode). Fokus der aktuellen Phase ist Feinschliff und Härtung der bestehenden Flows für echte Beta-Nutzer.

## Product Purpose

ESO ist eine KI-gestützte Web-Plattform („Kybernetisches Grimoire"), die westliche Astrologie (exakte Berechnung via Swiss Ephemeris), Tarot (78 geseedete Karten) und generative KI (OpenRouter) zu einer personalisierten, symbolisch-reflektierenden Deutung verbindet. Ablauf: Frage/Thema → Geburtsdaten (optional, überspringbar) → 3-Karten-Ziehung → KI-Deutung → begrenzte Follow-ups → Feedback → Speichern/Archiv.

Erfolg bedeutet: Nutzer verstehen in Sekunden, was ESO macht; der erste Reading-Flow funktioniert auf Mobile ohne Erklärung; die Wirkung ist mystisch, aber glaubwürdig; KI-Inhalte sind eindeutig erkennbar.

## Positioning

Mobile-first Entertainment-Produkt mit Premium-Personalisierung. ESO kombiniert drei Ebenen — exakte astronomische Chart-Berechnung, tief integriertes Tarot-System und KI-Synthese — die Wettbewerber (Co-Star, Nebula, Chani, Sanctuary, Labyrinthos) meist getrennt anbieten. Deutungen sind als symbolische Reflexion gerahmt, nie als Schicksalsaussage oder Beratung.

## Operating Context

- **Laufzeit:** Next.js-App in `web/` (`npm run dev`, Port 3000); Python/FastAPI-Dienst in `astro/`; Prisma + PostgreSQL, next-auth v5, Sentry.
- **Zugang:** Geschlossene Beta per Einladung.
- **Monetarisierung (Stand: simuliert):** Free (3 Readings/Tag, 1 Follow-up), Plus 12 €/Monat (20 Readings/Tag, 5 Follow-ups, Archiv — aktuell über `/api/simulate-plus` simuliert, kein echter Payment-Provider), Premium 49 € einmalig (Report inkl. druckbarem PDF-Grimoire — CTA noch ohne Zielseite).
- **Datenschutz:** Anonyme Nutzung ohne Account möglich; Account erst nach dem ersten Wertmoment; Consent-Notice im Flow.

## Capabilities and Constraints

- Implementierte Funktionen: Reading-Flow, Tarot-Ziehung, Chart-Berechnung, KI-Deutung mit Follow-up-Dialog, Feedback-Erfassung, Archiv, Auth, Nutzungslimits, Safety-System mit Krisenerkennung (medizinisch/rechtlich/finanziell/akute Krise → Hilfe-Panel statt Reading).
- UI-Sprache Deutsch (`lang="de"`); Preise in Euro; keine i18n-Vorbereitung erforderlich (DACH-Fokus).
- KI-Transparenz ist Produktanforderung: jede KI-Deutung wird als solche gelabelt, mit Hinweis „symbolische Reflexion, keine professionelle Beratung".
- Environment: `OPENROUTER_API_KEY` und `DATABASE_URL` erforderlich, damit der KI-Flow läuft.

## Brand Commitments

- Name **ESO**, Selbstbezeichnung **„Kybernetisches Grimoire"**, Designrichtung **„The Digital Grimoire"**.
- Die verbindliche Design- und Tonalitätsrichtung ist in `design.md` dokumentiert (Farbpalette, Typografie, Komponenten, Motion, Safety-Design, Do/Don't, Stimme mit guten/schlechten Formulierungen).
- **Kartenwahl als Resonanzfeld ist bewusst gewählt** (Entscheidung 2026-09-06): das StellarField bleibt das Ritual der Ziehung und wird zugänglich gemacht — es wird nicht durch design.mds Screen-Konzept „drei verdeckte Karten" ersetzt.
- Favicon mit Tarot-Kartenrücken existiert bereits.

## Evidence on Hand

- `design.md` (vollständiges, implementiertes Designkonzept inkl. CrystalShard-Symbol und Crystalline-UI-Komponenten), `recherche.md` (Markt-/Wettbewerbsanalyse), `umsetzung.md` (Stufenplan, Stufen 0–9 abgeschlossen).
- Laufender Code: `web/src/components` (u. a. `CrystalShard`, `TarotCard`, `ReadingPanel`, `StepIndicator`), `web/src/lib` (safety, astrology, ai, usage-limits), 78 Tarotkarten im Seed.
- **Nicht vorhanden (nicht erfinden):** echte Testimonials, Kundenstimmen, Presse, Conversion-Kennzahlen; echte Payment-Integration; Nutzungsdaten aus der Beta.

## Product Principles

1. **Erst Wert, dann Verpflichtung** — anonym nutzen, Account und Upgrade erst nach dem ersten gelebten Reading anbieten.
2. **Exakte Berechnung, klar gerahmte Deutung** — astronomische Präzision als Fundament, KI-Anteil jederzeit sichtbar und als symbolische Reflexion gerahmt.
3. **Mystisch, aber glaubwürdig** — Ritualgefühl und Premium-Anmutung ohne Schicksalsversprechen, Therapie-Imitation oder Esoterik-Kitsch.
4. **Niedrigschwelliger Zugang** — Einladungs-Beta, anonyme Nutzung, überspringbare Geburtsdaten.
5. **Mobile-first Qualität als Premium-Signal** — der kleine Screen ist der Maßstab, nicht die Ausnahme.

## Accessibility & Inclusion

Mindeststandard laut `design.md`: ausreichende Kontraste, sichtbare Focus-States, `prefers-reduced-motion` respektieren, alle Formulare mit Labels, Karten nicht nur über Farbe unterscheidbar, Touch-Ziele ≥ 44 px, KI- und Safety-Hinweise screenreader-tauglich ausgezeichnet, keine Information nur über Animation vermittelt.
