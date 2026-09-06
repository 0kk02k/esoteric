/**
 * Client-sichere Krisenressourcen für den dedizierten Krisen-State im
 * Reading-Flow. Bewusst NICHT aus `lib/safety.ts` importiert — das Modul
 * zieht Prisma in den Client-Bundle. Die Nummern sind identisch mit
 * CRISIS_RESPONSE_DE; bei Änderungen an einer Stelle die andere mitziehen.
 *
 * design.md Krisenfall: dunkle, ruhige Fläche, gedämpfter roter Akzent,
 * keine Tarot- oder Sternsymbolik, klare Telefonnummern.
 */
export type CrisisLine = {
  country: string;
  serviceName: string;
  number: string;
  hint?: string;
  telHref: string;
};

export const CRISIS_INTRO =
  "Es klingt, als wärst du gerade in einer sehr schwierigen Situation. " +
  "Bitte wende dich an jemanden, der dir professionell helfen kann:";

export const CRISIS_OUTRO = "Du bist nicht allein. Es gibt Menschen, die dir zuhören wollen.";

export const CRISIS_LINES: CrisisLine[] = [
  {
    country: "Deutschland",
    serviceName: "Telefonseelsorge",
    number: "0800 111 0 111",
    hint: "oder 0800 111 0 222 · kostenlos, rund um die Uhr",
    telHref: "tel:08001110111",
  },
  {
    country: "Österreich",
    serviceName: "Telefonseelsorge",
    number: "142",
    hint: "kostenlos, rund um die Uhr",
    telHref: "tel:142",
  },
  {
    country: "Schweiz",
    serviceName: "Die Dargebotene Hand",
    number: "143",
    hint: "kostenlos, rund um die Uhr",
    telHref: "tel:143",
  },
];
