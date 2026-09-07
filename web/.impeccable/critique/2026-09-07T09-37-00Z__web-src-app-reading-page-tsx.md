---
target: Reading-Flow /reading
total_score: 23
max_score: 40
na_heuristics: 
p0_count: 2
p1_count: 2
timestamp: 2026-09-07T09-37-00Z
slug: web-src-app-reading-page-tsx
---
# Critique: Reading-Flow `/reading` (Re-Run nach Fix-Durchgang)

Method: dual-agent (A: Design-Review-Subagent · B: Evidenz-Subagent, isoliert und parallel)

**Ziel:** `web/src/app/reading/page.tsx` + Flow-Komponenten, Live-Inspektion Mobile 390×844 + Desktop 1280×800/1440×900 · **Surface-Modus:** Operate (Ritual-Flow) · **Kontext:** Geschlossene Beta, Feinschliff · **Commit-Basis:** `0f6b31f`

## Design Health Score

| # | Heuristik | Score | Schlüsselproblem |
|---|-----------|-------|------------------|
| 1 | Sichtbarkeit des Systemstatus | 3 | Karten-Reveal aktualisiert die Anweisung nicht — bei 2/3 enthüllt steht weiter „Berühre die Karten" (`reading/page.tsx:917-923`) |
| 2 | Passung zu realen Weltmodellen | 2 | Rohwert „PENDING" im deutschen UI (`readings/[id]/page.tsx:168`); „Zurück zur Startseite" resetet ins Formular (`reading/page.tsx:1101-1107`) |
| 3 | Kontrolle und Freiheit | 2 | Archiv-Löschen irreversibel ohne Bestätigung (`readings/page.tsx:163-170`); einziger Detail-Pfad führt ins 404 (`readings/page.tsx:196`) |
| 4 | Konsistenz | 2 | Zwei KI-Panel-Implementierungen: `ReadingPanel.tsx:20-51` vs. inline `reading/page.tsx:1115-1130` |
| 5 | Fehlervermeidung | 3 | Geo-Fehlschlag ehrlich gerahmt (`reading/page.tsx:315-318`); aber kein Löschschutz |
| 6 | Wiedererkennen statt Erinnern | 2 | Entzündetes Licht zeigt nicht, welche Karte gezogen wurde (`StellarField.tsx:58-62`) |
| 7 | Flexibilität und Effizienz | 3 | Themen-Chips hängen an (`reading/page.tsx:632`), Geburtsdaten überspringbar, Session-Restore (`:157-174`) |
| 8 | Ästhetik und Minimalismus | 2 | Vier Instruction-Ebenen über dem Feld (`reading/page.tsx:872-884` + `StellarField.tsx:177-185`); Deko-Lichter kollidieren mit Zonen-Labels |
| 9 | Fehler erkennen und beheben | 2 | Shuffle-Fehler = Dead-End: step bleibt „stellar", Spinner läuft endlos (`reading/page.tsx:277-291`, `:456`, `:892-896`) |
| 10 | Hilfe und Dokumentation | 2 | „Warum Geburtsdaten?" vorbildlich (`reading/page.tsx:728-738`); KI-Panel der Detailseite ohne Leer-/Fehlerzustand (`readings/[id]/page.tsx:136-138`) |
| **Total** | | **23/40** | **Acceptable (20–27)** |

## Design Specificity Verdict

**LLM:** Über weite Strecken für ESO geschrieben: Zonen mit Deutungshinweisen (`StellarField.tsx:23-27`), deterministisches Signet in Flow UND Archiv (`Constellation.tsx:23-32`), Siegel-Moment (`reading/page.tsx:1190-1195`), konsequent durchgehaltene Gold/Violett-Zwei-Stimmen-Regel (`SymbolChip.tsx:19-21`). Zwei offene Driften: die leuchtend hellen RWS-Kartenscans mit Creme-Rand fallen aus dem schwarz-glasigen System (`TarotCard.tsx:62,186-199`); die Landing setzt den CrystalShard in `synthesizing={true}` (`app/page.tsx:76` — laut design.md:807 der Synthese vorbehalten) plus zwei `animate-pulse` und zwei Deko-Shards auf den ruhigsten Screen.

