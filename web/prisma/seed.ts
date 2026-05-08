import { Pool } from "pg";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../src/generated/prisma/client";

const connectionString = process.env.POSTGRES_PRISMA_URL || process.env.DATABASE_URL || "postgresql://dummy:dummy@localhost:5432/dummy";
const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

// ---------------------------------------------------------------------------
// Minor Arcana helpers
// ---------------------------------------------------------------------------

type SuitKey = "stäbe" | "kelche" | "schwerter" | "münzen";

const SUIT_ELEMENT: Record<SuitKey, string> = {
  stäbe: "feuer",
  kelche: "wasser",
  schwerter: "luft",
  münzen: "erde",
};

const MINOR_RANKS = [
  { number: 1, name: "Ass" },
  { number: 2, name: "Zwei" },
  { number: 3, name: "Drei" },
  { number: 4, name: "Vier" },
  { number: 5, name: "Fünf" },
  { number: 6, name: "Sechs" },
  { number: 7, name: "Sieben" },
  { number: 8, name: "Acht" },
  { number: 9, name: "Neun" },
  { number: 10, name: "Zehn" },
  { number: 11, name: "Bube" },
  { number: 12, name: "Ritter" },
  { number: 13, name: "Königin" },
  { number: 14, name: "König" },
] as const;

// Golden Dawn zodiac correspondences for numbered minor arcana (2-10)
const SUIT_ZODIAC_MAP: Record<SuitKey, Record<number, { zodiacSign: string; goldenDawnKey: string; planet: string }>> = {
  stäbe: {
    2:  { zodiacSign: "Widder",     goldenDawnKey: "Mars in Aries",           planet: "Mars" },
    3:  { zodiacSign: "Widder",     goldenDawnKey: "Sun in Aries",            planet: "Sonne" },
    4:  { zodiacSign: "Widder",     goldenDawnKey: "Venus in Aries",          planet: "Venus" },
    5:  { zodiacSign: "Löwe",       goldenDawnKey: "Saturn in Leo",           planet: "Saturn" },
    6:  { zodiacSign: "Löwe",       goldenDawnKey: "Jupiter in Leo",          planet: "Jupiter" },
    7:  { zodiacSign: "Löwe",       goldenDawnKey: "Mars in Leo",             planet: "Mars" },
    8:  { zodiacSign: "Schütze",    goldenDawnKey: "Mercury in Sagittarius",  planet: "Merkur" },
    9:  { zodiacSign: "Schütze",    goldenDawnKey: "Moon in Sagittarius",     planet: "Mond" },
    10: { zodiacSign: "Schütze",    goldenDawnKey: "Saturn in Sagittarius",   planet: "Saturn" },
  },
  kelche: {
    2:  { zodiacSign: "Krebs",      goldenDawnKey: "Venus in Cancer",         planet: "Venus" },
    3:  { zodiacSign: "Krebs",      goldenDawnKey: "Mercury in Cancer",       planet: "Merkur" },
    4:  { zodiacSign: "Krebs",      goldenDawnKey: "Moon in Cancer",          planet: "Mond" },
    5:  { zodiacSign: "Skorpion",   goldenDawnKey: "Mars in Scorpio",         planet: "Mars" },
    6:  { zodiacSign: "Skorpion",   goldenDawnKey: "Sun in Scorpio",          planet: "Sonne" },
    7:  { zodiacSign: "Skorpion",   goldenDawnKey: "Venus in Scorpio",        planet: "Venus" },
    8:  { zodiacSign: "Fische",     goldenDawnKey: "Saturn in Pisces",        planet: "Saturn" },
    9:  { zodiacSign: "Fische",     goldenDawnKey: "Jupiter in Pisces",       planet: "Jupiter" },
    10: { zodiacSign: "Fische",     goldenDawnKey: "Mars in Pisces",          planet: "Mars" },
  },
  schwerter: {
    2:  { zodiacSign: "Waage",      goldenDawnKey: "Moon in Libra",           planet: "Mond" },
    3:  { zodiacSign: "Waage",      goldenDawnKey: "Saturn in Libra",         planet: "Saturn" },
    4:  { zodiacSign: "Waage",      goldenDawnKey: "Jupiter in Libra",        planet: "Jupiter" },
    5:  { zodiacSign: "Wassermann", goldenDawnKey: "Venus in Aquarius",       planet: "Venus" },
    6:  { zodiacSign: "Wassermann", goldenDawnKey: "Mercury in Aquarius",     planet: "Merkur" },
    7:  { zodiacSign: "Wassermann", goldenDawnKey: "Moon in Aquarius",        planet: "Mond" },
    8:  { zodiacSign: "Zwillinge",  goldenDawnKey: "Jupiter in Gemini",       planet: "Jupiter" },
    9:  { zodiacSign: "Zwillinge",  goldenDawnKey: "Mars in Gemini",          planet: "Mars" },
    10: { zodiacSign: "Zwillinge",  goldenDawnKey: "Sun in Gemini",           planet: "Sonne" },
  },
  münzen: {
    2:  { zodiacSign: "Stier",      goldenDawnKey: "Jupiter in Taurus",       planet: "Jupiter" },
    3:  { zodiacSign: "Stier",      goldenDawnKey: "Saturn in Taurus",        planet: "Saturn" },
    4:  { zodiacSign: "Stier",      goldenDawnKey: "Sun in Taurus",           planet: "Sonne" },
    5:  { zodiacSign: "Jungfrau",   goldenDawnKey: "Mercury in Virgo",        planet: "Merkur" },
    6:  { zodiacSign: "Jungfrau",   goldenDawnKey: "Moon in Virgo",           planet: "Mond" },
    7:  { zodiacSign: "Jungfrau",   goldenDawnKey: "Saturn in Virgo",         planet: "Saturn" },
    8:  { zodiacSign: "Steinbock",  goldenDawnKey: "Sun in Capricorn",        planet: "Sonne" },
    9:  { zodiacSign: "Steinbock",  goldenDawnKey: "Venus in Capricorn",      planet: "Venus" },
    10: { zodiacSign: "Steinbock",  goldenDawnKey: "Mercury in Capricorn",    planet: "Merkur" },
  },
};

