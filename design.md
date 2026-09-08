---
name: ESO — The Digital Grimoire
description: Dunkles, editoriales Grimoire — exakte Astrologie, Tarot und KI-Synthese in ruhiger, glaubwürdiger Mystik.
colors:
  background: "#050508"
  surface: "#0A0A0F"
  surface-raised: "#12121A"
  text-primary: "#F4EBDD"
  text-secondary: "#B8AFA3"
  text-muted: "#8F89A8"
  gold: "#C8A45D"
  gold-soft: "#E0C98A"
  violet: "#7C5CFF"
  violet-soft: "#9683FF"
  violet-deep: "#1A142E"
  border: "#1E1E2D"
  danger-muted: "#A66A6A"
  success-muted: "#8BAE8B"
typography:
  display:
    fontFamily: "Cormorant Garamond, Georgia, serif"
    fontWeight: 400
  body:
    fontFamily: "Geist, system-ui, sans-serif"
    fontSize: "16px"
  label:
    fontFamily: "Geist Mono, monospace"
    fontSize: "10px"
rounded:
  chip: "999px"
  input: "12px"
  card: "16px"
  tarot: "12px"
  modal: "20px"
---

# ESO - Designkonzept

Dieses Dokument definiert die verbindliche Designrichtung fuer ESO. Grundlage ist die empfohlene Richtung aus der Designrecherche: `The Digital Grimoire`.

ESO soll wie ein hochwertiges digitales Grimoire wirken: dunkel, editorial, mystisch, ruhig, vertrauenswuerdig und KI-transparent. Die Gestaltung verbindet Tarot-Aesthetik, astrologische Symbolik und moderne AI-Interface-Muster, ohne in Esoterik-Kitsch oder generische Wellness-Optik abzugleiten.

---

## Designrichtung

### Name / Titel

- **Haupttitel:** Kybernetisches Grimoire
- **Alternativer Titel:** Systeme der Selbsterkenntnis
- **Design-Arbeitstitel:** `The Digital Grimoire`

### Kurzbeschreibung

Ein dunkles, editorial-mystisches Interface mit goldenen Tarot- und Astrologie-Akzenten, klarer mobile-first UX und sichtbar abgegrenzter KI-Deutung.

### Kombination aus vier Einfluessen

| Einfluss | Uebernahme fuer ESO |
|----------|---------------------|
| Occult Editorial AI | Grundstruktur, Premium-Gefuehl, Typografie, dunkle Editorial-Flaechen |
| Astral Glass Companion | dezente KI-Panels, Glow, Layer, moderne AI-Transparenz |
| Arcane Atelier | Kartenhaptik, Tarot-Details, Journal-/Archiv-Gefuehl |
| Cosmic Minimal | klare UX, reduzierte Datenmodule, keine Ueberladung |

---

## Markenwirkung

ESO soll sich anfuehlen wie:

- ein persoenliches Ritual
- ein hochwertiges digitales Tarotdeck
- eine ruhige Sternenkarte
- ein vertraulicher Reflexionsraum
- eine moderne KI-Synthese, nicht ein beliebiger Chatbot

ESO soll nicht wirken wie:

- eine generische Wellness-App
- ein ueberladenes Esoterik-Portal
- ein Therapie- oder Coaching-Produkt
- ein Gaming-Fantasy-Interface
- ein greller KI-Chatbot
- eine billige Horoskop-Webseite

---

## Designprinzipien

1. Mystisch, aber nicht kitschig.
2. Persoenlich, aber nicht therapeutisch.
3. KI sichtbar, aber nicht dominant.
4. Mobile-first, aber hochwertig.
5. Ritualgefuehl mit klarer Produktlogik.
6. Lesbarkeit vor Dekoration.
7. Wenige starke visuelle Momente statt dauernder Effekte.
8. Datenschutz- und Safety-Hinweise ruhig sichtbar machen.
9. Erst Wert liefern, dann Account oder Upgrade anbieten.
10. Symbolik strukturiert darstellen, nicht mystifizieren.

---

## Visuelle Identitaet

### Grundstimmung

- dunkel
- warm
- ruhig
- geheimnisvoll
- hochwertig
- konzentriert
- poetisch
- technologisch subtil

### Visuelle Motive

Geeignet:

- goldene Kartenruecken
- feine Sternlinien
- abstrahierte Planetenbahnen
- dezente Horoskopkreise
- Tarot-Glyphen
- alte Buch-/Grimoire-Anmutung
- Linienornamente
- strukturierte Symbole
- dezente Glasflaechen fuer KI-Ausgaben

Nicht geeignet:

- generische KI-Frauen mit Sternenhintergrund
- Kristallkugeln als Hauptmotiv
- ueberladene Mandalas
- grelle Nebel-Portale
- Fantasy-RPG-Optik
- billige Glitzer-Effekte
- uebertriebene 3D-Planeten
- stockartige Wellness-Naturbilder

---

