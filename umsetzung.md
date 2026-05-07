# ESO - Stufenweiser Umsetzungsplan

Dieser Plan uebersetzt das Konzept aus `recherche.md` in eine konkrete, pruefbare Umsetzung. Jede Stufe endet mit einem Abschlusscheck und einer verpflichtenden Aktualisierung der Projektdokumentation.

Ziel ist ein schlanker, rechtlich vorsichtiger und technisch stabiler MVP fuer eine mobile-first Web-Plattform, die Astrologie, Tarot und KI zu einem symbolisch-reflektierenden Reading verbindet.

---

## Arbeitsprinzipien

- Jede Stufe liefert ein nutzbares, pruefbares Ergebnis.
- Keine neue Stufe beginnt, bevor der Abschlusscheck der vorherigen Stufe bestanden ist.
- Recht, Safety und Datenschutz werden nicht erst am Ende nachgezogen.
- Die KI darf nur narrativ synthetisieren, nicht astrologische Fakten erfinden.
- Kostenkontrolle, Logging und Rate Limits werden frueh eingebaut.
- Der MVP bleibt bewusst schmal: 3-Karten-Legung, Basis-Geburtschart, strukturierte KI-Deutung, Feedback, Safety, einfache Monetarisierungslogik.

---

## Zielbild MVP

Am Ende des MVP kann ein Nutzer:

1. Die Landingpage besuchen und Zweck, Grenzen und KI-Nutzung verstehen.
2. Ein Thema oder eine Frage eingeben.
3. Optional Geburtsdatum, Geburtszeit und Geburtsort angeben.
4. Drei Tarot-Karten ziehen.
5. Eine KI-generierte Deutung auf Basis strukturierter Tarot- und Chartdaten erhalten.
6. Eine begrenzte Nachfrage stellen.
7. Feedback zur Deutung geben.
8. Das Reading speichern oder einen Account erstellen.
9. Free-Limits erreichen und ein Upgrade-Angebot sehen.

---

## Rollen und Verantwortungsbereiche

| Bereich | Verantwortung |
|---------|---------------|
| Produkt | Scope, UX-Flows, Pricing, Erfolgskriterien |
| Frontend | Next.js UI, Onboarding, Tarot-Interaktion, Reading-Ansicht |
| Backend | APIs, Auth, Datenmodell, Rate Limits, Zahlungen |
| Astrologie | Ephemeris-Service, Chart-Berechnung, Aspekte, Transite |
| KI | Prompt-System, Provider-Interface, Output-Struktur |
| Safety | Input-/Output-Klassifikation, Krisenfluesse, Blockregeln |
| Recht/Datenschutz | Datenschutzerklaerung, Impressum, AGB, Consent, AVVs |
| Betrieb | Deployment, Monitoring, Logging, Kostenkontrolle |

Bei Solo-Umsetzung werden diese Rollen als Checklistenbereiche behandelt.

---

## Stufe 0: Projektgrundlage und Entscheidungen

### Ziel

Das Projekt wird organisatorisch, technisch und fachlich so vorbereitet, dass die Umsetzung ohne fundamentale Architekturwechsel starten kann.

### Aufgaben

- Projekt-Repository initialisieren oder bestehende Struktur festlegen.
- Tech-Stack final bestaetigen.
- Deployment-Strategie entscheiden:
  - Next.js + separater Python-Service
  - Docker-Monolith
  - nur Proof-of-Concept mit Child Process
- KI-Provider fuer MVP auswaehlen.
- Datenbankanbieter festlegen.
- Auth-Strategie festlegen:
  - anonyme Session zuerst
  - Account-Pflicht
  - Hybrid mit spaeterem Account
- Zahlungsstrategie fuer MVP festlegen:
  - Free + Plus
  - Free + Premium-Einmalkauf
  - Smoke Test ohne echte Zahlung
- Astrologische Standards festlegen:
  - Haus-System
  - Orbs fuer Aspekte
  - Umgang mit unbekannter Geburtszeit
  - Zeitzonen- und Geocoding-Quelle
- Altersgrenze und Nutzungsgrenzen definieren.
- Tracking-/Analytics-Ansatz festlegen.

### Deliverables

- finaler MVP-Scope
- Architekturentscheidung fuer Astrologie-Service
- Entscheidungsliste fuer offene Punkte aus `recherche.md`
- initiale Projektstruktur
- Umgebungsvariablen-Liste
- Risiko-Register Version 1

### Abschlusscheck

- Alle offenen Entscheidungen aus `recherche.md` sind beantwortet oder als bewusstes Risiko dokumentiert.
- Es gibt eine eindeutige Zielarchitektur fuer den MVP.
- Es ist klar, welche Features im MVP ausgeschlossen sind.
- Es ist klar, welche personenbezogenen Daten verarbeitet werden.
- Es gibt eine erste Liste benoetigter Drittanbieter und AVV-Kandidaten.