**Deterministischer Scan (erstmals mit aktivem Design-System):** CLI exit 2 mit **29 Findings — zu 100 % Token-Drift**, gegengezeichnet: `--no-design-system` → exit 0/0. Verteilung: `design-system-font-size` 23× (11px/9px-`text-[..]`-Literale in reading/page.tsx, FeedbackForm, KineticBlueprint, ReadingPanel, StellarField, page.tsx, readings/page.tsx) · `design-system-color` 6× (echte Off-Token-Literale: `Button.tsx:84` weiß 0.12, `CrystalShard.tsx:193` Off-Palette-Violett, 4× kaltweiße Tints in `CrystalSpinner.tsx`) · font/radius 0× (aktiv, Positivkontrolle feuert alle 4 Regeln). Browser: 25/22/17/12/21 Findings je Ziel (Landing/Frage/Resonanzfeld/Archiv/Detail) — dominiert von `undersized-ui-text` (bis 12×), `dark-glow`, `radial-spotlight-glow`, `overused-font`, `text-occlusion` (FP). **Defekt gefunden:** `web/.impeccable/design.json → ../../../.impeccable/design.json` ist ein ungültiger Symlink (auflöst auf `/home/okko/projects/...`, korrekt wäre `../../`) — Sidecar-Kanäle (Schatten-Farbabgleich, `mdNewerThanJson`-Drift) sind stumm, ohne Effekt auf das aktuelle Ergebnis, aber ein realer Installationsfehler.

**False Positives (hart belegt, nicht fixen):** `text-occlusion` 8× auf Detector-eigene Overlay-Labels (Kettenbeweis: `span → div.impeccable-label → div.impeccable-overlay`) · `overused-font` 8× für deklariertes Geist/Geist Mono · `ai-color-palette` 5× auf dokumentiertes Violett · `dark-glow` 16× auf Gold/Violett-Glow-Tokens — bleibt nachweislich auch bei repariertem Sidecar bestehen (Regel ist nicht design-system-bewusst) · `nested-cards` 1× an der dokumentierten KI-Panel-Struktur.

## Overall Impression

Der Fix-Durchgang hat die Substanz gehoben (+3): Eintritt und KI-Fehler sind keine Blocker mehr, das Fehler-Engineering und die Reduced-Motion-Umsetzung sind jetzt Spitzenfeld. Die Kritik wandert die Fluss abwärts: Die schwächsten Stellen sind jetzt das **Archiv** (toter Detail-Link, ungeschütztes Löschen) und die **Detailseite** (Modell-Transparenz, Leerzustand) — plus ein Ritual-Moment, dessen峰值 (Confirm-Button unter dem Fold) und ein Ende, das als Fragebogen statt als Abschluss kommt.

## Strengths

1. **Entscheidungspyramide im Resonanzfeld vorbildlich:** reversibel → explizite Bestätigung → Sperre (`StellarField.tsx:146-165,332-350`), `aria-pressed`, ganze Fläche als Trefferziel, Live-Region.
2. **Fehler-Engineering auf selten gutem Niveau:** jede Eingabe kehrt zurück (`reading/page.tsx:430-437`), ruhige deutsche Sätze mit nächster Handlung (`api-client.ts:40-68`), Retry nach Wiederholbarkeit getrennt (`:455-460`), Timeout vs. Unmount unterschieden (`:152`).
3. **`prefers-reduced-motion` wasserdicht:** `globals.css:315-323` mit `animation-iteration-count: 1`; live verifiziert — unter Emulation laufen null Animationen.

## Priority Issues

**[P0] Archiv → Detail-Link führt ins 404** — `readings/page.tsx:196` verlinkt `/reading/${id}` (404, verifiziert) statt `/readings/${id}` (200); eingeklappte Archivkarten sind gar nicht klickbar. Das Archiv ist funktional vom Reading getrennt. Fix: href korrigieren + gesamte Karte als Öffnen-Target. → `harden`

**[P0] Detailseite behauptet ein KI-Modell, das nie gelaufen ist** — `readings/[id]/page.tsx:176` fallbackt auf „Nebius Kimi K3", obwohl `modelUsed` null ist (Regression des Fix-Durchgangs — ehrlich benannt); dazu leeres KI-Panel bei `readingText === null` (`:136-138`) und Rohwert „PENDING" (`:168`). Verletzt KI-Transparenz als Produktanforderung. Fix: Modell-Chip nur bei echtem Lauf, eigener Leerzustand mit Erklärung, Statuswerte ins Deutsche. → `clarify`

**[P1] Shuffle-Fehler ist ein Dead-End mit endlosem Spinner** — Fehlerzweig setzt `step` nicht zurück, `canRetry` schließt „stellar" aus, Spinner läuft weiter (`reading/page.tsx:277-291,456,892-896`). Fix: auf „birth" zurücksetzen oder „stellar" retrybar machen. → `harden`

**[P1] Touch-Ziele unter 44 px + Löschung ohne Bestätigung** — gemessen: „Login" 36 px (`UserAuth.tsx:33`), „Abbrechen" 36 px (`reading/page.tsx:508`), Archiv-Expand/Löschen 32 px (`readings/page.tsx:158,164`), „Link kopieren" 36 px; irreversible Löschung 4 px neben dem Expand-Button. Fix: ≥44 px + Inline-Confirm wie beim Flow-Abbruch. → `harden`