## Farbpalette

> **Verbindlicher Stand (2026-09-06):** Die implementierte, kaeltere und tiefschwarzere Palette ist die gewaehlte Welt ("Tiefschwarz-Englassistisch" statt warm-braun). Die frueheren Warmwerte (`#09080D`, `#15121D`, `#211A2C`, `#3A254F`, `#3A3148`) sind historisch und werden ersetzt.

### Implementierte Palette

| Rolle | Farbe | Verwendung |
|-------|-------|------------|
| Background | `#050508` | Haupt-Hintergrund |
| Surface | `#0A0A0F` | Karten, Panels, Abschnitte |
| Surface Raised | `#12121A` | hervorgehobene Flaechen |
| Text Primary | `#F4EBDD` | Haupttext |
| Text Secondary | `#B8AFA3` | Untertexte, Hinweise |
| Text Muted | `#8F89A8` | Metadaten, Labels (6,1:1 auf Background) |
| Gold | `#C8A45D` | Primaerer Akzent, Tarot, CTA, Ritual |
| Soft Gold | `#E0C98A` | Hover, Highlights, Focus-Ringe |
| Violet | `#7C5CFF` | KI-Akzent, aktive Zustaende, grosse Flachen |
| Violet Soft | `#9683FF` | Kleine Violett-Texte (6,8:1 — `#7C5CFF` erreicht als Textfarbe kein AA) |
| Deep Violet | `#1A142E` | Hintergrund-Glow, KI-Zonen |
| Border | `#1E1E2D` | dezente Linien |
| Blueprint | `#0F172A` | historisches Blueprint-Token (wird auslaufend entfernt) |
| Danger Muted | `#A66A6A` | Safety-/Fehlerhinweise |
| Success Muted | `#8BAE8B` | Erfolg, gespeicherte Aktion |

### CSS-Variablen (verbindlich, `web/src/app/globals.css`)

```css
:root {
  --color-bg: #050508;
  --color-surface: #0a0a0f;
  --color-surface-raised: #12121a;
  --color-text: #f4ebdd;
  --color-text-secondary: #b8afa3;
  --color-text-muted: #8f89a8;
  --color-gold: #c8a45d;
  --color-gold-soft: #e0c98a;
  --color-violet: #7c5cff;
  --color-violet-soft: #9683ff;
  --color-violet-deep: #1a142e;
  --color-border: #1e1e2d;
  --color-blueprint: #0f172a;
}
```

### Farbregeln

- Gold ist der primaere Markenakzent (Ritual, Karten, menschliche Beitraege), aber sparsam einzusetzen.
- Violett markiert KI- und Synthese-Momente; Gold und Violett laufen nicht gleichrangig durcheinander — die Deutung ist violett, das Menschliche gold.
- Kleine Violett-Texte (<18px) nutzen `--color-violet-soft`, nie reines `#7C5CFF` oder Transparenzstufen darunter 70%.
- Gold-Text unter 100% Deckkraft nur ab 70% (4,6:1); darunter nur fuer rein dekorative, aria-hidden Elemente.
- Safety-Hinweise nutzen gedempftes Rot (`#A66A6A`), nicht alarmierendes Signalrot.
- Text muss WCAG-AA kontrasttauglich bleiben: Bodytext >= 4,5:1, Grosstext >= 3:1.
- Keine grossen Regenbogen- oder Neonverlaeufe.

---

## Typografie

### Empfehlung

| Zweck | Typografie | Charakter |
|-------|------------|-----------|
| Headlines | `Fraunces`, `Cormorant Garamond`, `Canela`, `Editorial New` | editorial, mystisch, hochwertig |
| UI und Fliesstext | `Inter`, `Satoshi`, `Geist`, `Avenir Next` | klar, modern, lesbar |
| Daten und Gradangaben | `IBM Plex Mono`, `Geist Mono`, `JetBrains Mono` | praezise, technisch, strukturiert |

### Implementiert (verbindlich seit 2026-09-06)

| Zweck | Font |
|-------|------|
| Headlines (Display) | `Cormorant Garamond` (300–700) |
| Deutungs-/Lese-Serif | `Cormorant Garamond` — dieselbe Schrift traegt Display UND Lesebody, bewusst gewaehlt |
| UI/Text | `Geist` |
| Daten/Labels | `Geist Mono` |

### Typografische Regeln

- Headlines duerfen poetisch und gross sein.
- Deutungstext laeuft in Cormorant Garamond, aber NICHT kursiv und mit grosszuegiger Zeilenhoehe (>= 1,8) — Kursive Display-Serif ueber Absatzlaenge ist ein Lesbarkeitsfehler.
- Mindestens 16px Bodytext (iOS Safari zoomt fokussierte Inputs unter 16px).
- Daten wie `Mond in Widder`, `Saturn Quadrat Sonne` erscheinen in kompakten Mono-Chips (min. 10px, Kontrast beachten).
- Keine reine Monospace-App; Mono ist Daten-/Signatur-Layer, nicht Textlayer.
- Markanten Labels (9–11px Mono-Uppercase) nur wenn informationstragend; Deko-Metadaten ohne Funktion ("Engine v2.4", "Stream aktiv") haben im UI nichts verloren.