### Dokumentations-Update

`recherche.md` aktualisieren, falls Konzeptentscheidungen geaendert wurden.

`umsetzung.md` aktualisieren:

- Status von Stufe 0 auf abgeschlossen setzen.
- Getroffene Entscheidungen im Abschnitt "Entscheidungslog" eintragen.
- Neue Risiken im Abschnitt "Risiko-Log" eintragen.

---

## Stufe 1: Technischer Proof of Concept

### Ziel

Die kritischsten technischen Risiken werden vor dem eigentlichen Produktbau validiert: Astrologie-Berechnung, KI-Reading, Deployment-Faehigkeit und Kostenrahmen.

### Aufgaben

- Minimalen Next.js-Prototyp erstellen.
- Astrologie-Service als Spike implementieren.
- Swiss Ephemeris / pyswisseph installieren und testen.
- Ephemeris-Dateien reproduzierbar bereitstellen.
- Beispiel-Geburtschart berechnen:
  - Sonne
  - Mond
  - Aszendent
  - Hauptplaneten
  - einfache Aspekte
- Umgang mit unbekannter Geburtszeit testen.
- Beispiel-Reading-Context als JSON erzeugen.
- KI-Provider anbinden.
- Testprompt fuer 3-Karten-Legung ausfuehren.
- Antwortzeit und Kosten pro Reading messen.
- Zieldeployment testen.
- Fehlerfall testen, wenn Astrologie-Service nicht erreichbar ist.

### Deliverables

- lauffaehiger technischer Spike
- Beispiel-JSON fuer Reading-Context
- Beispielausgaben der KI
- Messwerte fuer Latenz und Tokenkosten
- Deployment-Ergebnis
- Entscheidung: Architektur ist tragfaehig oder muss geaendert werden

### Abschlusscheck

- Ein Beispielchart kann deterministisch berechnet werden.
- Die KI erhaelt strukturierte Daten und erfindet keine Chartdaten.
- Die gesamte Kette funktioniert mindestens lokal:
  - Nutzerinput
  - Chartberechnung
  - Tarot-Daten
  - Reading-Context
  - KI-Antwort
- Das Zieldeployment wurde erfolgreich getestet oder ein klarer Wechselpfad wurde entschieden.
- Latenz und Kosten liegen in einem fuer MVP akzeptablen Rahmen.
- Fehlerfaelle fuehren nicht zu leeren oder irrefuehrenden Readings.

### Dokumentations-Update

`recherche.md` aktualisieren:

- Technische Architektur finalisieren.
- Deployment-Optionen auf die gewaehlte Variante reduzieren oder priorisieren.
- Bekannte technische Grenzen dokumentieren.

`umsetzung.md` aktualisieren:

- Messergebnisse eintragen.
- Architekturentscheidung bestaetigen.
- Offene technische Risiken aktualisieren.

---

## Stufe 2: Datenmodell und Backend-Fundament

### Ziel

Die persistente Grundlage fuer Nutzer, Geburtsprofile, Tarotdaten, Readings, Feedback, Limits und Safety-Events wird aufgebaut.

### Aufgaben

- Datenbankschema entwerfen und implementieren.
- Tabellen anlegen:
  - `users`
  - `birth_profiles`
  - `chart_calculations`
  - `tarot_cards`
  - `tarot_draws`
  - `readings`
  - `feedback`
  - `usage_limits`
  - `subscriptions`
  - `safety_events`
- Tarot-Kartenstammdaten fuer MVP einpflegen.
- Golden-Dawn-Zuordnungen strukturiert hinterlegen.
- API-Routen fuer Kernobjekte erstellen.
- Datenvalidierung fuer Geburtsdaten und Nutzerfragen einbauen.
- Fehler- und Audit-Felder definieren.
- Basale Zugriffstrennung vorbereiten.
- Migration-Workflow einrichten.
- Seed-Daten fuer lokale Entwicklung bereitstellen.

### Deliverables

- lauffaehiges Datenbankschema
- Seed-Daten fuer Tarotkarten
- Backend-API fuer Reading-Erstellung
- Validierung fuer Nutzereingaben
- dokumentiertes Datenmodell

### Abschlusscheck

- Alle MVP-Tabellen sind vorhanden.
- Tarot-Karten koennen aus der Datenbank geladen werden.
- Ein Reading kann mit Nutzerfrage, Tarotziehung und optionalem Geburtsprofil gespeichert werden.
- Feedback kann einem Reading zugeordnet werden.
- Usage-Limits koennen pro Nutzer oder Session geprueft werden.
- Safety-Events koennen gespeichert werden, ohne unnoetig sensible Daten zu loggen.
- Migrationen lassen sich lokal reproduzierbar ausfuehren.

