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

### MVP-Palette

| Rolle | Farbe | Verwendung |
|-------|-------|------------|
| Background | `#09080D` | Haupt-Hintergrund |
| Surface | `#15121D` | Karten, Panels, Abschnitte |
| Surface Raised | `#211A2C` | hervorgehobene Flaechen |
| Text Primary | `#F4EBDD` | Haupttext |
| Text Secondary | `#B8AFA3` | Untertexte, Hinweise |
| Text Muted | `#7E748A` | Metadaten, Labels |
| Gold | `#C8A45D` | Primaerer Akzent, Tarot, CTA |
| Soft Gold | `#E0C98A` | Hover, Highlights |
| Violet | `#7C5CFF` | KI-Akzent, aktive Zustaende |
| Deep Violet | `#3A254F` | Hintergrund-Glow, KI-Zonen |
| Border | `#3A3148` | dezente Linien |
| Danger Muted | `#A66A6A` | Safety-/Fehlerhinweise |
| Success Muted | `#8BAE8B` | Erfolg, gespeicherte Aktion |

### CSS-Variablen-Vorschlag

```css
:root {
  --color-bg: #09080D;
  --color-surface: #15121D;
  --color-surface-raised: #211A2C;
  --color-text: #F4EBDD;
  --color-text-secondary: #B8AFA3;
  --color-text-muted: #7E748A;
  --color-gold: #C8A45D;
  --color-gold-soft: #E0C98A;
  --color-violet: #7C5CFF;
  --color-violet-deep: #3A254F;
  --color-border: #3A3148;
  --color-danger-muted: #A66A6A;
  --color-success-muted: #8BAE8B;
}
```

### Farbregeln

- Gold ist der primaere Markenakzent, aber sparsam einzusetzen.
- Violett markiert KI- und Synthese-Momente.
- Safety-Hinweise nutzen gedempftes Rot, nicht alarmierendes Signalrot.
- Flaechen bleiben dunkel und warm, nicht rein schwarz.
- Text muss WCAG-kontrasttauglich bleiben.
- Keine grossen Regenbogen- oder Neonverlaeufe.

---

## Typografie

### Empfehlung

| Zweck | Typografie | Charakter |
|-------|------------|-----------|
| Headlines | `Fraunces`, `Cormorant Garamond`, `Canela`, `Editorial New` | editorial, mystisch, hochwertig |
| UI und Fliesstext | `Inter`, `Satoshi`, `Geist`, `Avenir Next` | klar, modern, lesbar |
| Daten und Gradangaben | `IBM Plex Mono`, `Geist Mono`, `JetBrains Mono` | praezise, technisch, strukturiert |

### MVP-Empfehlung mit frei verfuegbaren Fonts

| Zweck | Font |
|-------|------|
| Headlines | `Fraunces` |
| UI/Text | `Inter` oder `Geist` |
| Daten | `Geist Mono` |

### Typografische Regeln

- Headlines duerfen poetisch und gross sein.
- Reading-Texte brauchen hohe Lesbarkeit und ausreichende Zeilenhoehe.
- Daten wie `Mond in Widder`, `Saturn Quadrat Sonne` koennen in kompakten Mono-Chips erscheinen.
- Keine komplett verschnörkelten Fonts fuer Fliesstext.
- Keine reine Monospace-App, sonst wirkt ESO zu trocken.

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

### Radius

| Element | Radius |
|---------|--------|
| kleine Chips | 999px |
| Inputs | 16px |
| Cards/Panels | 24px |
| Tarotkarten | 18px |
| Modals | 28px |

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

Ziel:

- emotionaler Ritualmoment
- tactile digitale Kartenhaptik
- kurze, nicht uebertriebene Animation

Layout:

- drei verdeckte Karten
- CTA `Karten aufdecken`
- nach Flip: Karte, Position, Symbol-Chip

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

### Geeignete Animationen

| Moment | Animation |
|--------|-----------|
| Karten ziehen | sanftes Anheben, Flip, kurzer Goldrand-Glow |
| Reading entsteht | gestaffeltes Reveal der Abschnitte |
| KI-Panel | dezenter violetter Rand-Puls beim Laden |
| Chart-Kontext | Linien zeichnen sich kurz ein |
| Speichern | kleine Siegel-/Archiv-Animation |

### Nicht geeignet

- dauernd flackernde Sterne
- starke Parallax-Effekte im MVP
- lange Ladeanimationen
- uebertriebene Portal-Animationen
- zufaellige Glow-Effekte ohne Bedeutung

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

## Fazit

ESO sollte als `The Digital Grimoire` gestaltet werden: ein dunkles, hochwertiges, editorial-mystisches Interface mit goldener Tarot-Symbolik, klarer mobiler Nutzerfuehrung und transparent abgegrenzter KI-Deutung.

Die visuelle Magie entsteht nicht durch Ueberladung, sondern durch wenige praezise Elemente: starke Typografie, dunkle Flaechen, goldene Linien, ruhige Kartenanimationen, klare Symbol-Chips und ein eigenes visuelles System fuer KI-generierte Readings.
