import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';

/**
 * GitHub-Pages-Kompatibilität:
 * `base` wird über die Umgebungsvariable BASE_PATH gesetzt.
 * - Projektseite (https://user.github.io/repo/):  BASE_PATH=/repo/  (Default im Workflow)
 * - User-/Organisationsseite oder lokaler Build:  BASE_PATH=/
 * Alle Asset-URLs im Code laufen über `import.meta.env.BASE_URL`
 * (siehe src/lib/paths.ts), damit Deep-Links und Bilder immer passen.
 */
export default defineConfig(() => ({
  base: process.env.BASE_PATH || '/',
  plugins: [react()],
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    sourcemap: false,
    chunkSizeWarningLimit: 900,
    rollupOptions: {
      output: {
        // Taktikdaten (~1 MB JSON) in eigenem Chunk: App startet schneller,
        // Daten werden parallel geladen und bleiben über Deploys cachebar.
        manualChunks(id: string) {
          // Varianten (~3 MB) als eigener, nachgeladener Chunk.
          if (id.includes('/src/data/tactics/variants.json')) return 'variants';
          if (id.includes('/src/data/tactics/')) return 'tactics';
          if (id.includes('/src/data/operators/') || id.includes('/src/data/maps/')) return 'gamedata';
          const m = id.match(/node_modules\/(react|react-dom|react-router|react-router-dom|scheduler)\//);
          if (m) return 'vendor';
          return undefined;
        },
      },
    },
  },
  server: {
    host: '0.0.0.0',
    port: 5173,
    strictPort: true,
  },
  preview: {
    host: '0.0.0.0',
    port: 4173,
    // Erlaubt Preview-Hosts (z. B. Sandbox-Domains) – auf GitHub Pages irrelevant.
    allowedHosts: true,
  },
  test: {
    environment: 'node',
    include: ['src/**/*.test.ts', 'tests/**/*.test.ts'],
  },
}));