### Dokumentations-Update

`recherche.md` aktualisieren:

- Datenmodell an tatsaechliche Tabellen anpassen.
- Datenschutzprinzipien konkretisieren, falls Daten anders gespeichert werden.

`umsetzung.md` aktualisieren:

- Datenmodell-Version eintragen.
- Abweichungen vom Plan dokumentieren.
- Neue technische Schulden erfassen.

---

## Stufe 3: Astrologie-Service produktionsnah machen

### Ziel

Der Astrologie-Service liefert reproduzierbare, versionierte und sichere Berechnungen fuer den MVP.

### Aufgaben

- Service-Schnittstelle definieren.
- Request-/Response-Schema festlegen.
- Zeitzonen-Handling implementieren.
- Geocoding fuer Geburtsort integrieren oder vorbereiten.
- Natal-Berechnung implementieren:
  - Sonne
  - Mond
  - Merkur
  - Venus
  - Mars
  - Jupiter
  - Saturn
  - Aszendent, wenn Geburtszeit vorhanden
  - Haeuser, falls Geburtszeit vorhanden
- Transit-Berechnung fuer ausgewaehlte aktuelle Transite implementieren.
- Aspekte berechnen und Orbs anwenden.
- Unsicherheitslogik bei unbekannter Geburtszeit implementieren.
- Caching fuer Chartberechnungen einfuehren.
- Versionierung der Berechnungslogik einfuehren.
- Tests mit bekannten Beispielcharts anlegen.
- Fehlerantworten standardisieren.

### Deliverables

- Astrologie-Service API
- dokumentiertes Request-/Response-Schema
- Tests fuer Beispielcharts
- Caching-Strategie
- Versionierte Chartberechnungen

### Abschlusscheck

- Derselbe Input erzeugt reproduzierbar denselben Output.
- Unbekannte Geburtszeit wird korrekt als Unsicherheit markiert.
- Der Service gibt keine stillen Teilfehler als vollstaendige Wahrheit aus.
- Tests fuer Beispielcharts laufen erfolgreich.
- Response-Zeiten sind fuer den MVP akzeptabel.
- Caching verhindert unnoetige Wiederholungsberechnungen.
- Lizenz- und Deployment-Fragen fuer Ephemeriden sind geklaert oder als Blocker dokumentiert.

### Dokumentations-Update

`recherche.md` aktualisieren:

- Astrologische Standards eintragen.
- Grenzen der Berechnung ergaenzen.
- Gewaehltes Haus-System und Orbs dokumentieren.

`umsetzung.md` aktualisieren:

- Astrologie-Service-Version eintragen.
- Testfaelle und bekannte Abweichungen dokumentieren.

---

## Stufe 4: KI-, Prompt- und Safety-System

### Ziel

Die KI erzeugt konsistente, nicht-direktive und sichere Deutungen auf Basis strukturierter Daten.

### Aufgaben

- Provider-Interface fuer KI-Modelle erstellen.
- Systemprompt und Developerprompt definieren.
- Reading-Context-Schema finalisieren.
- Output-Struktur definieren:
  - Einstieg
  - Kernthema
  - Tarot-Deutung
  - Chart-/Transit-Verbindung
  - Reflexionsfragen
  - praktischer Impuls
  - Grenzenhinweis bei sensiblen Themen
- Input-Klassifikation implementieren.
- Harte Blockregeln fuer Hochrisiko-Kategorien implementieren.
- Output-Check implementieren.
- Krisentext fuer DACH fest hinterlegen.
- Prompt-Evaluation mit Beispielinputs durchfuehren.
- Testset fuer erlaubte und blockierte Fragen erstellen.
- Tokenbudget und Modellrouting definieren.
- Logging fuer Kosten und Safety-Events einbauen.

### Deliverables

- Prompt-Version 1
- Safety-Regelset Version 1
- Testset fuer KI und Safety
- lauffaehige Reading-Generierung
- Kostenmessung pro Reading
- dokumentierte verbotene und erlaubte Antwortmuster

### Abschlusscheck

- KI-Antworten enthalten keine erfundenen Planetenpositionen.
- Medizinische, rechtliche, steuerliche und finanzielle Fragen werden korrekt begrenzt oder umgeleitet.
- Akute Krisenfragen erzeugen keinen spirituellen Reading-Text.
- Antworten sind nicht deterministisch und geben keine Befehle fuer Lebensentscheidungen.
- Tokenkosten bleiben innerhalb des definierten Budgets.
- Prompt- und Safety-Version werden pro Reading gespeichert.
- Mindestens 20 Testfaelle wurden manuell geprueft.