---

## Layoutsystem

### Grundlayout Mobile

- Einspaltig
- grosszuegige vertikale Abstaende
- klare Screen-Schritte
- Sticky oder prominenter Primaer-CTA
- Karten und Reading-Panels als zentrale Elemente
- Bottom Navigation erst ab gespeicherter Nutzerumgebung, nicht im ersten Onboarding erzwingen

### Grundlayout Desktop

- zentrierte Content-Spalte fuer Reading
- optionale Seitenleiste fuer Symbolkontext
- maximale Lesebreite begrenzen
- Tarotkarten koennen nebeneinander dargestellt werden
- Hintergrund darf mehr atmosphaerische Details zeigen

### Spacing

| Token | Wert | Verwendung |
|-------|------|------------|
| `space-1` | 4px | feine Abstaende |
| `space-2` | 8px | Labels, Chips |
| `space-3` | 12px | kleine Gruppen |
| `space-4` | 16px | Standardabstand |
| `space-6` | 24px | Card-Innenabstand |
| `space-8` | 32px | Screen-Sektionen |
| `space-12` | 48px | grosse Trennung |
| `space-16` | 64px | Hero-/Ritualmomente |

### Radius (implementiert, verbindlich)

| Element | Radius |
|---------|--------|
| kleine Chips | 999px |
| Inputs | 12px |
| Cards/Panels | 16px |
| Tarotkarten | 12px |
| Modals | 20px |

---

## Komponenten

### Button

Primaerbutton:

- dunkle Flaeche oder Goldverlauf
- klare Beschriftung
- leichte Glow-Kante bei Hover/Focus
- keine aggressiven Neon-Effekte

Beispiele:

- `Reading starten`
- `Karten ziehen`
- `Deutung ansehen`
- `Reading speichern`

Sekundaerbutton:

- transparente Flaeche
- Border in `#3A3148`
- Text in `#F4EBDD`

Safety-/Abbruchbutton:

- ruhig, klar, nicht dramatisch
- z. B. `Professionelle Hilfe anzeigen`

### Cards und Panels

Standardpanel:

- Background `#15121D`
- Border `#3A3148`
- Radius 24px
- dezenter Schatten

KI-Panel:

- Background `rgba(33, 26, 44, 0.78)`
- dezenter violetter Glow
- Label: `KI-generierte Deutung`
- Hinweis: `Symbolische Reflexion, keine professionelle Beratung`

Tarotkarte:

- dunkler Kartenruecken
- goldene Linien
- klares zentrales Symbol
- leichte Textur
- Flip-Animation

Symbol-Chips:

- kleine Pillen
- Mono oder kleine Sans
- z. B. `Sonne Jungfrau`, `Mond Widder`, `Der Turm - Mars`

### Inputs

Frage-Input:

- grosses Textfeld
- ruhiger Placeholder
- Beispielthemen als Chips
- keine Chatbot-Ueberladung

Geburtsdaten:

- Schrittweise Eingabe
- Geburtszeit optional
- Unsicherheit klar erklaeren
- Ortssuche mit ruhigem Dropdown

### Feedback

Nach jedem Reading:

- `Hat diese Deutung resoniert?`
- Daumen hoch/runter oder `Ja / Teilweise / Nein`
- optionale Tags:
  - `zu allgemein`
  - `hilfreich`
  - `zu intensiv`
  - `unpassend`
  - `mehr Astrologie`
  - `mehr Tarot`

---

## Screen-Konzepte

### 1. Landingpage

Ziel:

- Vertrauen aufbauen
- Mystische Stimmung setzen
- Produktgrenzen klar machen
- schnell zum ersten Reading fuehren

Elemente:

- Hero mit starker Headline
- ein goldener Kartenruecken oder Sternkreis
- kurzer Erklaerblock: `Geburtschart + Tarot + KI`
- CTA `Reading starten`
- Sekundaerlink `Wie ESO funktioniert`
- kurzer Hinweis: `KI-generierte symbolische Reflexion, keine professionelle Beratung`

Beispielcopy:

```text
Dein Spiegel aus Sternen, Karten und KI.

Ziehe drei Karten und erhalte eine symbolische Deutung auf Basis deines Geburtshoroskops, deiner Frage und aktueller Transite.
```

### 2. Onboarding

Ziel:

- nicht wie ein Formular wirken
- Nutzer schnell zum Wertmoment bringen
- Datenschutz transparent machen

Schritte:

1. Thema oder Frage
2. Geburtsdatum
3. Geburtszeit optional
4. Geburtsort
5. Tarot-Ziehung

Regeln:

