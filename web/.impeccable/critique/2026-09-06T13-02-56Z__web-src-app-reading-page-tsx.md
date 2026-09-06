---
target: Reading-Flow /reading
total_score: 19
max_score: 40
na_heuristics: 
p0_count: 0
p1_count: 5
timestamp: 2026-09-06T13-02-56Z
slug: web-src-app-reading-page-tsx
---
# Critique (2. Lauf): Reading-Flow `/reading`

Method: dual-agent (A: Design-Review-Subagent · B: Evidenz-Subagent, isoliert und parallel)

**Ziel:** `web/src/app/reading/page.tsx` + 12 Flow-Komponenten · **Modus:** Operate (Ritual-Flow) · **Vergleichsbasis:** erster Lauf (14/40)

## Design Health Score: 19/40 — Poor (knapp an Acceptable)

| # | Heuristik | Score | Schlüsselproblem |
|---|-----------|-------|------------------|
| 1 | Sichtbarkeit des Systemstatus | 3 | Ehrliche Wartezeit, Live-Regionen; Follow-up-Budget bis zur ersten Nutzung unsichtbar |
| 2 | Match System/Realwelt | 2 | Doppelvokabular („Himmelsmechanik" vs. „Geburtsdaten"); Positionen nie erklärt |
| 3 | Nutzerkontrolle und Freiheit | 1 | Nur Birth-Screen hat „Zurück"; stellar/drawing/result ohne Rückweg |
| 4 | Konsistenz und Standards | 2 | Deutungs-Frame handgerollt vs. ReadingPanel; SymbolChip violet 10px gegen design.md; deprecated Palette im Feld |
| 5 | Fehlervermeidung | 2 | Feld stark; Topic-Chips überschreiben Text, „Neues Ritual" verwirft ohne Rückfrage |
| 6 | Recognition statt Recall | 2 | Result spiegelt Quellen zurück — Frage während stellar/drawing unsichtbar |
| 7 | Flexibilität und Effizienz | 1 | Keine Rückwärtsnavigation, keine URL-Steps, keine Frage-Wiederverwendung |
| 8 | Ästhetik und Minimalismus | 3 | Ruhige Fläche — Result stapelt Quellen + Volltext + Karten + Chat + Feedback |
| 9 | Fehler-Recovery | 1 | Kein Retry-Button, kein Scroll/Fokus zum Fehler; zwei Stillstand-Pfade |
| 10 | Hilfe und Dokumentation | 2 | Birth-Erklärungen gut; kein „Wie funktioniert das?", Positionen unerklärt |

## Design Specificity Verdict

**LLM:** Visuelle Sprache unmissverständlich ESO (Diamant-Geometrie, Gold/Violett-Semantik real im Code, Resonanzfeld als spezifischstes Element). Interaktions-/Kompositionsskelett austauschbar: Step 1 Standard-Muster, „Tiefer blicken" Chat-Template statt design.mds begrenztem Dialog. Verpasst: keine Zeitmarke am Deutungs-Eintrag, Konstellation wird nach einem Screen weggeworfen (kein Signet), CrystalShard fehlt am Result.