// Court card Golden Dawn correspondences
const COURT_GD: Record<SuitKey, Record<string, { zodiacSign: string; goldenDawnKey: string }>> = {
  stäbe: {
    Bube:    { zodiacSign: "Widder",   goldenDawnKey: "Fire of Fire" },
    Ritter:  { zodiacSign: "Löwe",     goldenDawnKey: "Fire of Fire" },
    Königin: { zodiacSign: "Schütze",  goldenDawnKey: "Fire of Water" },
    König:   { zodiacSign: "Widder",   goldenDawnKey: "Fire of Earth" },
  },
  kelche: {
    Bube:    { zodiacSign: "Krebs",    goldenDawnKey: "Water of Water" },
    Ritter:  { zodiacSign: "Skorpion", goldenDawnKey: "Water of Water" },
    Königin: { zodiacSign: "Fische",   goldenDawnKey: "Water of Fire" },
    König:   { zodiacSign: "Krebs",    goldenDawnKey: "Water of Air" },
  },
  schwerter: {
    Bube:    { zodiacSign: "Waage",      goldenDawnKey: "Air of Air" },
    Ritter:  { zodiacSign: "Wassermann", goldenDawnKey: "Air of Air" },
    Königin: { zodiacSign: "Zwillinge",  goldenDawnKey: "Air of Fire" },
    König:   { zodiacSign: "Waage",      goldenDawnKey: "Air of Water" },
  },
  münzen: {
    Bube:    { zodiacSign: "Stier",     goldenDawnKey: "Earth of Earth" },
    Ritter:  { zodiacSign: "Steinbock", goldenDawnKey: "Earth of Earth" },
    Königin: { zodiacSign: "Jungfrau",  goldenDawnKey: "Earth of Fire" },
    König:   { zodiacSign: "Stier",     goldenDawnKey: "Earth of Air" },
  },
};

// ---------------------------------------------------------------------------
// Keywords (German)
// ---------------------------------------------------------------------------

const MAJOR_KEYWORDS: Record<string, { upright: string[]; reversed: string[] }> = {
  "Der Narr":           { upright: ["Neuanfang", "Spontaneität", "Unschuld", "Abenteuer", "Freiheit"],                        reversed: ["Leichtsinn", "Naivität", "Risiko", "Chaos", "Unüberlegtheit"] },
  "Der Magier":         { upright: ["Willenskraft", "Schöpfung", "Talent", "Konzentration", "Manifestation"],                 reversed: ["Manipulation", "Täuschung", "Unfähigkeit", "Missbrauch von Macht"] },
  "Die Hohepriesterin": { upright: ["Intuition", "Mysterium", "Weisheit", "Innere Stimme", "Unbewusstes"],                   reversed: ["Geheimnisse", "Oberflächlichkeit", "Verleugnung der Intuition", "Rückzug"] },
  "Die Herrscherin":    { upright: ["Fülle", "Fruchtbarkeit", "Natur", "Kreativität", "Fürsorge"],                           reversed: ["Abhängigkeit", "Erdrosselnde Fürsorge", "Kreativitätsblockade", "Unsicherheit"] },
  "Der Herrscher":      { upright: ["Autorität", "Führung", "Struktur", "Stabilität", "Kontrolle"],                          reversed: ["Tyrannei", "Starrheit", "Dominanz", "Kontrollverlust"] },
  "Der Hierophant":     { upright: ["Tradition", "Lehre", "Konformität", "Spiritualität", "Mentorschaft"],                   reversed: ["Rebellion", "Dogmatismus", "Unkonventionalität", "Infragestellung"] },
  "Die Liebenden":      { upright: ["Liebe", "Harmonie", "Partnerschaft", "Entscheidung", "Verbindung"],                     reversed: ["Disharmonie", "Ungleichgewicht", "Konflikt", "Trennung"] },
  "Der Wagen":          { upright: ["Triumph", "Entschlossenheit", "Siegeswille", "Kontrolle", "Vorwärtsdrang"],             reversed: ["Aggressivität", "Richtunglosigkeit", "Mangelnde Kontrolle", "Stillstand"] },
  "Die Kraft":          { upright: ["Innere Stärke", "Mut", "Geduld", "Sanftmut", "Selbstbeherrschung"],                     reversed: ["Selbstzweifel", "Schwäche", "Unsicherheit", "Mangelnde Kontrolle"] },
  "Der Eremit":         { upright: ["Innere Suche", "Rückzug", "Weisheit", "Selbstreflexion", "Einsamkeit"],                 reversed: ["Isolation", "Weltflucht", "Sturheit", "Misstrauen"] },
  "Das Glücksrad":      { upright: ["Schicksal", "Wendepunkt", "Glück", "Zyklen", "Chance"],                                 reversed: ["Pech", "Widerstand gegen Wandel", "Karma", "Rückschritt"] },
  "Gerechtigkeit":      { upright: ["Gerechtigkeit", "Wahrheit", "Ausgleich", "Klarheit", "Verantwortung"],                  reversed: ["Ungerechtigkeit", "Unehrlichkeit", "Mangelnde Verantwortung", "Voreingenommenheit"] },
  "Der Gehängte":       { upright: ["Loslassen", "Opfer", "neue Perspektive", "Pause", "Erkenntnis"],                        reversed: ["Verzögerung", "Sturheit", "Sinnlosigkeit", "Stillstand"] },
  "Der Tod":            { upright: ["Transformation", "Ende", "Wandel", "Neubeginn", "Abschied"],                            reversed: ["Widerstand gegen Wandel", "Angst", "Stagnation", "Festhalten"] },
  "Mässigkeit":         { upright: ["Ausgleich", "Harmonie", "Geduld", "Moderation", "Heilung"],                             reversed: ["Ungleichgewicht", "Überschreitung", "Ungeduld", "Extremismus"] },
  "Der Teufel":         { upright: ["Abhängigkeit", "Versuchung", "Schatten", "Bindung", "Materialismus"],                   reversed: ["Befreiung", "Loslösen", "Erwachen", "Durchbruch"] },
  "Der Turm":           { upright: ["Zerstörung", "plötzlicher Wandel", "Erkenntnis", "Umsturz", "Katharsis"],               reversed: ["Vermeidung", "Furcht vor Wandel", "Verzögerter Wandel", "Teilweiser Zusammenbruch"] },
  "Der Stern":          { upright: ["Hoffnung", "Inspiration", "Heilung", "Erneuerung", "Spiritualität"],                    reversed: ["Hoffnungslosigkeit", "Entmutigung", "Trennung", "Mangel an Glauben"] },
  "Der Mond":           { upright: ["Illusion", "Intuition", "Unbewusstes", "Träume", "Unsicherheit"],                       reversed: ["Verwirrung aufgelöst", "Täuschung erkannt", "Angst loslassen", "Klarheit"] },
  "Die Sonne":          { upright: ["Freude", "Erfolg", "Vitalität", "Optimismus", "Klarheit"],                              reversed: ["Vorübergehende Traurigkeit", "Verzögerter Erfolg", "Selbstzweifel", "Pessimismus"] },
  "Das Gericht":        { upright: ["Erwachen", "Ruf", "Erneuerung", "Absolution", "Reflexion"],                            reversed: ["Selbstzweifel", "Verpasste Chance", "Reflexionsverweigerung", "Schuldgefühle"] },
  "Die Welt":           { upright: ["Vollendung", "Integration", "Erfüllung", "Reiseende", "Ganzheit"],                     reversed: ["Unvollständigkeit", "Verzögerung", "Fehlender Abschluss", "Offene Enden"] },
};