- ein Hauptgedanke pro Screen
- Geburtsdaten duerfen uebersprungen werden
- bei fehlender Geburtszeit Unsicherheit erklaeren
- Account nicht vor dem ersten Reading erzwingen

### 3. Tarot-Ziehung

> **Entscheidung (2026-09-08, Redesign):** Die Ziehung ist ein **einheitliches Sternenfeld**: alle 78 Lichter sind Sterne und damit Ziele — Zonen-Baender entfallen. Ein Tipp waehlt den naechstgelegenen Stern (Nearest-Pick in Pixeln, Mindestabstand zwischen den Lichtern); die Reihenfolge der Tipps IST die Position — 1. Gegenwart, 2. Spannung, 3. Impuls. Nach jedem Tipp zeichnet sich die Linie zum vorherigen Stern; beim dritten schliesst sich die Figur zum ersten Licht, und alle Linien leuchten einmal auf. Danach bestaetigt sich die Wahl selbst — der dritte Tipp ist das Versprechen (Auto-Bestätigung, kein Confirm-Button). Ein Fehler der Erstellung entriegelt das Feld: umwählen, die naechste vollstaendige Figur zaehlt wieder. Abwahl durch erneuten Tipp auf den gewaehlten Stern; `Stern ziehen` (Blindwahl) und `Zuruecknehmen` erschliessen das Feld fuer Tastatur und Screenreader — 1–3 Tabstopps statt 78. Live-Region nennt Position und Kartenname. Das Signet im Flow und Archiv rekonstruiert genau diese geschlossene Figur aus den Karten-IDs. Fruehere "drei verdeckte Karten"- und Drei-Zonen-Layouts dieser Sektion sind historisch.

Ziel:

- emotionaler Ritualmoment
- tactile digitale Kartenhaptik
- kurze, nicht uebertriebene Animation

Layout:

- Sternenfeld als eine Flaeche (Mobile 4:5, Desktop 16:9), alle 78 Lichter antippbar
- Positionsanzeigen `Gegenwart / Spannung / Impuls` als Chips unter dem Feld, fuellen sich mit Nummer und Kartenname
- nach der Auto-Bestätigung: Karten-Enthuellung gestaffelt als Ritual-Reveal (Flip, Karte, Position, Symbol-Chips); Tipp auf eine Karte ist der manuelle Skip; `prefers-reduced-motion` enthuellt sofort
- Ausnahme von der setTimeout-Kaskaden-Regel (`:511`) genau fuer dieses Ritual-Reveal

Positionen MVP:

- `Gegenwart`
- `Spannung`
- `Impuls`

### 4. Reading

Ziel:

- Deutung klar, ruhig und nachvollziehbar darstellen
- KI-Inhalt sichtbar kennzeichnen
- Symbolquellen transparent machen

Struktur:

1. Nutzerfrage
2. Tarotkarten
3. Astrologischer Kontext
4. KI-generierte Deutung
5. Reflexionsfragen
6. Praktischer Impuls
7. Feedback
8. Speichern oder Account erstellen

Reading-Panel Label:

```text
KI-generierte Deutung
Basierend auf deinen Karten, deinem angegebenen Geburtskontext und den berechneten Symbolinformationen.
```

### 5. Journal / Archiv

Ziel:

- Retention aufbauen
- Nutzer erkennt Muster ueber Zeit
- persoenlicher Wert steigt

Elemente:

- gespeicherte Readings als Kartenliste
- Datum, Thema, Karten, kurzer Ausschnitt
- Filter nach Beziehung, Beruf, Selbstreflexion
- spaeter: haeufige Karten, Elemente, Themen

### 6. Paywall / Upgrade

Ziel:

- wertorientiert, nicht manipulativ
- erst nach erlebtem Nutzen anzeigen

Moegliche Copy:

```text
Mehr Tiefe freischalten

Speichere deine Readings, stelle mehr Nachfragen und erhalte monatliche Deutungen mit erweitertem Symbolkontext.
```

Nicht verwenden:

```text
Erfahre dein wahres Schicksal.
```

---

## Motion Design

### Prinzipien

- langsam genug fuer Ritualgefuehl
- schnell genug fuer Produktfluss
- keine dauerhaften Ablenkungen
- Bewegung bestaetigt Bedeutung
- Accessibility respektieren: `prefers-reduced-motion`
- **Die Buehne ruht:** der globale Hintergrund (CelestialBackground) ist statisch. Dauer-Rotationen und Partikel-Loops gehoeren nicht zur Buehne, sondern den Ritual-Momenten selbst (implementiert 2026-09-06; Framer-Motion-seitig via `<MotionConfig reducedMotion="user">` global abgesichert).
- Reveals laufen ausschliesslich ueber `whileInView` (Viewport-Trigger), nie ueber `setTimeout`-Kaskaden — kein Layout-Shift waehrend des Lesens (implementiert 2026-09-06).

### Geeignete Animationen

