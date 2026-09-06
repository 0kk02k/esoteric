---
target: Reading-Flow /reading
total_score: 14
max_score: 40
na_heuristics: 
p0_count: 2
p1_count: 3
timestamp: 2026-09-06T11-51-08Z
slug: web-src-app-reading-page-tsx
---
# Critique: Reading-Flow `/reading`

Method: dual-agent (A: Design-Review-Subagent · B: Evidenz-Subagent, isoliert und parallel)

**Ziel:** `web/src/app/reading/page.tsx` (902 Z.) + 10 Flow-Komponenten · **Surface-Modus:** Operate (Ritual-Flow) · **Kontext:** Geschlossene Beta, Fokus Feinschliff

## Design Health Score

| # | Heuristik | Score | Schlüsselproblem |
|---|-----------|-------|------------------|
| 1 | Sichtbarkeit des Systemstatus | 2 | `Stream Aktiv` ungebundener Fake-Status (page.tsx:318); `Interpretation Aktiv`/`Synthese aktiv` im fertigen Zustand (773); Pseudofortschritt (742) |
| 2 | Match System/Realwelt | 1 | `Kontinuieren` kein Deutsch (440); Schrittnamen `Kosmos`/`Spiegel` nicht abbildbar; Feedback-Skala `Präzise/Teils/Unklar` misst anderes Konstrukt |
| 3 | Nutzerkontrolle und Freiheit | 1 | Feld-Auswahl irreversibel, kein Zurück zwischen Steps, `Abbrechen` ohne Bestätigung, Synthese nicht abbrechbar |
| 4 | Konsistenz und Standards | 2 | Zwei parallele KI-Label-Systeme; Tokens flächendeckend off-design.md; Feedback-Input umgeht `.glass-input` |
| 5 | Fehlervermeidung | 2 | Disabled-Buttons ohne Erklärung; date ohne min/max; stiller Geokoding-Fehlschlag |
| 6 | Recognition statt Recall | 1 | Frage nie im Result gezeigt; Radix-Chips verschwinden vor der referenzierenden Deutung |
| 7 | Flexibilität und Effizienz | 1 | Kein Tastatur-Pfad, kein Deep-Link, keine Themen-Chips, keine Wiederhol-Abkürzung |
| 8 | Ästhetik und Minimalismus | 2 | Synthese: 4 Gradient-Layer + Partikel; Feedback tausende Pixel tief; Deko-Metadaten auf informative Ebene |
| 9 | Fehler-Recovery | 1 | Rohe Strings (`Reading error: 500`), Reset löscht Frage, eingefrorenes Feld ohne Escape |
| 10 | Hilfe und Dokumentation | 1 | `Warum Geburtsdaten?` gut; Geburtszeit-Unsicherheit, Follow-up-Rest, umgekehrte Karten unerklärt |
| **Total** | | **14/40** | **Poor (12–19)** |

## Design Specificity Verdict

**LLM:** Visuelle Sprache eigenständig, Interaktions-/Informationsarchitektur halb austauschbar. Produktspezifisch: StellarField-Resonanzfeld, Gold/Violett-Semantik, KineticBlueprint als editoriales Artefakt, Panel-Eckwinkel. Austauschbar: 9px-Mono-Uppercase-Label-Idiom überall, Deko-Metadaten (`Blueprint Engine v2.4`, `Stream Aktiv`, `Symbol-Vektoren`). Fünf Metaphern-Register parallel (Grimoire/Kristall/Cosmic/Engineering/Ritual). Kartenrücken im App schwächer als das Favicon; `ReadingPanel` wird umgangen; `CelestialBackground` verstößt gegen design.md-Motion-Verbot; Tokens systematisch kälter/schwärzer als design.md (bg `#050508` statt `#09080D`, Radius 16 statt 24 u. a.); Cormorant Garamond als Display UND Fließtext.

**Deterministischer Scan:** 0 Findings (Exit 0) über 11 Dateien; Positivkontrollen bestanden (injizierte Patterns → Exit 2). Coverage: nur 10/59 Regeln auf TSX wirksam (Regex); Kontrast-/Typo-/Spacing-Analyzer brauchen DOM — die A-Kontrastbefunde (3,2:1 / 1,6:1 / 1,2:1) liegen in der ungetesteten Klasse. `design-system-*`-Regeln deaktiviert (keine maschinenlesbare Design-System-Config) → Token-Drift für den Detector unsichtbar. Keine False Positives.

**Visuelle Overlays:** Keine — keine Browser-Automatisierung in dieser Session, nichts injiziert, kein nutzersichtbares Overlay vorhanden.

## Overall Impression

Drei echte Marken-Assets (StellarField-Konzept, Farbsemantik, KineticBlueprint), aber zwei P0-Grenzen (Krisen-State im mystischen Rahmen, pointer-only/irreversibler Kernschritt) und ein Result-Screen, der Vertrauen verspielt: echte Quellen fehlen, erfundene Techno-Metadaten stehen daneben. Größte Chance: das Ritual ehrlich und zugänglich machen.

## What's Working

