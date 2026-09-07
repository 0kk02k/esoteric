---
target: Reading-Flow /reading
total_score: 20
max_score: 40
na_heuristics: 
p0_count: 2
p1_count: 2
timestamp: 2026-09-07T04-34-11Z
slug: web-src-app-reading-page-tsx
---
# Critique: Reading-Flow `/reading`

Method: dual-agent (A: Design-Review-Subagent · B: Evidenz-Subagent, isoliert und parallel)

**Ziel:** `web/src/app/reading/page.tsx` + 15 Flow-Komponenten, Live-Inspektion Mobile 390×844 + Desktop 1280×800 · **Surface-Modus:** Operate (Ritual-Flow) · **Kontext:** Geschlossene Beta, Feinschliff

## Design Health Score

| # | Heuristik | Score | Schlüsselproblem |
|---|-----------|-------|------------------|
| 1 | Sichtbarkeit des Systemstatus | 2 | Nach KI-Fehler bleibt „ENTHÜLLUNG" aktiv (`page.tsx:190-196`); Mobile schneidet Schritt 6 ab |
| 2 | Passung zu realen Weltmodellen | 1 | „Materialisierung"/„Himmelsmechanik"/„Radix"-Maschinenregister (`page.tsx:856,688,1149`) gegen design.md:567-574; Sie/du-Bruch (`ConsentNotice.tsx:44-49`) |
| 3 | Kontrolle und Freiheit | 3 | Zonen abwählbar, Follow-up kehrt zurück — gut. Aber „Link kopieren" tot (`readings/[id]/page.tsx:161`) |
| 4 | Konsistenz | 2 | Rohes `animate-spin` statt `CrystalSpinner` (`readings/[id]/page.tsx:56`); `ReadingPanel` ausgekoppelt; zwei KI-Panel-Umsetzungen |
| 5 | Fehlervermeidung | 2 | Mindestlänge + Zähler gut; Primärbutton wechselt ohne Guard zwischen Skip/Submit (`page.tsx:785`) |
| 6 | Wiedererkennen statt Erinnern | 2 | Zonen-Hints mobil versteckt (`StellarField.tsx:320`); Kartenname nur im Rasterbild (`TarotCard.tsx:185-198`) |
| 7 | Flexibilität und Effizienz | 2 | Enthüllung = 3 Einzelklicks ohne „alle aufdecken"; Geburtsdaten sauber überspringbar |
| 8 | Ästhetik und Minimalismus | 3 | Hero/Kartenkunst stark; Dreifach-Anweisung im Feld; Deko-Metadaten („KI-Grimoire v1.0", „ANTHROPIC") |
| 9 | Fehler erkennen und beheben | 1 | `api-client.ts:63-65` + `page.tsx:538`: generischer KI-Fehler ohne einen einzigen Button |
| 10 | Hilfe und Dokumentation | 2 | Exzellent: Geburtszeit-Unsicherheit erklärt (`page.tsx:755-757`); kein Hilfe-Einstieg, „umgekehrt" nie erklärt |
| **Total** | | **20/40** | **Acceptable (20–27)** |

## Design Specificity Verdict

**LLM:** Visuelle Welt unbestreitbar für ESO geschrieben (Tarot-Artwork-Pflege `TarotCard.tsx:42-62`, Konstellations-Signet `Constellation.tsx:23-38`, disziplinierte Palette). Interaktion aber in zwei Schlüsselmomenten generisch: StepIndicator rendert als Quadrat (`rotate-45` `StepIndicator.tsx:66` hebt `clipPath` `:74` auf — design.md:791 behauptet Diamanten); Resonanzfeld wird mobil zu drei leeren dunklen Balken (Zonen-Hints `hidden sm:block`, `StellarField.tsx:320`). Sprachwelt driftet ins Technokratische. Starkes Artefakt, unvollständig durchgehaltene Interaktions- und Sprachwelt.

