import { defineConfig } from 'vitest/config';
import path from 'path';

export default defineConfig({
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
    },
  },
  test: {
    environment: 'node',
    include: ['src/**/*.test.ts'],
    // Tests importieren Module mit Prisma-Client — derselbe Env-Stand wie
    // Next/CLI (.env.local, z. B. DATABASE_URL=file:… für den SQLite-Dev-Modus)
    setupFiles: ['dotenv/config', './vitest.setup.ts'],
  },
});