### Dokumentations-Update

`recherche.md` aktualisieren:

- Prompt-Regeln an tatsaechliche Implementierung anpassen.
- Safety-Konzept mit finalen Kategorien und Texten aktualisieren.

`umsetzung.md` aktualisieren:

- Prompt-Version dokumentieren.
- Safety-Testfaelle und Ergebnisse eintragen.
- Bekannte Grenzfaelle erfassen.

---

## Stufe 5: Frontend-MVP und Nutzerfluss

### Ziel

Der Nutzer kann den kompletten MVP-Flow von Landingpage bis Reading-Feedback mobil nutzen.

### Aufgaben

- Landingpage erstellen:
  - Positionierung
  - Produktnutzen
  - KI-Hinweis
  - Grenzen/Disclaimer
  - CTA zum ersten Reading
- Onboarding-Flow erstellen:
  - Thema/Frage
  - Geburtsdaten optional
  - Datenschutz-/Consent-Hinweise
- Tarot-Ziehung mit 2D-Animation bauen.
- 3-Karten-Spread darstellen.
- Reading-Ladezustand und Fehlerzustand bauen.
- Reading-Ansicht strukturieren.
- Basis-Horoskop oder Chart-Zusammenfassung darstellen.
- Feedback-Komponente einbauen.
- Eine Nachfrage pro Reading ermoeglichen.
- Account- oder Speichernachfrage nach Wertmoment einbauen.
- Free-Limit-Hinweis und Upgrade-CTA vorbereiten.
- Mobile- und Desktop-Responsiveness testen.
- Accessibility-Basis pruefen.

### Deliverables

- klickbarer End-to-End-MVP
- mobile Landingpage
- Onboarding
- Tarot-Ziehung
- Reading-Ansicht
- Feedback-Flow
- Fehler- und Ladezustaende

### Abschlusscheck

- Ein neuer Nutzer kann ohne Erklaerung ein erstes Reading abschliessen.
- Der Flow funktioniert auf Smartphone-Breite.
- Geburtszeit ist optional und Unsicherheit wird erklaert.
- Datenschutz- und KI-Hinweise erscheinen vor relevanter Datenverarbeitung.
- Fehler beim KI- oder Astrologie-Service werden verstaendlich angezeigt.
- Feedback kann erfolgreich gespeichert werden.
- Der Account-/Speicher-CTA erscheint erst nach dem ersten Wertmoment.
- Die UI enthaelt keine medizinischen, therapeutischen oder deterministischen Claims.

### Dokumentations-Update

`recherche.md` aktualisieren:

- Frontend-UX an tatsaechliche MVP-Flows anpassen.
- Nicht umgesetzte UX-Ideen in "Nach dem MVP" verschieben.

`umsetzung.md` aktualisieren:

- Flow-Screens dokumentieren.
- Bekannte UX-Probleme erfassen.
- Entscheidungen zu Account, Speicherung und Limits nachtragen.

---

## Stufe 6: Auth, Speicherung und Nutzungslimits

### Ziel

Readings, Nutzerstatus und Limits funktionieren kontrolliert, ohne den ersten Produktwert zu blockieren.

### Aufgaben

- Auth-System integrieren.
- Anonyme Session oder Gastmodus implementieren.
- Account-Erstellung nach Reading ermoeglichen.
- Gespeicherte Readings an Nutzer binden.
- Loeschfunktion fuer Readings vorbereiten.
- Tageslimit fuer Free-Nutzung implementieren.
- Follow-up-Limit pro Reading implementieren.
- Admin- oder internes Debugging fuer Usage-Limits vorbereiten.
- Missbrauchsschutz pro IP/Session/User implementieren.
- E-Mail-Flows testen, falls Magic Link genutzt wird.

### Deliverables

- Auth-/Session-System
- Reading-Historie oder Speicherfunktion
- Free-Limits
- Follow-up-Limits
- Loeschlogik fuer Nutzerinhalte

### Abschlusscheck

- Nutzer koennen ein Reading ohne harte Account-Pflicht starten, falls Hybrid-Modell gewaehlt wurde.
- Gespeicherte Readings sind nur fuer berechtigte Nutzer sichtbar.
- Free-Limits greifen nachvollziehbar.
- Follow-up-Fragen sind begrenzt.
- Logout/Login verliert keine korrekt gespeicherten Daten.
- Loeschlogik funktioniert fuer Readings und Geburtsprofile.
- Missbrauch durch wiederholte Requests ist mindestens basal begrenzt.

### Dokumentations-Update

`recherche.md` aktualisieren:

- Auth- und Datenschutzbeschreibung an Implementierung anpassen.
- Datenloeschung und Speicherung konkretisieren.