**Deterministischer Scan:** CLI 0 Findings (exit 0, 21 Dateien) = Coverage-Artefakt, doppelt belegt: TSX nur schmaler Regex-Schnitt (Sanity-Zwilling: HTML → 4 Regeln, TSX → 1); design-system-Regeln inaktiv — `findDesignRoot` stoppt an `web/package.json` (Root-`design.json` für `web/**` unerreichbar) + `design.md` ohne YAML-Frontmatter (beide sandbox-positivkontrolliert). Browser-Pass: **8–29 Findings pro Ziel** (`/` 29 · Frage 21 · Resonanzfeld 18 · Archiv 9 · Detail 24), dominiert von `undersized-ui-text` (bis 13×), `dark-glow`, `radial-spotlight-glow`, `all-caps-body`, `gradient-text`, `skipped-heading`. Detector fing zusätzlich: `oversized-h1` (72 px/30 vh), `line-length` (~101 Z.), `clipped-overflow-container`, `pulsing-dot`, `bounce-easing`.

**False Positives (nicht fixen):** `text-occlusion` auf Detector-eigenen „✦"-Labels (experimentell belegt) · `overused-font` Geist/Geist Mono (Sidecar-Kanon, wird nicht gewaivt) · `ai-color-palette` auf Violett (dokumentierte KI-Semantikfarbe) · `dark-glow` auf Gold-Tokens (`gold-ritual`/`violet-synthesis` im Sidecar, das nicht geladen wird) · `nested-cards` am KI-Panel-Header (dokumentierte Struktur).

## Overall Impression

ESOs schwächste Screens sind seine kritischsten: der Eintritt (Consent-Overlay blockiert die erste Eingabe) und der KI-Fehler (ein Satz ohne Button). Größte Chance: Resonanzfeld mobil zum Ritual machen und den wahrscheinlichsten Endpunkt eines neuen Nutzers vom am wenigsten zum bestgestalteten Screen machen.

## Strengths

1. **Kontrast-Engineering diszipliniert:** gemessen auf `#050508` — `text-muted` 6,12:1, `violet-soft` 6,77:1, `gold` 8,65:1, alle AA; bewusste Entscheidung dokumentiert (`SymbolChip.tsx:20`). Browser-Kontrastpass: 0 Fails (Vorbehalt: 3–5 Kandidaten/Seite als bild-backiert unaufgelöst).
2. **Peak-End korrekt:** „In deinem Grimoire vermerkt." + deterministisches Signet aus Karten-IDs (`page.tsx:1120-1144`, `readings/[id]/page.tsx:88`) — emotionaler Abschluss + Retention.
3. **Ehrliches Warten + verlustfreies State-Handling:** reale Dauerangabe (`page.tsx:993-998`), Session-Restore (`page.tsx:157-174`), fehlgeschlagene Follow-ups ins Feld zurück (`page.tsx:431-437`).

## Priority Issues

**[P0] Consent-Notice blockiert Primär-CTA und Fragefeld auf Mobile** — `ConsentNotice.tsx:33` (`fixed bottom-6 z-[100]`) überfährt Textarea, Chips, „Weiter"; Playwright: 14× „subtree intercepts pointer events". Verletzt design.md:521 und „Erst Wert, dann Verpflichtung". Fix: Consent auf Landing beschränken (oder nach erstem Reading), Inline statt Overlay, `sessionStorage`-Spiegel. → `onboard`

**[P0] KI-Fehler ohne Handlungsmöglichkeit** — `api-client.ts:63-65` ein Satz, `page.tsx:538` koppelt Buttons an `errorKind` → generischer Fehler ohne Button; „Synthese starten" (`page.tsx:947`) unter dem Fold. Fix: Retry vom `errorKind` entkoppeln, Provider-/Quota-/Timeout unterscheidbar, Fokus auf Retry. → `harden`

**[P1] Resonanzfeld liefert das Ritual mobil nicht** — Zonen-Hints desktop-only (`StellarField.tsx:320`), verworfenes `#09080D` (`:193`), Dreifach-Anweisung (`StellarField.tsx:176-185` + `page.tsx:822-824`), Detector: `clipped-overflow-container` + 6× `undersized-ui-text` auf diesem Schritt. Fix: Hints mobil sichtbar, Lichter heben, Palette, eine Anweisung. → `shape`