const MINOR_KEYWORDS: Record<string, Record<number, { upright: string[]; reversed: string[] }>> = {
  stäbe: {
    1:  { upright: ["Inspiration", "Schöpfung", "Funke", "Leidenschaft"],                                reversed: ["Mangelnde Inspiration", "Verzögerung", "Kreativitätsblockade"] },
    2:  { upright: ["Planung", "Entscheidung", "Zukunftsorientierung"],                                  reversed: ["Unentschlossenheit", "Angst vor dem Unbekannten"] },
    3:  { upright: ["Fortschritt", "Expansion", "Unternehmergeist"],                                     reversed: ["Hindernisse", "Verzögerung", "Frustration"] },
    4:  { upright: ["Stabilität", "Feier", "Sicherheit", "Zuhause"],                                    reversed: ["Unsicherheit", "Verlust von Stabilität", "Gier"] },
    5:  { upright: ["Konflikt", "Wettbewerb", "Herausforderung", "Kampf"],                               reversed: ["Kompromiss", "Versöhnung", "Überwindung"] },
    6:  { upright: ["Anerkennung", "Ruhm", "Sieg", "Triumph"],                                          reversed: ["Mangelnde Anerkennung", "Egoismus", "Fallende Gunst"] },
    7:  { upright: ["Verteidigung", "Standhaftigkeit", "Überzeugung"],                                   reversed: ["Rückzug", "Verlust von Überzeugung", "Übereifer"] },
    8:  { upright: ["Geschwindigkeit", "Bewegung", "Schnelligkeit", "Veränderung"],                      reversed: ["Verzögerung", "Frustration", "Stillstand"] },
    9:  { upright: ["Widerstandskraft", "Ausdauer", "Verteidigung"],                                     reversed: ["Erschöpfung", "Überforderung", "Müdigkeit"] },
    10: { upright: ["Last", "Verantwortung", "Bürde", "Übernahme"],                                      reversed: ["Erleichterung", "Abgabe von Verantwortung", "Befreiung"] },
    11: { upright: ["Enthusiasmus", "Neugier", "Entdeckung", "Nachrichten"],                             reversed: ["Zögern", "Nachrichten verzögert", "Mangelnde Motivation"] },
    12: { upright: ["Eile", "Reise", "Aktion", "Dynamik"],                                              reversed: ["Verzögerung", "Reiseabbruch", "Impulsivität"] },
    13: { upright: ["Charisma", "Wärme", "Bestimmtheit", "Anziehung"],                                  reversed: ["Eifersucht", "Manipulation", "Boshaftigkeit"] },
    14: { upright: ["Führung", "Vision", "Unternehmergeist", "Ehre"],                                   reversed: ["Impulsivität", "Dogmatismus", "Übereifer"] },
  },
  kelche: {
    1:  { upright: ["Liebe", "Gefühlserneuerung", "Mitgefühl", "Innerer Reichtum"],                      reversed: ["Emotionale Blockade", "Zurückhaltung", "Leere"] },
    2:  { upright: ["Partnerschaft", "Verbindung", "Anziehung", "Harmonie"],                             reversed: ["Trennung", "Disharmonie", "Missverständnis"] },
    3:  { upright: ["Feier", "Freundschaft", "Geselligkeit", "Gemeinschaft"],                            reversed: ["Isolation", "Überfluss", "Exzess"] },
    4:  { upright: ["Apathie", "Langeweile", "Unzufriedenheit", "Meditation"],                           reversed: ["Erwachen", "Neugier", "Neues Angebot"] },
    5:  { upright: ["Verlust", "Trauer", "Bedauern", "Enttäuschung"],                                    reversed: ["Akzeptanz", "Versöhnung", "Trost finden"] },
    6:  { upright: ["Nostalgie", "Erinnerung", "Kindheit", "Harmonie"],                                  reversed: ["Loslassen", "Vergangenheit klären", "Festhalten"] },
    7:  { upright: ["Illusion", "Wunschdenken", "Verwirrung", "Vielfalt"],                               reversed: ["Klarheit", "Entscheidung", "Bodenhaftung"] },
    8:  { upright: ["Abschied", "Rückzug", "Loslassen", "Weiterentwicklung"],                            reversed: ["Stagnation", "Festhalten", "Vermeidung"] },
    9:  { upright: ["Erfüllung", "Wunsch erfüllt", "Zufriedenheit", "Genuss"],                           reversed: ["Gier", "Unzufriedenheit", "Mangelnde Wertschätzung"] },
    10: { upright: ["Familienglück", "Harmonie", "Heimat", "Stabilität"],                                reversed: ["Familienkonflikt", "Entfremdung", "Unstimmigkeiten"] },
    11: { upright: ["Kreativität", "Intuition", "Sensibilität", "Romantik"],                             reversed: ["Emotionale Unreife", "Unaufrichtigkeit", "Täuschung"] },
    12: { upright: ["Einladung", "Angebot", "Romantik", "Neues Abenteuer"],                              reversed: ["Zurückweisung", "Unrealistische Erwartungen", "Enttäuschung"] },
    13: { upright: ["Fürsorglichkeit", "Empathie", "Intuition", "Schönheit"],                            reversed: ["Co-Abhängigkeit", "Unsicherheit", "Martyrium"] },
    14: { upright: ["Emotionale Reife", "Weisheit", "Diplomatie", "Güte"],                               reversed: ["Emotionale Manipulation", "Launenhaftigkeit", "Unberechenbarkeit"] },
  },
  schwerter: {
    1:  { upright: ["Klarheit", "Durchbruch", "Wahrheit", "Neue Idee"],                                  reversed: ["Verwirrung", "Chaos", "Mangelnde Klarheit"] },
    2:  { upright: ["Gleichgewicht", "Unentschiedenheit", "Waffenstillstand", "Zweifel"],                 reversed: ["Unentschlossenheit", "Indention", "Falscher Kompromiss"] },
    3:  { upright: ["Herzschmerz", "Kummer", "Trauer", "Schmerz"],                                      reversed: ["Heilung", "Erholung", "Schmerz akzeptieren"] },
    4:  { upright: ["Ruhe", "Erholung", "Meditation", "Rückzug"],                                        reversed: ["Rastlosigkeit", "Erschöpfung", "Burnout"] },
    5:  { upright: ["Konflikt", "Niederlage", "Demütigung", "Spannung"],                                reversed: ["Versöhnung", "Wiedergutmachung", "Lernen aus Fehlern"] },
    6:  { upright: ["Übergang", "Veränderung", "Reise", "Bewegung"],                                    reversed: ["Verzögerung", "Unfreiwilliger Wandel", "Stagnation"] },
    7:  { upright: ["Täuschung", "Strategie", "List", "Hintergedanken"],                                reversed: ["Geständnis", "Aufrichtigkeit", "Neuanfang"] },
    8:  { upright: ["Einschränkung", "Gefangenschaft", "Opferrolle", "Isolation"],                       reversed: ["Selbstbefreiung", "Neue Perspektive", "Veränderung"] },
    9:  { upright: ["Angst", "Albträume", "Sorge", "Qualen"],                                           reversed: ["Erholung", "Angst überwinden", "Hoffnung"] },
    10: { upright: ["Schmerz", "Ende", "Tiefe Krise", "Auflösung"],                                     reversed: ["Wiedergeburt", "Erholung", "Neuanfang"] },
    11: { upright: ["Wachsamkeit", "Intellekt", "Neugier", "Unabhängigkeit"],                            reversed: ["Zynismus", "Verwirrung", "Unfaire Urteile"] },
    12: { upright: ["Direktheit", "Eile", "Tatendrang", "Mut"],                                         reversed: ["Verzögerung", "Rücksichtslosigkeit", "Blindheit"] },
    13: { upright: ["Unabhängigkeit", "Scharfsinn", "Klarheit", "Perzeption"],                           reversed: ["Kaltherzigkeit", "Grausamkeit", "Bitterkeit"] },
    14: { upright: ["Autorität", "Wahrheit", "Klarheit", "Intellektuelle Macht"],                        reversed: ["Tyrannei", "Abruptheit", "Manipulation"] },
  },
  münzen: {
    1:  { upright: ["Neue Chance", "Wohlstand", "Manifestation", "Grundstein"],                          reversed: ["Verpasste Gelegenheit", "Schlechte Planung", "Verlust"] },
    2:  { upright: ["Balance", "Anpassung", "Jonglieren", "Flexibilität"],                               reversed: ["Überforderung", "Unausgewogenheit", "Disorganisation"] },
    3:  { upright: ["Teamarbeit", "Meisterschaft", "Zusammenarbeit", "Qualität"],                        reversed: ["Mangelnde Qualität", "Schlechte Zusammenarbeit", "Unzufriedenheit"] },
    4:  { upright: ["Sicherheit", "Sparsamkeit", "Besitz", "Kontrolle"],                                 reversed: ["Gier", "Materialismus", "Festhalten", "Mangel"] },
    5:  { upright: ["Mangel", "Härte", "Verlust", "Einsamkeit"],                                         reversed: ["Erholung", "Hilfe annehmen", "Spirituelles Wachstum"] },
    6:  { upright: ["Großzügigkeit", "Wohltätigkeit", "Geben und Nehmen"],                               reversed: ["Egoismus", "Schulden", "Einseitige Gebefreudigkeit"] },
    7:  { upright: ["Belohnung", "Geduld", "Investition", "Langfristiges Denken"],                       reversed: ["Ungeduld", "Frustration", "Mangelnder Ertrag"] },
    8:  { upright: ["Handwerk", "Fleiß", "Ausbildung", "Perfektionierung"],                              reversed: ["Perfektionismus", "Mangelnde Motivation", "Unzufriedenheit"] },
    9:  { upright: ["Luxus", "Unabhängigkeit", "Wohlstand", "Ernte"],                                    reversed: ["Finanzielle Verluste", "Überheblichkeit", "Unachtsamkeit"] },
    10: { upright: ["Erbe", "Familienvermögen", "Sicherheit", "Dauerhaftigkeit"],                        reversed: ["Finanzielle Verluste", "Immobilienprobleme", "Unsicherheit"] },
    11: { upright: ["Neugier", "Lernbereitschaft", "Nachrichten", "Möglichkeiten"],                      reversed: ["Ablenkung", "Unzuverlässigkeit", "Prokrastination"] },
    12: { upright: ["Fleiß", "Routine", "Verantwortung", "Zuverlässigkeit"],                             reversed: ["Trägheit", "Sturheit", "Übertriebene Routine"] },
    13: { upright: ["Fürsorglichkeit", "Praktisches Geschick", "Großzügigkeit", "Komfort"],              reversed: ["Arbeitswut", "Misstrauen", "Neid"] },
    14: { upright: ["Wohlstand", "Sicherheit", "Führung", "Verlässlichkeit"],                            reversed: ["Gier", "Korruption", "Mangelnde Verantwortung"] },
  },
};