`umsetzung.md` aktualisieren:

- Limitregeln dokumentieren.
- Auth-Entscheidungen und offene Datenschutzfragen festhalten.

---

## Stufe 7: Monetarisierung und Zahlungsfluss

### Ziel

Der MVP enthaelt eine einfache, testbare Monetarisierungslogik mit Kostenkontrolle.

### Aufgaben

- Pricing fuer MVP final festlegen.
- Stripe oder Smoke-Test-Mechanik integrieren.
- Produktplaene definieren:
  - Free
  - Plus
  - Premium Report oder Warteliste
- Checkout-Flow einbauen oder Fake-Door-Test implementieren.
- Webhook-Verarbeitung fuer Zahlungen vorbereiten.
- Subscription-Status in Nutzungslimits integrieren.
- Upgrade-CTA im richtigen Moment platzieren.
- Rechnungs- und Steueranforderungen pruefen.
- Kostenmonitoring pro Nutzer und Plan ergaenzen.

### Deliverables

- Pricing-Konfiguration
- Upgrade-Flow
- Subscription- oder Zahlungsstatus
- Stripe-Webhooks oder dokumentierter Smoke Test
- Kostenkontrolle pro Plan

### Abschlusscheck

- Free-Nutzer erhalten klare Limits.
- Plus- oder Premium-Nutzer erhalten erweiterte Nutzung, falls echte Zahlung aktiv ist.
- Zahlungsstatus wirkt korrekt auf Limits.
- Fehlgeschlagene Zahlungen fuehren nicht zu inkonsistenten Accounts.
- Upgrade-CTA ist verstaendlich und nicht aggressiv.
- KI-Kosten pro Plan sind kalkuliert.
- Rechtliche Pflichttexte fuer Zahlung sind identifiziert.

### Dokumentations-Update

`recherche.md` aktualisieren:

- Monetarisierungsmodell mit finalen Preisen und Limits aktualisieren.
- Kostenannahmen dokumentieren.

`umsetzung.md` aktualisieren:

- Payment-Status eintragen.
- Conversion- und Kostenannahmen dokumentieren.
- Offene Steuer-/Rechnungsfragen erfassen.

---

## Stufe 8: Recht, Datenschutz und Compliance vor Beta

### Ziel

Der MVP ist vor externer Nutzung rechtlich und datenschutzseitig auf ein vertretbares Minimum gebracht.

### Aufgaben

- Impressum erstellen.
- Datenschutzerklaerung erstellen oder juristisch erstellen lassen.
- AGB/Nutzungsbedingungen erstellen.
- KI-Transparenzhinweis finalisieren.
- Disclaimer im Produktfluss pruefen.
- Consent-Flows fuer Tracking und sensible Inhalte pruefen.
- AVVs mit Dienstleistern pruefen:
  - Hosting
  - Datenbank
  - KI-Provider
  - Analytics
  - Payment
  - E-Mail
- Datenloeschung testen.
- Auskunftsprozess definieren.
- Altersgrenze und Minderjaehrigennutzung final entscheiden.
- Datenschutz-Folgenabschaetzung pruefen.
- Safety-Claims und Marketingtexte gegenpruefen.

### Deliverables

- Impressum
- Datenschutzerklaerung
- AGB/Nutzungsbedingungen
- Consent-Flows
- KI-Hinweis
- AVV-Liste
- Datenschutz-Checkliste
- Launch-Blocker-Liste

### Abschlusscheck

- Kein externer Beta-Nutzer kann starten, ohne KI-Charakter und Produktgrenzen erkennen zu koennen.
- Datenschutztexte decken tatsaechliche Datenfluesse ab.
- Tracking ohne Consent ist auf technisch notwendige Zwecke begrenzt.
- Loesch- und Auskunftsprozess sind operativ moeglich.
- Hochrisiko-Fragen werden nicht als normale Readings verarbeitet.
- Marketingtexte enthalten keine Therapie-, Heil- oder Erfolgsversprechen.
- Offene Rechtsrisiken sind dokumentiert und bewusst akzeptiert oder blockieren den Launch.

### Dokumentations-Update

`recherche.md` aktualisieren:

- Rechtlichen Rahmen mit finalen Annahmen und Grenzen aktualisieren.
- Pflicht- und Empfehlungsinhalte auf realen Stand bringen.

`umsetzung.md` aktualisieren:

- Compliance-Status dokumentieren.
- Launch-Blocker und akzeptierte Restrisiken eintragen.

---

## Stufe 9: Observability, Testing und Qualitaetssicherung

### Ziel

Der MVP ist messbar, testbar und robust genug fuer eine geschlossene Beta.

### Aufgaben