| Moment | Animation |
|--------|-----------|
| Karten ziehen | sanftes Anheben, Flip, kurzer Goldrand-Glow |
| Reading entsteht | gestaffeltes Reveal der Abschnitte (whileInView) |
| KI-Panel | dezenter violetter Rand-Puls beim Laden |
| Chart-Kontext | Linien zeichnen sich kurz ein |
| Speichern | kleine Siegel-/Archiv-Animation |

### Nicht geeignet

- dauernd flackernde Sterne
- starke Parallax-Effekte im MVP
- lange Ladeanimationen
- uebertriebene Portal-Animationen
- zufaellige Glow-Effekte ohne Bedeutung
- pseudo-quantifizierter Fortschritt (Fake-Prozentbalken) — Wartezeiten werden ehrlich gerahmt (erwartete Dauer, Status-Region)

---

## KI-Transparenz Im Design

KI-generierte Inhalte muessen immer klar erkennbar sein.

Regeln:

- Jedes KI-Reading bekommt ein Label.
- KI-Panels haben eine eigene visuelle Sprache: violetter Akzent, Glasflaeche, dezenter Glow.
- Der Nutzer sieht, welche Daten in die Deutung eingeflossen sind.
- Die Antwort wird als symbolische Reflexion gerahmt, nicht als Wahrheit.
- Follow-up-Fragen erscheinen als begrenzter Dialog, nicht als therapeutischer Chat.

Beispielhinweis:

```text
Diese Deutung wurde von KI erzeugt und verbindet die angezeigten Symbolinformationen. Sie ersetzt keine professionelle Beratung.
```

---

## Safety- und Compliance-Design

Safety darf nicht wie ein stoerender Fremdkoerper wirken, muss aber klar sichtbar sein.

### Normale Hinweise

- kleine Inline-Hinweise
- ruhiger Ton
- kurze Texte
- keine juristischen Textbloecke mitten im Flow

Beispiel:

```text
ESO bietet symbolische Reflexion. Bei medizinischen, rechtlichen, finanziellen oder akuten psychischen Fragen wende dich bitte an qualifizierte Fachpersonen.
```

### Krisenfall

Bei akuter Krise wird kein mystisches Reading angezeigt. Stattdessen erscheint ein klares Hilfe-Panel.

Design:

- dunkle, ruhige Flaeche
- gedempfter roter Akzent
- keine Tarot- oder Sternsymbolik als Hauptmotiv
- klare Telefonnummern und Handlungsaufforderung

---

## Accessibility

Mindestanforderungen:

- ausreichende Kontraste
- sichtbare Focus States
- `prefers-reduced-motion` beachten
- alle Formulare mit Labels
- Tarotkarten nicht nur ueber Farbe unterscheidbar machen
- Buttons mindestens 44px Touch-Ziel
- KI- und Safety-Hinweise screenreader-tauglich auszeichnen
- keine Information nur ueber Animation vermitteln

---

## Tonalitaet Der UI

### Stimme

- ruhig
- poetisch
- direkt
- respektvoll
- nicht autoritaer
- nicht dramatisch
- nicht therapeutisch

### Gute Formulierungen

- `Diese Karte kann auf ... hinweisen.`
- `Als Symbol gelesen, zeigt sich hier ...`
- `Ein moeglicher Reflexionsimpuls ist ...`
- `Wenn du moechtest, kannst du diesen Gedanken in deinem Journal speichern.`

### Schlechte Formulierungen

- `Das Universum will, dass du ...`
- `Du musst jetzt ...`
- `Diese Konstellation beweist ...`
- `Heile dein Trauma mit diesem Reading.`
- `Dein Schicksal ist entschieden.`

---

## MVP-Designscope

### Im MVP enthalten

- Landingpage
- Onboarding
- Frage-Input
- Geburtsdaten-Eingabe
- Tarot-Ziehung mit 3 Karten
- einfache Chart-Zusammenfassung
- KI-Reading-Panel
- Reflexionsfragen
- Feedback
- Speichern-/Account-CTA
- Free-Limit-/Upgrade-Hinweis
- Safety- und Disclaimer-Hinweise

### Nicht im MVP enthalten

- komplexe 3D-Karten
- animierte Sternennebel im Hintergrund
- vollstaendiges Design fuer native App
- umfangreiche Deck-Auswahl
- grosse Illustrationsbibliothek
- Synastrie-Spezialdesign
- Audio-/Voice-Interface
- komplexe Avatar- oder Companion-Figur

---

## Do / Don't

### Do

- dunkle Flaechen mit warmem Elfenbeintext nutzen
- Gold sparsam fuer Bedeutung einsetzen
- KI-Inhalte visuell kennzeichnen
- Karten als zentrales Ritualelement behandeln
- Geburtsdaten schrittweise abfragen
- Unsicherheit bei fehlender Geburtszeit sichtbar machen
- Safety-Hinweise ruhig und klar zeigen
- Designsystem frueh komponentenbasiert aufbauen