**[P1] Kartenidentität nur im Rasterbild; umgekehrte Karten kopfüber** — Vorderseite nur `<img>` (`TarotCard.tsx:185-198`); `rotateZ:180` (`:141`) dreht den eingebetteten Titel mit („DAS RAD DES SCHICKSALS" live unlesbar). Fix: Name als Text unter der Karte, Rotation nur auf Illustration. → `clarify`

**[P2] StepIndicator ist ein Quadrat; präjudiziert Skip** — `rotate-45` + `clipPath` = achsenparalleles Quadrat (4×-Zoom verifiziert); `page.tsx:467` streicht „Geburtsdaten" vor der Entscheidung durch. Fix: `rotate-45` entfernen; `skipped` erst nach Entscheidung. → `polish`

## Persona Red Flags

- **Jordan:** Consent-Overlay blockt ersten Klick · „Himmelsmechanik" als Headline · kein Kartenname nach Flip · Flow endet in Satz ohne Button.
- **Casey:** „Weiter" gemessen bei y=1007 in 844-px-Viewport (163 px unter dem Fold), kein Sticky-CTA (design.md:201) · Topic-Chips 34 px, Kategorie-Chips 42 px, Feedback-Chips 36 px — alle unter 44 px · Daumen-Zone = Consent-Overlay · Stärke: Session-Restore.
- **Sam:** Krisen-`<h2>` ohne `ref={stepHeadingRef}` (`page.tsx:1018`) → Fokus fällt auf `body`, Krise wird nicht angesagt (gravierendster Einzelfund) · Kartenname nur im `alt` · Spinner ohne `role="status"` · kein Skip-Link. Positiv: globaler `:focus-visible`-Ring, Inset-Schatten-Focus an `clip-path`-Buttons (`Button.tsx:36-41`).
- **Miriam (produktspezifisch):** Sie/du-Bruch (`ConsentNotice.tsx:44-49`) · Datenschutzhinweis unter 8 Zeilen kosmischer Prosa · toter „Link kopieren"-Button · KI-Transparenz vorbildlich (`page.tsx:1067-1070`).

## Minor Observations

- Reduced-Motion-Lücke: `animation-duration` gesetzt, `animation-iteration-count: 1` fehlt (`globals.css:315-320` vs. `infinite`-Loops `CrystalSpinner.tsx:31,47,63,79`, `page.tsx:994`).
- Kursive Display-Serif (`ConsentNotice.tsx:42`, `FeedbackForm.tsx:76`) gegen design.md:186.
- `StellarField.tsx:193` hardcodet verworfenes `#09080D`.
- „Umgekehrt" `uppercase`, Element-Chip nicht (`TarotCard.tsx:213,218`).
- Step-Labels 9 px (`StepIndicator.tsx:91`) unter design.md:188-Floor (10 px).
- „ANTHROPIC" hardcodet (Provider ist Nebius, `readings/[id]/page.tsx:153`); Datenschutzversprechen vs. optionaler `sessionToken` (`:160` vs `:38`).
- `ReadingPanel.tsx` im Hauptflow tot (design.md:659 nennt es Priorität 1).
- `UserAuth` per `absolute` überlappt Inhalte (`layout.tsx:44`); next-auth `MissingSecret` → stiller 401.
- **Meta:** Detector-Bridge reparieren — `design.md` mit Frontmatter + Sidecar nach `web/.impeccable/design.json` (oder Design-Root nach `web/`), sonst messen `polish`/`audit` nur den Regex-Schnitt statt Tokens.

## Questions to Consider

1. Warum sieht Miriam mobil drei leere dunkle Balken statt eines Himmels, in dem sie etwas wählt? Minimaler Schritt, damit die 78 Lichter als Feld erlebbar werden?
2. Spricht ESO mit dem Nutzer oder über sich selbst („Materialisierung", „Himmelsmechanik", „Radix-Signatur")? Welche drei Begriffe streichen wir, wenn „direkt, respektvoll" das einzige Kriterium wäre?
3. Wenn die KI-Stufe der Kern ist: warum ist ihr Fehlerfall der am wenigsten gestaltete Screen?

## Run Notes

Dual-agent, isoliert und parallel; B nutzte A's Dev-Server (Next 16.2.5 verweigert zweiten Dev-Server im selben Verzeichnis). CLI-Detector: 0 Findings/21 Dateien (Coverage-Artefakt, sandbox-positivkontrolliert). Browser: playwright-core 1.61.1 + `executablePath` auf Chromium 1234 (151.0.7922.34); Overlay-Injektion 5/5, frische Kontexte. Dev-Server 3100 bestätigt gestoppt; live-server nicht benötigt. AI-Stufe ohne Key: „Ergebnis ohne Deutung" pixelbelegt, „mit Deutung" aus Code bewertet. 22 Screenshots in `/tmp/eso-critique-a/`. Repo unverändert.