- Fehlertracking integrieren.
- Strukturierte Logs fuer kritische Events einbauen.
- KI-Kostenmessung aktivieren.
- Safety-Events messbar machen.
- Analytics fuer Funnel einrichten.
- Testplan erstellen:
  - Unit Tests
  - API Tests
  - Integrationstests
  - manuelle End-to-End-Tests
  - Safety-Testfaelle
  - Mobile-Tests
- Performance-Baseline messen.
- Rate-Limit-Tests durchfuehren.
- Backup- oder Exportstrategie fuer Datenbank pruefen.
- Fallback-Texte fuer KI-/Astrologie-Ausfaelle pruefen.
- Security-Basischeck durchfuehren.

### Deliverables

- Testplan
- Monitoring-Dashboard oder definierte Metriken
- Fehlertracking
- Analytics-Funnel
- Performance-Baseline
- Beta-Freigabeprotokoll

### Abschlusscheck

- Kritische Fehler werden sichtbar geloggt.
- Kosten pro Reading sind nachvollziehbar.
- Der Kernflow wurde manuell auf Desktop und Mobile getestet.
- Safety-Testset besteht die definierten Grenzfaelle.
- Rate Limits greifen unter Wiederholungsrequests.
- Fallbacks funktionieren bei KI- oder Astrologie-Ausfall.
- Es gibt eine klare Liste bekannter Beta-Einschraenkungen.

### Dokumentations-Update

`recherche.md` aktualisieren:

- Erfolgsmetriken an tatsaechliches Tracking anpassen.
- Risiken und Gegenmassnahmen aktualisieren.

`umsetzung.md` aktualisieren:

- Teststatus eintragen.
- Bekannte Bugs und Beta-Einschraenkungen dokumentieren.
- Monitoring- und Kostenmetriken eintragen.

---

## Stufe 10: Geschlossene Beta

### Ziel

Der MVP wird mit einer kleinen, kontrollierten Nutzergruppe validiert, bevor oeffentlich skaliert wird.

### Aufgaben

- Beta-Zielgruppe definieren.
- 30-100 Beta-Nutzer einladen.
- Feedbackkanal einrichten.
- Onboarding-Fragen beobachten.
- Reading-Qualitaet manuell stichprobenartig pruefen.
- Safety-Events pruefen.
- Conversion und Retention messen.
- Zahlungsbereitschaft testen.
- Prompt- und UX-Probleme priorisieren.
- Kritische Bugs beheben.
- Launch-Kriterien aktualisieren.

### Deliverables

- Beta-Report
- Nutzerfeedback-Sammlung
- Funnel-Auswertung
- Reading-Qualitaetsauswertung
- Safety-Auswertung
- priorisierte Bug-/Verbesserungsliste
- Go/No-Go-Empfehlung fuer oeffentlichen Launch

### Abschlusscheck

- Mindestens 30 echte Nutzer haben den Kernflow getestet oder ein kleineres Sample wurde bewusst akzeptiert.
- Die Mehrheit der Nutzer versteht Zweck und Grenzen des Produkts.
- Reading-Feedback erreicht den definierten Mindestscore.
- Keine unbehandelten kritischen Safety- oder Datenschutzprobleme sind offen.
- Kosten pro Reading sind tragbar.
- Die wichtigsten Onboarding-Abbrueche sind bekannt.
- Es gibt eine klare Entscheidung: Launch, weitere Beta-Runde oder Pivot.

### Dokumentations-Update

`recherche.md` aktualisieren:

- Zielgruppe, Positionierung und Monetarisierung anhand Beta-Erkenntnissen anpassen.
- Nach-MVP-Roadmap priorisieren.

`umsetzung.md` aktualisieren:

- Beta-Ergebnisse dokumentieren.
- Go/No-Go-Entscheidung eintragen.
- Launch-Kriterien aktualisieren.

---

## Stufe 11: Oeffentlicher MVP-Launch

### Ziel

ESO geht kontrolliert oeffentlich live und wird anhand realer Nutzung weiterentwickelt.

### Aufgaben

- Launch-Checkliste final abarbeiten.
- Produktionsumgebung absichern.
- Domains, E-Mail und Zahlungsfluesse final testen.
- Analytics und Monitoring live pruefen.
- Content- und Community-Kanaele vorbereiten.
- Launch-Kommunikation erstellen.
- Erste Traffic-Quellen aktivieren:
  - TikTok/Instagram
  - Reddit/Communitys
  - SEO-Landingpages
  - Newsletter
  - Creator-Kooperationen
- Supportprozess definieren.
- Taegliches Monitoring in Launch-Woche durchfuehren.
- Kritische Metriken taeglich pruefen.

### Deliverables

