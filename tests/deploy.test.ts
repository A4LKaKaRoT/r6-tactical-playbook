import { describe, expect, it } from 'vitest';
import { readFileSync, existsSync, readdirSync } from 'node:fs';
import { join } from 'node:path';

/**
 * Absicherung für das Deployment auf GitHub Pages.
 * Diese Tests prüfen Dateien/Regeln, die im Browser sonst erst live auffallen.
 */
const root = process.cwd();
const read = (p: string) => readFileSync(join(root, p), 'utf8');
const json = (p: string) => JSON.parse(read(p));
const readdirSyncFiles = (dir: string) => readdirSync(dir).filter((f) => !f.startsWith('.'));

describe('GitHub Pages – Voraussetzungen', () => {
  it('Vite-Build setzt base aus BASE_PATH und hat einen SPA-Fallback', () => {
    const config = read('vite.config.ts');
    expect(config).toMatch(/base:\s*process\.env\.BASE_PATH/);
    expect(existsSync(join(root, 'scripts/make-spa-fallback.mjs'))).toBe(true);

    const fallback = read('scripts/make-spa-fallback.mjs');
    // 404.html MUSS absolute Asset-Pfade behalten (BASE_PATH wird vom Workflow gesetzt).
    expect(fallback).not.toMatch(/split\('"\/assets\//);
    expect(fallback).toMatch(/404\.html/);
  });

  it('Deploy-Workflow baut mit dem Repo-Namen als base und deployt Pages', () => {
    const wf = read('.github/workflows/deploy.yml');
    expect(wf).toMatch(/BASE_PATH:\s*\/\$\{\{\s*github\.event\.repository\.name\s*\}\}\//);
    expect(wf).toMatch(/actions\/upload-pages-artifact@v3/);
    expect(wf).toMatch(/actions\/deploy-pages@v4/);
    expect(wf).toMatch(/pages:\s*write/);
    expect(wf).toMatch(/id-token:\s*write/);
    expect(wf).toMatch(/branches:\s*\[main\]/);
  });

  it('Build-Skript erzeugt 404.html und der Pfad-Assert im Workflow ist vorhanden', () => {
    const pkg = json('package.json');
    expect(pkg.scripts.build).toMatch(/make-spa-fallback/);
    const wf = read('.github/workflows/deploy.yml');
    expect(wf).toMatch(/dist\/404\.html/);
  });

  it('PWA-Dateien liegen in public/ und werden mit ausgeliefert', () => {
    for (const f of ['public/manifest.webmanifest', 'public/sw.js', 'public/icons/icon-192.png', 'public/icons/icon-512.png']) {
      expect(existsSync(join(root, f)), f).toBe(true);
    }
    const manifest = json('public/manifest.webmanifest');
    expect(manifest.lang).toBe('de');
    expect(manifest.start_url).toBe('./');
    expect(manifest.icons.length).toBeGreaterThanOrEqual(3);
    expect(manifest.display).toBe('standalone');
  });

  it('Service Worker cached Assets und HTML getrennt und versioniert den Cache', () => {
    const sw = read('public/sw.js');
    expect(sw).toMatch(/const VERSION = 'v/);
    expect(sw).toMatch(/req\.mode === 'navigate'/);
    expect(sw).toMatch(/caches\.delete/);
    expect(sw).toMatch(/skipWaiting/);
  });

  it('Manifest/Icons werden zur Laufzeit absolut gesetzt (kein ./ im Deep-Link)', () => {
    const pwa = read('src/lib/pwa.ts');
    expect(pwa).toMatch(/import\.meta\.env\.BASE_URL/);
    expect(pwa).toMatch(/manifest\.webmanifest/);
    const html = read('index.html');
    // Statische relative Manifest-Verweise würden bei /repo/tactic/xyz brechen.
    expect(html).not.toMatch(/rel="manifest"\s+href="\.\//);
  });
});

describe('SSH-Zugang (kein Passwort im Terminal)', () => {
  it('ssh-setup.sh existiert und erzeugt den Key ohne Passphrase-Rueckfrage', () => {
    expect(existsSync(join(root, 'ssh-setup.sh'))).toBe(true);
    const sh = read('ssh-setup.sh');
    // -N "" ist der Kern: ohne das fragt ssh-keygen nach einer Passphrase.
    expect(sh).toMatch(/ssh-keygen -t ed25519 -N ""/);
    expect(sh).toMatch(/github\.com\/settings\/keys|settings\/keys/);
    expect(sh).toMatch(/ssh -o StrictHostKeyChecking=accept-new -o BatchMode=yes -T git@github\.com/);
    expect(sh).toMatch(/set -u/);
    // Der Key darf nicht bei jedem Lauf neu erzeugt werden.
    expect(sh).toMatch(/if \[ -f "\$KEY" \]/);
    expect(sh).toMatch(/chmod 600/);
  });

  it('Doku verweist nirgends mehr auf Passwort/Token als Pflichtweg', () => {
    const anl = read('ANLEITUNG.md');
    const readme = read('README.md');
    for (const doc of [anl, readme]) {
      // Remote immer per SSH, niemals per https-Push-Anleitung
      expect(doc).not.toMatch(/git remote add origin https:\/\/github\.com/);
      expect(doc).toMatch(/git@github\.com:/);
    }
    expect(anl).toMatch(/### 13\.0/);
    expect(anl).toMatch(/ssh-keygen -t ed25519 -N ""/);
    expect(anl).toMatch(/ssh -T git@github\.com/);
    expect(readme).toMatch(/ssh-setup\.sh/);
    // Personal Access Token darf nicht mehr als Empfehlung stehen
    expect(anl).not.toMatch(/Personal Access Token/i);
    expect(readme).not.toMatch(/Personal Access Token/i);
  });
});

describe('Workflow-Diagnose', () => {
  it('check-deploy.sh prueft Tracking, Remote, Default-Branch und deploy.yml', () => {
    expect(existsSync(join(root, 'check-deploy.sh'))).toBe(true);
    const sh = read('check-deploy.sh');
    expect(sh).toMatch(/git ls-files --error-unmatch/);
    expect(sh).toMatch(/ls-remote --symref origin HEAD/);
    expect(sh).toMatch(/ls-tree -r --name-only/);
    expect(sh).toMatch(/actions[\/]workflows[\/]deploy\.yml/);
    expect(sh).toMatch(/Run workflow/);
    // kein Passwort-Prompt, wenn im Hintergrund Git laeuft
    expect(sh).toMatch(/GIT_TERMINAL_PROMPT=0/);
  });

  it('Doku erklaert, dass es keine Dateiauswahl fuer Workflows gibt', () => {
    const anl = read('ANLEITUNG.md');
    expect(anl).toMatch(/7\.1/);
    expect(anl).toMatch(/kein\*\* Auswahlfeld|keine\*\* Dateiauswahl/);
    expect(anl).toMatch(/check-deploy\.sh/);
    expect(anl).toMatch(/actions\/workflows\/deploy\.yml/);
  });

  it('deploy.yml triggert auf main und ist manuell startbar', () => {
    const wf = read('.github/workflows/deploy.yml');
    expect(wf).toMatch(/workflow_dispatch/);
    expect(wf).toMatch(/name: Deploy to GitHub Pages/);
  });
});

describe('Schriften im Offline-Modus', () => {
  it('Service Worker cached lokale woff2-Schriften (cache-first)', () => {
    const sw = read('public/sw.js');
    expect(sw).toMatch(/isFont/);
    expect(sw).toMatch(/\\\/fonts\\\//);
    expect(sw).toMatch(/isAsset\(url\) \|\| isFont\(url\)/);
  });

  it('Schrift-Dateien liegen im Build-Output (public/fonts wird mitkopiert)', () => {
    expect(existsSync(join(root, 'public/fonts'))).toBe(true);
    const files = readdirSyncFiles(join(root, 'public/fonts'));
    expect(files.filter((f) => f.endsWith('.woff2')).length).toBeGreaterThanOrEqual(4);
  });
});