**Deterministischer Scan:** 0 Findings (Exit 0) auf 13 Zielen; Positivkontrolle bestanden. web/src-Kontrolle: 5 Findings außerhalb des Sets (side-tab about; bounce-easing, 2× gradient-text, codex-grid-background in globals.css — .text-gradient-violet wird via Utility-Klasse in der „Synthese läuft"-Headline genutzt). `.impeccable/design.json` wird NICHT geladen (Root-Walk stoppt an web/package.json; Loader verlangt DESIGN.md mit YAML-Frontmatter) → 4 design-system-Regeln inaktiv. Keine Ignores. Coverage: ~10/59 Regeln auf TSX; kein Browser-Overlay (keine Automatisierung verfügbar).

## Overall Impression

Ehrlicher, sicherer, zugänglicher — aber die Punkte liegen jetzt in Struktur, die die Fix-Durchgänge ausgespart haben: Rückwärtsnavigation, mobile Feld-Geometrie (44px-Ziele überlappen bei 78 Punkten auf 375px), nie sichtbare Konstellation, Flow-Ende mit destruktivem Gold-Button. Größte Chance: das Ende umdrehen („Dieses Reading behalten"), Konstellation als Signet, Zeitmarke als Grimoire-Stempel.

## Priority Issues

1. **[P1] Fehler-/Timeout-Pfade stranden in Stillstand** — Synthese-Timeout abortet still (Screen bleibt auf „wird gewoben"); Shuffle ohne Timeout; Limit-Fehler lässt Feld gesperrt; kein Scroll/Fokus zum Fehler. Fix: Timeout als behandelter Fehler mit Retry nach drawing, globales Timeout, Feld freigeben/Limit-CTA, scrollIntoView+Fokus. → harden
2. **[P1] Hit-Areas überlappen mobil** — 44px-Ziele bei ~38×28,5px Zellabstand (9 Spalten, 375px); Fehltaps, stummes Deselect. Fix: 6 Spalten/dynamische Zellgröße/Punkte ≥8px+Opacity 0,6 — oder Feld-Geometrie neu denken. → shape
3. **[P1] Konstellation bildet sich nie** — fixe Kartenbreiten stacken mobil (~1080px), Desktop 2+1; Energie-Linie zeichnet nicht existierende Achse. Fix: responsive Spread-Maße, Linie nur bei stehender Reihe. → adapt
4. **[P1] Result: Leselänge ~1200px, kein Aufbewahrungsmoment, destruktive dominante CTA** — Fix: max-w-[68ch], Abschlussmoment (Zeitmarke, Archiv-Bestätigung), „Neues Ritual" herabstufen/bestätigen. → shape + layout
5. **[P1] SR-/Tastatur-Integrität** — Textarea ohne Namen; Checkbox-Fokus unsichtbar; Primary-Fokusring 1,44:1; kein Fokusmanagement bei Schrittwechsel; Heading-Sprünge; chatty Counter. → harden

## Persona Red Flags (gekürzt)

- **Jordan:** Disabled-Grund 11px unterhalb; Topic-Chip überschreibt Text ohne Undo; „vertraue deiner Intuition" erzeugt Unsicherheit; bricht nach ewiger Synthese-Wartezeit ab.
- **Sam:** 78 identische Labels/Tabstopps; kein Fokusmanagement bei Schrittwechsel; Dialog ohne Fokus-Trap; scrollTo smooth ignoriert reduced-motion; „Senden" verliert Namen beim Laden. Positiv: MotionConfig, globales :focus-visible.
- **Casey:** Fehltaps im Feld; CTA außerhalb der Daumenzone; Fehler über ihr ohne Scroll; kein Shuffle-Timeout; Reload während Materialisierung → zweites Reading möglich. Positiv: Restore auf result vollständig.
- **Mira:** Radix als Behauptung ohne Beleg (keine Grade/Häuser); Themenbereich verschwindet; Follow-up-Limit vor Nutzung unsichtbar; nach dem Wertmoment kein Speichern/PDF/Upgrade; >100 Zeichen Zeilen.

## Minor Observations

Deprecated Palette im Feld (#3A254F-Hintergrund, hartkodierte ring-offset-Hex); SymbolChip violet 10px ≈ 4,46:1; StepIndicator zeigt „Geburtsdaten" als completed auch bei Skip; Persist pro Keystroke; 78 Re-Renders pro Pointermove; FeedbackForm nutzt rohes fetch; KineticBlueprint hängt am Modell-Format; En-Dash-Split; Krisen-Exit-Formulierung; Error-Panel teilt AnimatePresence-Kette.

## Provokante Fragen

1. Muss die Kartenwahl 78 gleichberechtigte Ziele haben — oder wären 3 Zonen/Cluster bedeutsamer UND treffsicherer?
2. Die Konstellation als Signet über der Deutung + Zeitmarke darunter = Wiedererkennungs- und Archiv-Motiv in einem?
3. „Dieses Reading behalten" statt „Neues Ritual beginnen" als dominante Endhandlung?
4. Follow-up als gezählte zweite Legung gerahmt statt als Chat?

## Run Notes

- Target slug: `web-src-app-reading-page-tsx` · Ignore-Liste: keine · Unabhängigkeit: 2 isolierte Subagents, parallel
- CLI-Detector: Exit 0, 0 Findings; Positivkontrolle bestanden; web/src-Kontrolle 5 Findings außerhalb; design.json nicht geladen (Root-Walk, fehlendes Frontmatter)
- Browser: übersprungen (kein Automatisierungstool); kein Overlay; Kein Live-Server; Temp-Dateien bereinigt