- oeffentlich erreichbarer MVP
- Launch-Checkliste abgeschlossen
- Monitoring aktiv
- Supportprozess aktiv
- Launch-Report nach erster Woche

### Abschlusscheck

- Der Kernflow funktioniert in Produktion.
- Keine kritischen Fehler in Auth, Zahlung, Datenschutz oder Safety sind offen.
- Kosten, Fehler und Safety-Events werden ueberwacht.
- Nutzer koennen Support oder Loeschanfragen stellen.
- Zahlungsfluss funktioniert oder Smoke-Test-Daten werden korrekt erfasst.
- Die Launch-Woche hat eine klare Auswertung mit naechsten Prioritaeten.

### Dokumentations-Update

`recherche.md` aktualisieren:

- Annahmen durch Launch-Daten ersetzen.
- Roadmap nach realer Nutzung neu priorisieren.

`umsetzung.md` aktualisieren:

- Launch-Ergebnisse eintragen.
- Top-Probleme und naechste Stufen dokumentieren.
- Wachstums- und Produktprioritaeten aktualisieren.

---

## Stufe 12: Nach-MVP-Ausbau

### Ziel

Nach validiertem MVP werden nur die Features ausgebaut, die Retention, Umsatz oder Qualitaet messbar verbessern.

### Moegliche Ausbaustufen

| Ausbau | Voraussetzung | Nutzen |
|--------|---------------|--------|
| Monats- und Wochenreadings | Wiederkehrende Nutzung sichtbar | Retention |
| Reversed Cards | Nutzer verstehen Grundsystem | Mehr Tiefe |
| Synastrie | Beziehungsthemen dominieren Nutzung | Premium-Feature |
| PDF-/Web-Reports | Zahlungsbereitschaft fuer Einmalkauf sichtbar | Umsatz |
| RAG fuer Symbolwissen | Reading-Qualitaet braucht mehr Tiefe | Qualitaet |
| i18n Englisch | DACH-MVP validiert | Marktgroesse |
| 3D-Karten-Engine | UX ist validiert, Performance stabil | Differenzierung |
| Native App/PWA | Mobile Retention rechtfertigt Aufwand | Habit-Building |

### Abschlusscheck je Ausbau

- Das Feature hat eine klare Zielmetrik.
- Das Feature loest ein beobachtetes Problem oder nutzt eine beobachtete Chance.
- Datenschutz-, Safety- und Kostenfolgen sind bewertet.
- Das Feature fuehrt nicht zu unkontrolliertem Scope-Wachstum.
- Erfolg oder Misserfolg kann innerhalb eines definierten Zeitraums gemessen werden.

### Dokumentations-Update

`recherche.md` aktualisieren:

- Roadmap und Produktstrategie nach Datenlage anpassen.

`umsetzung.md` aktualisieren:

- Ausbauentscheidung dokumentieren.
- Zielmetrik, Aufwand und Ergebnis eintragen.

---

## Laufende Abschlusschecks

Diese Checks gelten am Ende jeder Stufe zusaetzlich zum jeweiligen Phasencheck.

### Produktcheck

- Ist der MVP-Scope noch schmal genug?
- Wurde ein neues Feature bewusst priorisiert oder ist es Feature-Creep?
- Ist der Nutzerwert klarer geworden?
- Gibt es eine messbare Annahme?

### Technikcheck

- Ist die Architektur weiterhin einfach genug?
- Gibt es neue externe Abhaengigkeiten?
- Sind Fehlerfaelle sichtbar und behandelbar?
- Sind Kosten und Latenz akzeptabel?

### KI-Check

- Bleibt die KI auf strukturierte Daten beschraenkt?
- Gibt es neue Halluzinationsrisiken?
- Sind Prompt-Versionen nachvollziehbar?
- Sind sensible Themen korrekt begrenzt?

### Safety-Check

- Werden akute Krisen erkannt und umgeleitet?
- Gibt es ungewollte medizinische, rechtliche, finanzielle oder therapeutische Aussagen?
- Sind Blockregeln zu streng oder zu lax?
- Werden Safety-Events datensparsam dokumentiert?

### Datenschutzcheck

- Werden nur notwendige Daten erhoben?
- Sind Consent und Datenschutzerklaerung aktuell?
- Gibt es neue Drittanbieter?
- Funktionieren Loeschung und Auskunft praktisch?

### Businesscheck

- Sind die Kosten pro Reading bekannt?
- Sind Free-Limits sinnvoll?
- Gibt es einen klaren Upgrade-Moment?
- Werden Conversion und Retention gemessen?

---

## Dokumentationsroutine

Nach jeder abgeschlossenen Stufe muessen mindestens diese Bereiche geprueft werden:

