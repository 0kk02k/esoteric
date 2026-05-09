# ESO — Cyber-Mystik-Plattform

KI-gestuetzte Web-Plattform, die westliche Astrologie, Tarot und generative KI zu einem personalisierten, symbolisch-reflektierenden Beratungserlebnis verbindet.

## Tech Stack

| Technologie | Version |
|-------------|---------|
| Next.js | 16.2.5 |
| React | 19.2 |
| TypeScript | 6.0.3 |
| Node.js | 24 LTS |
| Prisma | 7.x |
| Tailwind CSS | v4 |
| Swiss Ephemeris | swisseph-wasm |
| Observability | Sentry + Custom Logger |

## Architektur

```
web/                          # Next.js Frontend + API
├── src/app/                  # App Router (About, Pricing, Legal, Simulation)
├── src/components/           # UI (ConsentNotice, Tarot, CrystalShards)
├── src/lib/                  # Core (Logger, Usage-Limits, Safety, AI)
├── prisma/                   # Datenbankschema & Seed
...
```

## Design

Richtung: **The Digital Grimoire** — dunkel, editorial, mystisch. Goldene Tarot-Akzente, violette KI-Panels, mobile-first. Details in `design.md`.

## Setup

```bash
# Frontend
cd web
npm install
npx prisma migrate dev
npx tsx prisma/seed.ts        # 78 Tarotkarten seeden
npm run dev                    # http://localhost:3000

# Umgebungsvariablen (web/.env.local)
OPENROUTER_API_KEY=your-key-here
DATABASE_URL=file:./dev.db
```

## Status

| Phase | Status |
|-------|--------|
| Stufe 0: Projektgrundlage | Abgeschlossen |
| Stufe 1: Technischer PoC | Abgeschlossen |
| Stufe 2: Datenmodell + Backend | Abgeschlossen |
| Stufe 3: Astrologie-Service | Abgeschlossen |
| Stufe 4: KI + Prompt + Safety | Abgeschlossen |
| Stufe 5: Frontend-MVP | Abgeschlossen |
| Stufe 6: Auth + Nutzungslimits | Abgeschlossen |
| Stufe 7: Monetarisierung | Abgeschlossen |
| Stufe 8: Recht & Compliance | Abgeschlossen |
| Stufe 9: Observability & QA | Abgeschlossen |
| Stufe 10: Geschlossene Beta | Offen |

## Lizenz

Privat — Alle Rechte vorbehalten.