**[P2] Landing läuft im Synthese-Modus; Consent verdeckt mobil Hero + CTA** — `app/page.tsx:76` `synthesizing={true}` gegen design.md:807, `animate-pulse` `:43,79`, Deko-Shards `:92-93`; `ConsentNotice.tsx:41` bedeckt auf 390 px den unteren Screen inkl. CTA. Fix: `synthesizing={false}`, Pulse raus, mobiles Consent als schmaler Streifen. → `quieter`

**Meta/Infra:** Sidecar-Symlink reparieren (`../../` statt `../../../`) — meinem eigenen Defekt aus dem Fix-Durchgang.

## Persona Red Flags

- **Jordan (First-Timer):** „Der Tod" als nackte Kartenname ohne beruhigende Rahmung (`TarotCard.tsx:210-214`; design.md:614-Stimme fehlt) · dritte Zone auf 390 px unsichtbar (`StellarField.tsx:194`) · nach der Wahl unbekannte Karte (`:58-62`) · Flow endet mit Fragebogen (`reading/page.tsx:1302-1319`).
- **Sam (Accessibility):** Tab-Order und Skip-Link korrekt (verifiziert, zwei eigene Anfangsbefunde zugunsten der Implementierung zurückgenommen) — ABER Tel-Links im Krisenpanel nur als „142, Link" ankündigt (`reading/page.tsx:1088-1094`); umgekehrte Karten im Archiv nur als „△" ohne Label (`readings/page.tsx:178`); 32–36-px-Ziele.
- **Casey (mobil, Daumen):** Consent verdeckt Hero + CTA bei Erstbesuch · „Legung bestätigen" bei y=848/844 gemessen — auf echtem Gerät mit Browser-Chrome unsichtbar, nichts scrollt hin · 4. Themen-Chip beim ersten Paint hinter der fixen Leiste · Tab-Wechsel/Reload sauber abgedeckt (`reading/page.tsx:157-174`).
- **Sara (akute Krise, produktspezifisch):** Panel stark (keine Symbolik, gedämpft, D/A/CH) — aber „Zurück zur Startseite" wirft sie ins Frage-Formular (`reading/page.tsx:1106` → `resetRitual`), Nummern ohne Kontext-Label, und der Bruch „kein Reading erzeugt" wird nie ausgesprochen.

## Minor Observations

- Wichtigste Fehlermeldung im `text-sm font-mono` (`reading/page.tsx:542-544`) gegen design.md:225; `followupError` korrekt in Sans — zwei Systeme.
- Element-Chips kleingeschrieben (`TarotCard.tsx:233`) gegen den Uppercase-Mono-Idiom (`SymbolChip.tsx:27`).
- „Nebius Kimi K3" + „READING #2XC5" als funktionslose Badges (design.md:226).
- Free-Limit („3 Readings/Tag") erst im Fehlerpanel sichtbar, nie proaktiv.
- `/reading/test` öffentlich erreichbar (Pipeline-Testseite, HTTP 200) — gehört in einer Beta hinter Auth.
- Consent-Panel = 6 Zeilen Rechtstext mit Links im Fluss (design.md:564); Landing-Disclaimer in `text-violet/60` = **2,30:1** bei 10px (`app/page.tsx:173`).
- Hydration-Warnung bei jedem Laden (`layout.tsx`/session-Restore); next-auth `MissingSecret` → 401 (Env, nicht Produkt).
- `ReadingPanel.tsx:32-40`Spinner bleibt unter Reduced Motion als statischer Kreis ohne Statusinfo.
- 4. Card-reveal-Anweisung statisch (siehe Heuristik 1).

## Questions to Consider

1. Ist die Zonenwahl ein Ritual mit Wahl — oder mit dem *Gefühl* von Wahl? Das entzündete Licht könnte sofort seinen Kartennamen sagen.
2. Warum endet der Flow mit einem Fragebogen, wenn das Siegel der perfekte Schlussakt wäre — und Feedback beim nächsten Besuch käme?
3. Braucht die Deutung auf Mobile eine eigene Satzstruktur statt nur kleinere Schrift (20 s Serifenblock auf 390 px)?

## Run Notes

Dual-agent, isoliert und parallel; Dev-Server 3000 von der übergeordneten Instanz verwaltet, nach beiden Assessments gestoppt (verifiziert). CLI-Detector: design-system-Regeln erstmals AKTIV (Positivkontrolle 4/4 Regeln; Differenzlauf --no-design-system = 0); 29 Findings = reine Token-Drift. Sidecar-Symlink ungültig (Befund verifiziert, Fix ausstehend). Browser: 5/5 Injektionen ok, frische Kontexte, nextjs-portal ausgeblendet; KI-Stufe ohne Key (502 < 1,5 s) — Synthese-Wartegefühl nur aus Code bewertet; DB: alle 7 Readings pending/ohne Text → Detailseite im Leerzustand bewertet. Screenshots `/tmp/eso-critique3-a/`. Repo unverändert (0 Einträge). A nahm zwei eigene Anfangsbefunde nach Verifikation zurück (Tab-Order, Fokus-Ring).