// ---------------------------------------------------------------------------
// Descriptions (German)
// ---------------------------------------------------------------------------

const MAJOR_DESCRIPTIONS: Record<string, string> = {
  "Der Narr":           "Ein junger Mensch wandert achtlos an den Rand einer Klippe -- Symbol fuer den Sprung ins Unbekannte und den Beginn einer neuen Reise.",
  "Der Magier":         "Der Magier beherrscht die Elemente und kanalisiert seine Willenskraft in die materielle Welt. Er steht fuer bewusste Schoepfung und Tatendrang.",
  "Die Hohepriesterin": "Sie sitzt zwischen den Saeulen des Lichts und der Dunkelheit und huetet das Tor zum Unbewussten. Sie lehrt, auf die innere Stimme zu hoeren.",
  "Die Herrscherin":    "Die Herrscherin verkoerpert fruchtbare Fuelle, kreative Schoepferkraft und die naehrende Kraft der Natur.",
  "Der Herrscher":      "Der Herrscher repraesentiert Ordnung, Struktur und vaeterliche Autoritaet. Er schafft stabile Grundlagen fuer Wachstum.",
  "Der Hierophant":     "Der Hierophant vertritt Tradition, spirituelle Lehre und die Weitergabe von Wissen an die Gemeinschaft.",
  "Die Liebenden":      "Die Liebenden symbolisieren die tiefe Verbindung zwischen zwei Menschen und die bewusste Entscheidung fuer Liebe und Partnerschaft.",
  "Der Wagen":          "Der Wagenlenker zieht triumphierend seine Widersacher unter Kontrolle -- Symbol fuer Willenskraft und zielgerichtete Bewegung.",
  "Die Kraft":          "Eine sanfte Hand zaehmt einen Loewen -- ein Bild fuer innere Staerke, die durch Geduld und Mitgefuehl wirkt, nicht durch rohe Gewalt.",
  "Der Eremit":         "Der Eremit traegt sein Licht in die Dunkelheit der Einsamkeit und sucht die Wahrheit in der Stille der Selbstreflexion.",
  "Das Gluecksrad":     "Das Rad dreht sich unaufhoerlich und erinnert daran, dass Aufstieg und Abstieg zum natuerlichen Zyklus des Lebens gehoeren.",
  "Gerechtigkeit":      "Gerechtigkeit haelt die Waage in der Hand und ruft zur Verantwortung -- jede Handlung bringt eine entsprechende Rueckwirkung.",
  "Der Gehaengte":      "Der Gehaengte betrachtet die Welt aus einer neuen Perspektive und gewinnt durch bewusstes Loslassen tiefere Erkenntnis.",
  "Der Tod":            "Der Tod kuendigt das Ende einer Lebensphase an und macht Platz fuer tiefgreifende Transformation und Neubeginn.",
  "Maessigkeit":        "Maessigkeit giesst Wasser zwischen zwei Kelchen und symbolisiert Harmonie, Balance und den Ausgleich gegensaetzlicher Kraefte.",
  "Der Teufel":         "Der Teufel zeigt die Ketten, die uns an Abhaengigkeiten, Aengste und materielle Begierden binden -- Ketten, die wir selbst ablegen koennen.",
  "Der Turm":           "Der Turm bricht unter einem Blitzschlag zusammen -- ein abruptes Ende, das verborgene Wahrheiten ans Licht zwingt.",
  "Der Stern":          "Nach dem Sturm leuchtet der Stern der Hoffnung und verspricht Erneuerung, Heilung und spirituelle Inspiration.",
  "Der Mond":           "Im Licht des Mondes verschwimmen die Grenzen zwischen Realitaet und Illusion. Er weckt Intuition, aber auch verborgene Aengste.",
  "Die Sonne":          "Die Sonne strahlt reine Freude, Klarheit und Lebensenergie aus. Sie steht fuer Erfolg und ungetruebtes Glueck.",
  "Das Gericht":        "Das Gericht ruft zur Auferstehung und Selbstreflexion -- eine innere Stimme fordert uns auf, Vergangenes zu bewerten und neu zu beginnen.",
  "Die Welt":           "Die Welt vollendet den grossen Zyklus und symbolisiert Integration, Erfuellung und die Einheit allen Seins.",
};

