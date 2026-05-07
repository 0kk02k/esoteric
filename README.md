# ESO — Cyber-Mystik-Plattform

KI-gestuetzte Web-Plattform, die westliche Astrologie, Tarot und generative KI zu einem personalisierten, symbolisch-reflektierenden Beratungserlebnis verbindet.

## Tech Stack

| Technologie | Version |
|-------------|---------|
| Next.js | 16.2.5 |
| React | 19.2 |
| TypeScript | 6.0.3 |
| Node.js | 24 LTS |
| Python | 3.14.4 |
| Prisma | 7.x |
| SQLite | Dev |
| Tailwind CSS | v4 |
| Swiss Ephemeris | swisseph-wasm |

## Architektur

```
web/                          # Next.js Frontend + API
├── src/app/                  # App Router (Pages + API Routes)
├── src/components/           # UI-Komponenten
├── src/lib/                  # Astrologie, KI, DB, Validierung
├── prisma/
│   ├── schema.prisma         # Datenbankschema (10 Modelle)
│   ├── seed.ts               # 78 Tarotkarten + Golden-Dawn
│   └── migrations/
├── astro/                    # Python Astrologie-Service (vorbereitet)
├── agent.md                  # Agent-Konfiguration
├── design.md                 # Designsystem (The Digital Grimoire)
├── recherche.md              # Projektrecherche
└── umsetzung.md              # Stufenweiser Umsetzungsplan
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
| Stufe 3: Astrologie-Service | Offen |
| Stufe 4: KI + Prompt + Safety | Offen |
| Stufe 5: Frontend-MVP | Offen |
| Stufe 6-12 | Geplant |

## Lizenz

Privat — Alle Rechte vorbehalten.
