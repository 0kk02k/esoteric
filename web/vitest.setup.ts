import { config } from "dotenv";

// Reihenfolge wie in prisma.config.ts: .env.local gewinnt über .env,
// bereits gesetzte Prozess-Variablen bleiben unangetastet.
config({ path: ".env.local" });
config();