const SUIT_DESCRIPTIONS: Record<SuitKey, Record<number, string>> = {
  stäbe: {
    1:  "Der Ass der Staebe bringt einen Funken reinen Feuers -- eine kraftvolle neue Inspiration oder Schoepfungsidee.",
    2:  "Zwei Staebe deuten auf Zukunftsplanung und die Entweder-Oder-Entscheidung zwischen zwei Wegen hin.",
    3:  "Drei Staebe zeigen expandierende Horizonte -- der Blick richtet sich auf wachsende Moeglichkeiten.",
    4:  "Vier Staebe feiern errungene Stabilitaet, Sicherheit und ein Gefuehl des Ankommens.",
    5:  "Fuenf Staebe stehen fuer Konkurrenzkampf, Meinungsverschiedenheiten und das Ringen um die Vorherrschaft.",
    6:  "Sechs Staebe kroenen den Sieger -- oeffentliche Anerkennung und wohlverdienter Ruhm.",
    7:  "Sieben Staebe fordern zum Kampf um die eigene Position -- Standhaftigkeit gegen Widerstaende.",
    8:  "Acht Staebe bringen rasante Bewegung, ploetzliche Entwicklungen und beschleunigte Ereignisse.",
    9:  "Neun Staebe zeigen einen erschoepften aber standhaften Verteidiger, der die letzte Huerde noch ueberwinden muss.",
    10: "Zehn Staebe laden eine schwere Last auf die Schultern -- Uebernahme von zu vielen Verpflichtungen.",
    11: "Der Bube der Staebe ist ein enthusiastischer Entdecker, voller Neugier und Tatendrang.",
    12: "Der Ritter der Staebe stuermert voran -- schnell, leidenschaftlich und aktionsbereit.",
    13: "Die Koenigin der Staebe strahlt magnetische Anziehungskraft, Waerme und Selbstbewusstsein aus.",
    14: "Der Koenig der Staebe ist ein visionaerer Anfuehrer, der mit Charisma und Ueberzeugungskraft lenkt.",
  },
  kelche: {
    1:  "Der Ass der Kelche oeffnet das Herz fuer ueberfliessende Liebe und tiefe emotionale Erneuerung.",
    2:  "Zwei Kelche verbinden sich zu einer Partnerschaft -- Anziehung, Verstaendnis und tiefe Verbundenheit.",
    3:  "Drei Kelche feiern freudige Gemeinschaft, Freundschaft und geselligen Austausch.",
    4:  "Vier Kelche zeigen Unzufriedenheit und Apathie trotz vorhandener Moeglichkeiten.",
    5:  "Fuenf Kelche betrauern Verlustes und verpasste Chancen, waehrend neue Perspektiven uebersehen werden.",
    6:  "Sechs Kelche wecken nostalgische Erinnerungen und die Sehnsucht nach vergangener Harmonie.",
    7:  "Sieben Kelche praesentieren eine Fuelle verfuehrerischer Illusionen und Wunschvorstellungen.",
    8:  "Acht Kelche markieren den bewussten Abschied von Bekanntem zugunsten inneren Wachstums.",
    9:  "Neun Kelche erfuellen den tiefsten Wunsch und versprechen emotionale und materielle Zufriedenheit.",
    10: "Zehn Kelche strahlen familiaeres Glueck, harmonische Beziehungen und dauerhaften Frieden aus.",
    11: "Der Bube der Kelche ist ein einfuehlsamer Traeumer, voller Phantasie und kreativer Sensibilitaet.",
    12: "Der Ritter der Kelche bringt Einladungen, romantische Angebote und kreative Botschaften.",
    13: "Die Koenigin der Kelche verkoerpert tiefe Empathie, Fuersorglichkeit und emotionale Weisheit.",
    14: "Der Koenig der Kelche ist ein emotional ausgewiesener Diplomat, der mit Gefuehl und Taktgefuehl fuehrt.",
  },
  schwerter: {
    1:  "Der Ass der Schwerter durchtrennt Illusionen mit reiner Klarheit -- eine Durchbruchsidee oder Offenbarung.",
    2:  "Zwei Schwerter in Balance zeigen ein Gleichgewicht zwischen widerstreitenden Kraeften und einstweiligen Stillstand.",
    3:  "Drei Schwerter durchbohren das Herz -- das Bild tiefen Kummers und emotionaler Schmerzen.",
    4:  "Vier Schwerter gewaehren eine Pause -- Ruhe, Rueckzug und Erholung nach dem Kampf.",
    5:  "Fuenf Schwerter zeugen von bitterer Niederlage, Demuetigung und verlustreichen Konflikten.",
    6:  "Sechs Schwerter begleiten eine Reise von der Vergangenheit in eine neue Zukunft -- sanfter Uebergang.",
    7:  "Sieben Schwerter deuten auf Taeuschung, List und das Vorgehen hinter dem Ruecken anderer hin.",
    8:  "Acht Schwerter fangen ein -- das Gefuehl der Einengung und Einschraenkung durch eigene Gedanken.",
    9:  "Neun Schwerter quaelen mit Angsttraeumen, Sorgen und innerer Unruhe.",
    10: "Zehn Schwerter markieren den tiefsten Punkt -- schmerzhaftes Ende mit dem Keim der Erneuerung.",
    11: "Der Bube der Schwerter ist ein wachsamer Denker, scharfsinnig und stets auf der Suche nach Wahrheit.",
    12: "Der Ritter der Schwerter rast voran -- direkt, schnell und kompromisslos in Wort und Tat.",
    13: "Die Koenigin der Schwerter durchschaut jede Taeuschung mit kuehlem Scharfsinn und unhabhaengigem Geist.",
    14: "Der Koenig der Schwerter herrscht mit unbestechlicher Klarheit, intellektueller Macht und Gerechtigkeit.",
  },
  münzen: {
    1:  "Der Ass der Muenzen bietet eine greifbare neue Chance -- der Grundstein fuer Wohlstand und Sicherheit.",
    2:  "Zwei Muenzen jonglieren die Anforderungen des Alltags -- Balance und Anpassungsfaehigkeit sind gefragt.",
    3:  "Drei Muenzen feiern gelungene Zusammenarbeit, Handwerkskunst und gemeinsames Streben nach Qualitaet.",
    4:  "Vier Muenzen klammern sich an Besitz -- Sicherheit kann in Geiz und Kontrolle umschlagen.",
    5:  "Fuenf Muenzen zeigen Mangel, materielle Not und die Erfahrung des Ausgeschlossenseins.",
    6:  "Sechs Muenzen verteilen Wohlstand -- Grosszuegigkeit im Geben und Empfangen entsteht im Gleichgewicht.",
    7:  "Sieben Muenzen betrachten das Wachstum mit Geduld -- die Ernte braucht ihre Zeit.",
    8:  "Acht Muenzen widmen sich mit Hingabe dem Handwerk -- Fliess, Perfektionierung und Meisterschaft.",
    9:  "Neun Muenzen geniessen den selbstgeschaffenen Luxus -- finanzielle Unabhaengigkeit und Wohlstand.",
    10: "Zehn Muenzen repraesentieren das dauerhafte Familienerbe, Wohlstand ueber Generationen und Sicherheit.",
    11: "Der Bube der Muenzen ist ein fliessiger Schueler, der neue praktische Faehigkeiten und Moeglichkeiten erkundet.",
    12: "Der Ritter der Muenzen arbeitet stetig und zuverlaessig an seinen Zielen -- Beharrlichkeit zahlt sich aus.",
    13: "Die Koenigin der Muenzen pflegt ein wohlhabendes und warmes Zuhause -- praktische Fuersorge und Grosszuegigkeit.",
    14: "Der Koenig der Muenzen verkoerpert materielle Sicherheit, unternehmerischen Erfolg und verlaessliche Fuehrung.",
  },
};