1. StellarField als Marken-Asset (deterministische Partikel, Gravitation, Slots `Gegenwart/Spannung/Impuls`) — Konzept richtig, Touch/Keyboard-Übertragung bricht.
2. Gold-Ritual/Violett-KI-Semantik durchgehend — „KI sichtbar, aber nicht dominant" funktioniert.
3. KineticBlueprint macht die Deutung zum Artefakt; Geburtsdaten-Screen lebt das Niedrigschwelligkeitsprinzip (Skip-Default, `Warum Geburtsdaten?`).

## Priority Issues

1. **[P0] Krisenantwort im mystischen Deutungsrahmen** — `safetyAction` wird ignoriert, Krisentext landet unter `Interpretation Aktiv` im Blueprint-Chrome. Fix: stiller Krisen-State ohne Ritual-Chrome, `tel:`-Links, keine Karten. → `$impeccable harden`
2. **[P0] Kerninteraktion pointer-only und irreversibel** — StellarField: `div` + `onPointerMove/Up`, `touch-none`, kein Button/role/tabIndex/aria-live; 78 Ziele à 3–5 px, kein Deselect/Reset. TarotCard ebenfalls div+onClick, umgekehrte Karten nur per Rotation. Fix: Buttons ≥44 px + Deselect + Reset + aria-live, oder design.md „drei verdeckte Karten" kehrt zurück. → `$impeccable shape`
3. **[P1] KI-Kennzeichnung/Disclaimer fehlen im Result** — `ReadingPanel` ungenutzt; keine Symbolquellen; Deko-Metadaten stattdessen. Fix: Label-Bar + Disclaimer + Quellen-Chips, Deko entfernen. → `$impeccable clarify`
4. **[P1] Recovery vernichtet Eingaben; Fehler roh/englisch** — Reset löscht Frage; `Reading error: 500` etc.; Follow-up-Limit ohne Restanzahl/CTA; Feld kann einfrieren. Fix: Retry-in-place, deutsche Texte mit nächster Handlung. → `$impeccable harden`
5. **[P1] Lesbarkeit** — kursive Display-Serif als Deutungskörper; `setTimeout(index*1000)`-Reveals verschieben Layout; Feedback tausende Pixel tief. Fix: Leseserif für Körper, Timer raus, Rhythmus dichtern. → `$impeccable typeset` (+ `layout`)

## Persona Red Flags

- **Jordan:** `Kontinuieren` unverständlich; disabled Button ohne Grund; StepIndicator-Labels entschlüsselbar und laufen auf 390 px aus dem Screen; Feedback-Frage unverständlich.
- **Sam:** Flow endet am StellarField vollständig; Karten nicht tastaturbedienbar; Kontraste 3,2:1 / 1,6:1 / 1,2:1 bei 9–10 px; keine `:focus-visible`-Regeln, `outline: none` in `.glass-input`, clip-path schneidet Fokusringe; `prefers-reduced-motion` greift nicht in Framer Motion; kein `aria-live`/`aria-current`.
- **Casey:** Reload = Totalverlust (useState, keine Persistenz), Reading zählt trotzdem gegens Limit; `Abbrechen` unbestätigt oben rechts; `touch-none` friert Scroll ein; Touch-Targets 22–30 px; 5 sequentielle Requests ohne Timeout.
- **Mira (Projektpersona, skeptische Premium-Zahlerin):** echte Quellen fehlen, Deko-Metadaten stattdessen; stiller Geokoding-Fehlschlag entfernt Radix ohne Hinweis; kein `Reading speichern`/Plus-Andockpunkt; Follow-up strippt Markdown-Formatierung.

## Minor Observations

- [P2] Abschluss-Labels mit pulsierendem Dot; `Stream Aktiv` nur Desktop; umgekehrte Karten-Chips auf dem Kopf; Zoom-Overlay unter scale-Transform; kein `h1`; Geburtszeit-Unsicherheit unerklärt (still `hour:12`).
- [P3] Timezone-Bug (`getTimezoneOffset` heutiger Zeitzone auf historischem Datum); `Tageslimit erreicht. 0 Readings übrig.` widersprüchlich; kein Zeichen-Zähler; keine Themen-Chips; Titel `Cyber-Mystik-Plattform` vs. `Kybernetisches Grimoire`; toter Code `getSlotPosition`.

## Questions to Consider

- Was gewinnt die Nutzerin durch das 78-Punkte-Feld gegenüber design.mds „drei verdeckten Karten"?
- Echte Herleitung (klickbare Quellen-Chips) statt `Blueprint Engine v2.4` — das Premium-Feature, das Co-Star nicht hat?
- Konsequente Farbsemantik: Violett-Deutung, Gold nur fürs Menschliche?
- Welcher Schließungs-Beat beendet den Flow (Siegel, `In deinem Archiv gespeichert`) statt `Unklar`?

## Run Notes

- Target slug: `web-src-app-reading-page-tsx` · Ignore-Liste: keine
- Unabhängigkeit: 2 isolierte Subagents, parallel
- CLI-Detector: Exit 0, 0 Findings, Positivkontrollen bestanden; Coverage 10/59 Regeln auf TSX
- Browser: übersprungen (kein Automatisierungstool); kein Overlay; Fallback Quellcode-Review
- Kein Live-Server; Temp-Dateien bereinigt; Projektdateien unverändert