### Don't

- keine generischen KI-Bilder verwenden
- keine aggressiven Paywall-Texte nutzen
- keine deterministischen Schicksalsversprechen machen
- keine Therapie-Aesthetik imitieren
- keine zu langen Onboarding-Carousels bauen
- keine ueberladenen Horoskopgrafiken im MVP
- keine dauerhaften Glow-/Partikeleffekte einsetzen
- keine Account-Pflicht vor dem ersten Wertmoment erzwingen

---

## Erste Designkomponenten Fuer Umsetzung

Prioritaet 1:

- `Button`
- `Panel`
- `Input`
- `StepScreen`
- `TarotCard`
- `TarotSpread`
- `SymbolChip`
- `ReadingPanel`
- `SafetyNotice`
- `FeedbackPrompt`

Prioritaet 2:

- `BirthDataForm`
- `ChartSummary`
- `LoadingRitual`
- `UpgradeCard`
- `JournalCard`
- `ConsentNotice`

Prioritaet 3:

- `ReadingArchive`
- `PlanComparison`
- `AccountPrompt`
- `ErrorState`
- `EmptyState`

---

## Beispielhafte Informationsarchitektur

```text
/
  Landingpage
/reading/start
  Frage und Thema
/reading/birth
  Geburtsdaten optional
/reading/cards
  Tarot-Ziehung
/reading/result
  Deutung und Feedback
/journal
  gespeicherte Readings
/account
  Profil, Datenschutz, Limits
/upgrade
  Plus oder Premium
/legal/privacy
  Datenschutzerklaerung
/legal/imprint
  Impressum
/legal/terms
  Nutzungsbedingungen
```

---

## Erfolgskriterien Fuer Das Design

Das Design ist erfolgreich, wenn:

- Nutzer innerhalb weniger Sekunden verstehen, was ESO macht.
- der erste Reading-Flow auf Mobile ohne Erklaerung funktioniert.
- die App mystisch wirkt, ohne unserioes zu erscheinen.
- KI-generierte Inhalte eindeutig erkennbar sind.
- Safety-Hinweise sichtbar sind, ohne den Flow zu zerstoeren.
- Tarotkarten sich wie ein besonderer Moment anfuehlen.
- Reading-Texte angenehm lesbar sind.
- die App nicht wie Co-Star, CHANI, Sanctuary oder Labyrinthos kopiert wirkt.
- der Premium-Charakter glaubwuerdig ist.

---

## Zentrales Symbol: Floating Crystal Shards (Implementiert, v3)

Das zentrale visuelle Element auf Startseite und waehrend der KI-Synthese ist eine **Formation schwebender kristalliner Scherben** (Komponente: `CrystalShard.tsx`).

### Beschreibung

5 elongierte, prismatische Glasfragmente schweben in einer vertikalen Zickzack-Anordnung. Jede Scherbe hat eine iriszierende Glasoberflaeche mit mehreren Gradient-Layern die Lichtbrechung simulieren. Ein zentraler Binding-Glow (kein diskreter Lichtpunkt) haelt die Formation zusammen. Energie-Pulse wandern langsam entlang der Scherbenkanten — teils clockwise, teils counter-clockwise. 8 kleine Kristallfragmente umkreisen das Konstrukt auf weiten Orbits in verschiedenen Richtungen und Geschwindigkeiten. Dezente Debris-Partikel driften nach aussen.

### Varianten

| Variant | Verwendung | Farbpalette |
|---------|-----------|-------------|
| `gold` | Startseite Hero | Warmer Binding-Glow, kuehl-blaeuliche Glasfarbe, gold-warme Kanten-Pulse |
| `violet` | Synthese/Generating-Step | Violetter Binding-Glow, blau-violette Glasfarbe, violette Kanten-Pulse |

### Props

| Prop | Typ | Default | Beschreibung |
|------|-----|---------|-------------|
| `variant` | `"gold" \| "violet"` | `"gold"` | Farbschema |
| `synthesizing` | `boolean` | `false` | Erhoehte Aktivitaet: schnellere Bewegung, mehr Pulse, violetter Glow-Layer |
| `className` | `string` | — | Tailwind Size/Spacing-Klassen |

### Synthesizing-Modus

Wenn `synthesizing={true}`:
- Speed-Multiplikator 0.5× (alles doppelt so schnell)
- Float-Amplitude der Scherben × 2.2
- Rotations-Amplitude × 2.5
- Scale-Pulsation 1.04× statt statisch
- 4 Kanten-Pulse pro Scherbe statt 2 (je 2 CW + 2 CCW)
- Zusaetzlicher violetter Glow-Layer (`rgba(140,80,255,0.3)`) pulsiert mit Scale
- 14 statt 8 Debris-Partikel
- Binding-Glow deutlich intensiver

### Designprinzipien des Symbols