// ---------------------------------------------------------------------------
// Build card data
// ---------------------------------------------------------------------------

interface CardData {
  name: string;
  arcana: string;
  number: number | null;
  suit: string | null;
  element: string | null;
  planet: string | null;
  zodiacSign: string | null;
  goldenDawnKey: string | null;
  keywordsUpright: string;
  keywordsReversed: string;
  description: string | null;
}

function buildMajorArcana(): CardData[] {
  return [
    { name: "Der Narr",           arcana: "major", number: 0,  suit: null, element: "luft",  planet: "Uranus",  zodiacSign: null,        goldenDawnKey: "Uranus",    keywordsUpright: JSON.stringify(MAJOR_KEYWORDS["Der Narr"].upright),           keywordsReversed: JSON.stringify(MAJOR_KEYWORDS["Der Narr"].reversed),           description: MAJOR_DESCRIPTIONS["Der Narr"] },
    { name: "Der Magier",         arcana: "major", number: 1,  suit: null, element: null,    planet: "Merkur",  zodiacSign: null,        goldenDawnKey: "Mercury",   keywordsUpright: JSON.stringify(MAJOR_KEYWORDS["Der Magier"].upright),         keywordsReversed: JSON.stringify(MAJOR_KEYWORDS["Der Magier"].reversed),         description: MAJOR_DESCRIPTIONS["Der Magier"] },
    { name: "Die Hohepriesterin", arcana: "major", number: 2,  suit: null, element: null,    planet: "Mond",    zodiacSign: null,        goldenDawnKey: "Moon",      keywordsUpright: JSON.stringify(MAJOR_KEYWORDS["Die Hohepriesterin"].upright), keywordsReversed: JSON.stringify(MAJOR_KEYWORDS["Die Hohepriesterin"].reversed), description: MAJOR_DESCRIPTIONS["Die Hohepriesterin"] },
    { name: "Die Herrscherin",    arcana: "major", number: 3,  suit: null, element: null,    planet: "Venus",   zodiacSign: null,        goldenDawnKey: "Venus",     keywordsUpright: JSON.stringify(MAJOR_KEYWORDS["Die Herrscherin"].upright),    keywordsReversed: JSON.stringify(MAJOR_KEYWORDS["Die Herrscherin"].reversed),    description: MAJOR_DESCRIPTIONS["Die Herrscherin"] },
    { name: "Der Herrscher",      arcana: "major", number: 4,  suit: null, element: null,    planet: "Mars",    zodiacSign: "Widder",    goldenDawnKey: "Mars",      keywordsUpright: JSON.stringify(MAJOR_KEYWORDS["Der Herrscher"].upright),      keywordsReversed: JSON.stringify(MAJOR_KEYWORDS["Der Herrscher"].reversed),      description: MAJOR_DESCRIPTIONS["Der Herrscher"] },
    { name: "Der Hierophant",     arcana: "major", number: 5,  suit: null, element: null,    planet: null,      zodiacSign: "Stier",     goldenDawnKey: "Taurus",    keywordsUpright: JSON.stringify(MAJOR_KEYWORDS["Der Hierophant"].upright),     keywordsReversed: JSON.stringify(MAJOR_KEYWORDS["Der Hierophant"].reversed),     description: MAJOR_DESCRIPTIONS["Der Hierophant"] },
    { name: "Die Liebenden",      arcana: "major", number: 6,  suit: null, element: null,    planet: null,      zodiacSign: "Zwillinge", goldenDawnKey: "Gemini",    keywordsUpright: JSON.stringify(MAJOR_KEYWORDS["Die Liebenden"].upright),      keywordsReversed: JSON.stringify(MAJOR_KEYWORDS["Die Liebenden"].reversed),      description: MAJOR_DESCRIPTIONS["Die Liebenden"] },
    { name: "Der Wagen",          arcana: "major", number: 7,  suit: null, element: null,    planet: null,      zodiacSign: "Krebs",     goldenDawnKey: "Cancer",    keywordsUpright: JSON.stringify(MAJOR_KEYWORDS["Der Wagen"].upright),          keywordsReversed: JSON.stringify(MAJOR_KEYWORDS["Der Wagen"].reversed),          description: MAJOR_DESCRIPTIONS["Der Wagen"] },
    { name: "Die Kraft",          arcana: "major", number: 8,  suit: null, element: null,    planet: null,      zodiacSign: "Löwe",      goldenDawnKey: "Leo",       keywordsUpright: JSON.stringify(MAJOR_KEYWORDS["Die Kraft"].upright),          keywordsReversed: JSON.stringify(MAJOR_KEYWORDS["Die Kraft"].reversed),          description: MAJOR_DESCRIPTIONS["Die Kraft"] },
    { name: "Der Eremit",         arcana: "major", number: 9,  suit: null, element: null,    planet: null,      zodiacSign: "Jungfrau",  goldenDawnKey: "Virgo",     keywordsUpright: JSON.stringify(MAJOR_KEYWORDS["Der Eremit"].upright),         keywordsReversed: JSON.stringify(MAJOR_KEYWORDS["Der Eremit"].reversed),         description: MAJOR_DESCRIPTIONS["Der Eremit"] },
    { name: "Das Glücksrad",      arcana: "major", number: 10, suit: null, element: null,    planet: "Jupiter", zodiacSign: null,        goldenDawnKey: "Jupiter",   keywordsUpright: JSON.stringify(MAJOR_KEYWORDS["Das Glücksrad"].upright),      keywordsReversed: JSON.stringify(MAJOR_KEYWORDS["Das Glücksrad"].reversed),      description: MAJOR_DESCRIPTIONS["Das Glücksrad"] },
    { name: "Gerechtigkeit",      arcana: "major", number: 11, suit: null, element: null,    planet: null,      zodiacSign: "Waage",     goldenDawnKey: "Libra",     keywordsUpright: JSON.stringify(MAJOR_KEYWORDS["Gerechtigkeit"].upright),      keywordsReversed: JSON.stringify(MAJOR_KEYWORDS["Gerechtigkeit"].reversed),      description: MAJOR_DESCRIPTIONS["Gerechtigkeit"] },
    { name: "Der Gehängte",       arcana: "major", number: 12, suit: null, element: "wasser", planet: "Neptun",  zodiacSign: null,        goldenDawnKey: "Neptune",   keywordsUpright: JSON.stringify(MAJOR_KEYWORDS["Der Gehängte"].upright),       keywordsReversed: JSON.stringify(MAJOR_KEYWORDS["Der Gehängte"].reversed),       description: MAJOR_DESCRIPTIONS["Der Gehängte"] },
    { name: "Der Tod",            arcana: "major", number: 13, suit: null, element: null,    planet: null,      zodiacSign: "Skorpion",  goldenDawnKey: "Scorpio",   keywordsUpright: JSON.stringify(MAJOR_KEYWORDS["Der Tod"].upright),            keywordsReversed: JSON.stringify(MAJOR_KEYWORDS["Der Tod"].reversed),            description: MAJOR_DESCRIPTIONS["Der Tod"] },
    { name: "Mässigkeit",         arcana: "major", number: 14, suit: null, element: null,    planet: null,      zodiacSign: "Schütze",   goldenDawnKey: "Sagittarius", keywordsUpright: JSON.stringify(MAJOR_KEYWORDS["Mässigkeit"].upright),        keywordsReversed: JSON.stringify(MAJOR_KEYWORDS["Mässigkeit"].reversed),        description: MAJOR_DESCRIPTIONS["Mässigkeit"] },
    { name: "Der Teufel",         arcana: "major", number: 15, suit: null, element: null,    planet: null,      zodiacSign: "Steinbock", goldenDawnKey: "Capricorn", keywordsUpright: JSON.stringify(MAJOR_KEYWORDS["Der Teufel"].upright),         keywordsReversed: JSON.stringify(MAJOR_KEYWORDS["Der Teufel"].reversed),         description: MAJOR_DESCRIPTIONS["Der Teufel"] },
    { name: "Der Turm",           arcana: "major", number: 16, suit: null, element: null,    planet: "Mars",    zodiacSign: null,        goldenDawnKey: "Mars",      keywordsUpright: JSON.stringify(MAJOR_KEYWORDS["Der Turm"].upright),           keywordsReversed: JSON.stringify(MAJOR_KEYWORDS["Der Turm"].reversed),           description: MAJOR_DESCRIPTIONS["Der Turm"] },
    { name: "Der Stern",          arcana: "major", number: 17, suit: null, element: null,    planet: null,      zodiacSign: "Wassermann", goldenDawnKey: "Aquarius",  keywordsUpright: JSON.stringify(MAJOR_KEYWORDS["Der Stern"].upright),          keywordsReversed: JSON.stringify(MAJOR_KEYWORDS["Der Stern"].reversed),          description: MAJOR_DESCRIPTIONS["Der Stern"] },
    { name: "Der Mond",           arcana: "major", number: 18, suit: null, element: null,    planet: null,      zodiacSign: "Fische",    goldenDawnKey: "Pisces",    keywordsUpright: JSON.stringify(MAJOR_KEYWORDS["Der Mond"].upright),           keywordsReversed: JSON.stringify(MAJOR_KEYWORDS["Der Mond"].reversed),           description: MAJOR_DESCRIPTIONS["Der Mond"] },
    { name: "Die Sonne",          arcana: "major", number: 19, suit: null, element: null,    planet: "Sonne",   zodiacSign: null,        goldenDawnKey: "Sun",       keywordsUpright: JSON.stringify(MAJOR_KEYWORDS["Die Sonne"].upright),          keywordsReversed: JSON.stringify(MAJOR_KEYWORDS["Die Sonne"].reversed),          description: MAJOR_DESCRIPTIONS["Die Sonne"] },
    { name: "Das Gericht",        arcana: "major", number: 20, suit: null, element: "feuer", planet: "Pluto",   zodiacSign: null,        goldenDawnKey: "Pluto",     keywordsUpright: JSON.stringify(MAJOR_KEYWORDS["Das Gericht"].upright),        keywordsReversed: JSON.stringify(MAJOR_KEYWORDS["Das Gericht"].reversed),        description: MAJOR_DESCRIPTIONS["Das Gericht"] },
    { name: "Die Welt",           arcana: "major", number: 21, suit: null, element: null,    planet: "Saturn",  zodiacSign: null,        goldenDawnKey: "Saturn",    keywordsUpright: JSON.stringify(MAJOR_KEYWORDS["Die Welt"].upright),           keywordsReversed: JSON.stringify(MAJOR_KEYWORDS["Die Welt"].reversed),           description: MAJOR_DESCRIPTIONS["Die Welt"] },
  ];
}