| Dokumentbereich | Wann aktualisieren |
|-----------------|--------------------|
| Konzept in `recherche.md` | Wenn Positionierung, Scope, Architektur oder Rechtannahmen geaendert wurden |
| Umsetzungsstand in `umsetzung.md` | Nach jeder Stufe |
| Entscheidungslog | Bei jeder Architektur-, Produkt-, Rechts- oder Monetarisierungsentscheidung |
| Risiko-Log | Bei neuen Risiken, akzeptierten Risiken oder geloesten Risiken |
| Prompt-/Safety-Versionen | Bei jeder Aenderung am KI- oder Safety-Verhalten |
| Datenmodell | Bei Schemaaenderungen |
| Metriken | Bei neuen Trackingpunkten oder geaenderten Erfolgskriterien |

---

## Entscheidungslog

| Datum | Stufe | Entscheidung | Begruendung | Auswirkung |
|-------|-------|--------------|-------------|------------|
| 2026-05-07 | Planung | `umsetzung.md` als stufenweiser Projektplan angelegt | Umsetzung soll pruefbar, dokumentiert und phasenweise erfolgen | Jede Stufe hat Abschlusscheck und Doku-Update |
| 2026-05-07 | 0+1 | Tech-Stack: Next.js 16.2.5, React 19.2.4, TypeScript 6.0.3, Node.js 24 LTS, Python 3.14.4 | Agent.md Versionspflicht, aktuellste stabile Versionen |
| 2026-05-07 | 0+1 | Astrologie via swisseph-wasm (WASM) statt pyswisseph | pyswisseph braucht C++ Build-Tools auf Windows; WASM laeuft nativ |
| 2026-05-07 | 0+1 | KI-Provider: OpenRouter (Modell: gemini-2.0-flash-001) | User-Vorgabe, guenstig und schnell fuer PoC |
| 2026-05-07 | 0+1 | Design-System grundlegend integriert | Design+Technik zusammen validieren, CSS-Variablen aus design.md |
| 2026-05-07 | 2 | ORM: Prisma 7 mit SQLite (Dev) | Schnellstes Setup fuer lokalen MVP, PostgreSQL-Pfad bereit |
| 2026-05-07 | 2 | 78 Tarotkarten mit Golden-Dawn-Zuordnungen geseedet | Vollstaendige Rider-Waite Stammdaten inkl. Elemente, Planeten, Tierkreis |

---

## Risiko-Log

| Risiko | Status | Schwere | Gegenmassnahme | Naechste Pruefung |
|--------|--------|---------|----------------|-------------------|
| Astrologie-Service auf Zieldeployment instabil | gemindert | mittel | swisseph-wasm funktioniert; Fallback-Berechnung vorhanden | Stufe 3 |
| Rechtliche Ueberdehnung durch psychologische Claims | offen | hoch | Vorsichtige Produktpositionierung und Compliance-Check | Stufe 8 |
| KI-Halluzinationen bei Chartdaten | offen | hoch | Strukturierter Context und Output-Checks | Stufe 4 |
| KI-Kosten steigen schneller als Monetarisierung | offen | mittel | Tokenbudgets, Rate Limits, Pricing-Test | Stufe 7 |
| Nutzer missverstehen Reading als Entscheidungsvorgabe | offen | hoch | Nicht-direktive Sprache, Disclaimer, Safety-Regeln | Stufe 4 und 8 |
| Datenschutzrisiko durch sensible Nutzerfragen | offen | hoch | Datenminimierung, Consent, Loeschkonzept, Safety-Logging | Stufe 8 |
| pyswisseph auf Windows ohne C++ Build-Tools | geloest | -- | swisseph-wasm als WASM-Alternative | -- |
| Prisma 7 DB-Pfad-Diskrepanz | geloest | -- | Pfad auf file:./dev.db korrigiert | -- |

---

## Statusuebersicht

| Stufe | Name | Status |
|-------|------|--------|
| 0 | Projektgrundlage und Entscheidungen | abgeschlossen |
| 1 | Technischer Proof of Concept | abgeschlossen |
| 2 | Datenmodell und Backend-Fundament | abgeschlossen |
| 3 | Astrologie-Service produktionsnah machen | offen |
| 4 | KI-, Prompt- und Safety-System | offen |
| 5 | Frontend-MVP und Nutzerfluss | offen |
| 6 | Auth, Speicherung und Nutzungslimits | offen |
| 7 | Monetarisierung und Zahlungsfluss | offen |
| 8 | Recht, Datenschutz und Compliance vor Beta | offen |
| 9 | Observability, Testing und Qualitaetssicherung | offen |
| 10 | Geschlossene Beta | offen |
| 11 | Oeffentlicher MVP-Launch | offen |
| 12 | Nach-MVP-Ausbau | offen |