- Kristallin aber nicht materiell — schwebt, reflektiert, bricht Licht
- Kein zentraler Lichtpunkt — stattdessen diffuser Binding-Glow der alles zusammenhaelt
- Energie fliesst entlang der Scherbenkanten, nicht als separate Blitze
- Orbiting Mini-Shards erzeugen kosmische Tiefe und Dynamik
- Fragmente schweben asynchron → "lebendig, aber nicht chaotisch"
- Intro-Animation via Framer Motion Variants (einmalig, kein Re-Fade)
- Aktivitaetslevel skaliert mit dem semantischen Zustand (ruhig = Landing, aktiv = Synthese)

### Technische Umsetzung

- SVG `pathLength` + `pathOffset` Animation fuer Kanten-Energie
- Framer Motion `variants` mit `staggerChildren` fuer einmaligen Intro
- CSS `clip-path: polygon(...)` fuer Scherbenformen
- Mehrlagige Gradient-Layer fuer Irideszenz-Effekt
- `transform: rotate()` auf Container-Ebene fuer Orbits

---

## Design System: Crystalline UI Components (Implementiert)

Das gesamte UI wurde auf eine einheitliche kristalline Designsprache gehoben, die zum CrystalShard-Zentrum passt.

### 1. StepIndicator — "Faceted Crystal Path"

**Datei:** `src/components/StepIndicator.tsx`

Ersetzt generische Kreise durch 45°-rotierte Diamantformen:
- **Aktiver Step:** Pulsierender `box-shadow` Glow, 1.6× Scale, `text-shadow-gold` auf Label
- **Completed Steps:** Gefuellter Glaseffekt mit Gradient-Overlay
- **Connector-Linien:** Gradient-basiert mit wanderndem Energie-Pulse (nur bei completed)
- **Inactive Steps:** Subtiler `surface-raised` Fill mit kaum sichtbarer Border

### 2. Glass Inputs — "Glass Vessels"

**CSS-Klasse:** `.glass-input` (in `globals.css`)

Alle Formular-Inputs (textarea, date, time, text, follow-up) nutzen:
- `backdrop-blur(4px)` fuer Glaseffekt
- Subtile `border-top-color: rgba(255,255,255,0.06)` fuer Lichtkante
- Mehrlagiger `box-shadow`: innerer Schatten + aeusserer Glow
- Focus-State: Goldener Glow-Ring mit 3 Shadow-Layern, weicher Uebergang
- Kein harter `outline`, stattdessen `border-color` Transition

### 3. Kategorie-Buttons — "Crystal Chips"

**CSS-Klassen:** `.crystal-chip` / `.crystal-chip-active` (in `globals.css`)

Facettierte Chips statt generische Pills:
- Basis: `backdrop-blur(4px)`, dunkler Glass-Fill, subtile Border
- Hover: `::before` Pseudo-Element mit diagonalem Refraktions-Sweep
- Active: Innerer Gold-Glow + aeusserer Glow + verstaerkte Border
- `rounded-xl` statt `rounded-full` fuer kantigeren kristallinen Charakter

### 4. CrystalSpinner — "Crystallizing Indicator"

**Datei:** `src/components/CrystalSpinner.tsx`

Ersetzt alle generischen `animate-spin` Border-Spinner:
- 4 kleine Diamant-Shards auf verschiedenen Orbits
- 2 Shards clockwise, 2 counter-clockwise (CSS-only `@keyframes`)
- Zentraler pulsierender Diamant-Punkt (`crystal-pulse` Keyframe)
- Optional: `label`-Prop fuer Statustext darunter
- Verwendet in: Stellar-Field-Loading, Card-Reveal-Loading, Archiv-Loading

### 5. Chat Bubbles — "Glass Dialogue"

**CSS-Klassen:** `.glass-bubble` / `.glass-bubble-user` / `.glass-bubble-ai` (in `globals.css`)

Follow-up Chat-Nachrichten mit Glasmorphismus:
- **User-Bubbles:** Gold-getoentes Glas mit innerem Gold-Glow
- **AI-Bubbles:** Violet-getoentes Glas mit seitlichem Violet-Glow (links)
- Beide: `backdrop-blur(6px)`, top-border Licht-Catch, weicher Shadow

### 6. Headlines — "Luminous Type"

**CSS-Klassen:** `.heading-glow` / `.text-shadow-gold` / `.text-shadow-violet`

Wichtige Headlines erhalten dezenten Text-Shadow:
- `.heading-glow`: Gold-Glow + dunkler Text-Shadow fuer Tiefe
- `.text-shadow-gold`: Fuer aktive Labels (StepIndicator)
- `.text-shadow-violet`: Fuer Synthese-Phase Headlines
- Landing-Titel "KI-Grimoire" mit `heading-glow`

### 7. Background — Enhanced `bg-celestial`