function buildMinorArcana(): CardData[] {
  const cards: CardData[] = [];
  const suits: SuitKey[] = ["stäbe", "kelche", "schwerter", "münzen"];

  for (const suit of suits) {
    const element = SUIT_ELEMENT[suit];

    for (const rank of MINOR_RANKS) {
      const cardName = `${rank.name} der ${capitalize(suit)}`;

      let zodiacSign: string | null = null;
      let goldenDawnKey: string | null = null;
      let planet: string | null = null;

      if (rank.number >= 2 && rank.number <= 10) {
        const gd = SUIT_ZODIAC_MAP[suit][rank.number];
        if (gd) {
          zodiacSign = gd.zodiacSign;
          goldenDawnKey = gd.goldenDawnKey;
          planet = gd.planet;
        }
      } else if (rank.number >= 11) {
        const gd = COURT_GD[suit]?.[rank.name];
        if (gd) {
          zodiacSign = gd.zodiacSign;
          goldenDawnKey = gd.goldenDawnKey;
        }
      }

      const keywords = MINOR_KEYWORDS[suit][rank.number];
      const description = SUIT_DESCRIPTIONS[suit][rank.number] ?? null;

      cards.push({
        name: cardName,
        arcana: "minor",
        number: rank.number,
        suit,
        element,
        planet,
        zodiacSign,
        goldenDawnKey,
        keywordsUpright: JSON.stringify(keywords.upright),
        keywordsReversed: JSON.stringify(keywords.reversed),
        description,
      });
    }
  }

  return cards;
}

function capitalize(s: string): string {
  return s.charAt(0).toUpperCase() + s.slice(1);
}

// ---------------------------------------------------------------------------
// Main seed function
// ---------------------------------------------------------------------------

export async function main(): Promise<void> {
  console.log("Seeding Tarot cards...");

  const majorCards = buildMajorArcana();
  const minorCards = buildMinorArcana();
  const allCards = [...majorCards, ...minorCards];

  console.log(`Prepared ${majorCards.length} Major Arcana + ${minorCards.length} Minor Arcana = ${allCards.length} total cards`);

  const result = await prisma.tarotCard.createMany({
    data: allCards,
    skipDuplicates: true,
  });

  console.log(`Inserted ${result.count} cards (skipped existing duplicates)`);

  const totalCount = await prisma.tarotCard.count();
  console.log(`Total Tarot cards in database: ${totalCount}`);
}

// ---------------------------------------------------------------------------
// Execute when run directly
// ---------------------------------------------------------------------------

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error("Seed failed:", e);
    await prisma.$disconnect();
    process.exit(1);
  });