Erweiterte Hintergrund-Textur:
- Basis: Grid-Pattern (40×40px) mit reduzierter Opacity (0.08 statt 0.1)
- Neu: Subtiler violetter Radial-Gradient oben-links (`rgba(124,92,255,0.03)`)
- Neu: Subtiler goldener Radial-Gradient unten-rechts (`rgba(200,164,93,0.02)`)
- Erzeugt lebendigeren Hintergrund ohne Ablenkung

### 8. Feature-Icons — Rotierte Diamanten

Landing-Page Feature-Grid Icons:
- `rounded-xl rotate-45` statt `rounded-full`
- Icon-Content via `-rotate-45` zurueckgedreht
- Hover: Scale + verstaerkte Border + goldener Glow-Shadow

### 9. Footer — Glass Panel

Landing-Page Disclaimer:
- In `glass-panel rounded-2xl` gewickelt statt nackter Text
- Gibt dem Footer visuelles Gewicht und integriert ihn ins Glasdesign

### CSS-Utilities Referenz (globals.css)

| Klasse | Zweck |
|--------|-------|
| `.glass-input` | Formular-Inputs mit Glas-Aesthetik |
| `.crystal-chip` | Basis-Button im Kristall-Stil |
| `.crystal-chip-active` | Aktiver Zustand des Crystal-Chips |
| `.glass-bubble` | Basis Chat-Bubble |
| `.glass-bubble-user` | User-Nachricht (Gold) |
| `.glass-bubble-ai` | AI-Nachricht (Violet) |
| `.heading-glow` | Gold Text-Shadow fuer Headlines |
| `.text-shadow-gold` | Kompakter Gold-Glow |
| `.text-shadow-violet` | Kompakter Violet-Glow |
| `.shimmer` | Animierter Shimmer-Hintergrund (fuer Loading-Skelette) |

### Keyframes (globals.css)

| Keyframe | Zweck |
|----------|-------|
| `shimmer` | Horizontaler Gradient-Sweep (3s loop) |
| `crystal-orbit` | 360° Rotation clockwise |
| `crystal-orbit-reverse` | 360° Rotation counter-clockwise |
| `crystal-pulse` | Opacity + Scale Pulsation auf Diamant-Punkt |

---

## Zentrales Symbol: Verworfene Alternativen (Fuer Spaetere Iteration)

### Alternative A: Aetherischer Kristall-Polyeder (Rotating Icosahedron)

Ein stilisierter Ikosaeder (20-Flaechen-Koerper) aus feinen, leuchtenden Wireframe-Kanten — keine gefuellten Flaechen, nur Linien. Leichter innerer Glow. Die Struktur rotiert langsam in 3D und pulsiert rhythmisch (Skalierung + Opacity der Linien).

**Staerken:**
- Starker kristalliner Charakter
- Hohe Wiedererkennung als "heilige Geometrie"
- Technisch per SVG + CSS 3D-Transforms realisierbar (12 Vertices, 30 Kanten als `<line>`-Elemente)

**Orbitale Elemente:** 3 leuchtende Punkte umkreisen den Polyeder auf elliptischen Bahnen (verschiedene Ebenen).

**Denkbar fuer:** Premium-Variante, alternative Landing-Page, Account-Level-Visualisierung.

### Alternative B: Aetherischer Energienexus (Converging Light Streams)

Kein festes Objekt im Zentrum, sondern 5-7 konvergierende Lichtfaeden (gebogene Linien) die spiralfoermig in einen leuchtenden zentralen Punkt fliessen. Die Stroeme pulsieren: ihre Dicke und Helligkeit variiert wellenfoermig vom Rand zum Zentrum. Im Kern ein intensiver, aber weicher Glow-Punkt der rhythmisch atmet.

**Staerken:**
- Maximale Aetheriats-Wirkung — reine Energie ohne physische Form
- Erinnert an Gravitationslinsen-Effekte oder eine Energiequelle die Kraefte aus dem Kosmos anzieht
- Extrem hohe Differenzierung am Markt

**Technik:** SVG `<path>` mit quadratischen Bezier-Kurven, animiert mit `stroke-dashoffset` fuer den Fluss-Effekt. Optional: SVG Turbulence-Filter.

**Orbitale Elemente:** Die konvergierenden Stroeme ersetzen diskrete Punkte. 2-3 hellere Knoten bewegen sich sichtbar auf den Bahnen.

**Denkbar fuer:** Synthese-/Loading-Animation in spaeterer Iteration, Premium-Report-Header, kosmische Hintergrund-Dekoration.

---

## Fazit

ESO sollte als `The Digital Grimoire` gestaltet werden: ein dunkles, hochwertiges, editorial-mystisches Interface mit goldener Tarot-Symbolik, klarer mobiler Nutzerfuehrung und transparent abgegrenzter KI-Deutung.

Die visuelle Magie entsteht nicht durch Ueberladung, sondern durch wenige praezise Elemente: starke Typografie, dunkle Flaechen, goldene Linien, ruhige Kartenanimationen, klare Symbol-Chips und ein eigenes visuelles System fuer KI-generierte Readings.
