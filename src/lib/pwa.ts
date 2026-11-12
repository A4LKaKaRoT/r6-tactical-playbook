/**
 * Registriert den Service Worker (nur im Production-Build).
 * Im Dev-Modus (`npm run dev`) wäre ein Cache beim Entwickeln nur hinderlich.
 */
const SW_FILE = 'sw.js';

/**
 * Manifest und Icons werden zur Laufzeit mit absolutem BASE_URL-Pfad gesetzt.
 * Grund: In `index.html` mit "./manifest.webmanifest" würde der Browser den Pfad
 * bei einem Deep-Link (z. B. /repo/tactic/xyz) relativ zur *aktuellen* URL
 * auflösen – daraus würde /repo/tactic/manifest.webmanifest und damit ein 404.
 */
export function installPwaHeadLinks(): void {
  if (typeof document === 'undefined') return;
  const base = import.meta.env.BASE_URL; // "/" oder "/r6-tactical-playbook/"

  const setLink = (rel: string, href: string, extra?: Record<string, string>) => {
    let el = document.head.querySelector<HTMLLinkElement>(`link[rel="${rel}"]`);
    if (!el) {
      el = document.createElement('link');
      el.rel = rel;
      document.head.appendChild(el);
    }
    el.href = href;
    if (extra) Object.entries(extra).forEach(([k, v]) => el!.setAttribute(k, v));
  };

  setLink('manifest', `${base}manifest.webmanifest`);
  setLink('apple-touch-icon', `${base}icons/apple-touch-icon.png`);
  setLink('icon', `${base}icons/icon.svg`, { type: 'image/svg+xml' });
}

export function registerServiceWorker(): void {
  installPwaHeadLinks();
  if (typeof window === 'undefined' || !('serviceWorker' in navigator)) return;
  if (!import.meta.env.PROD) return;

  window.addEventListener('load', () => {
    const base = import.meta.env.BASE_URL;
    navigator.serviceWorker
      .register(`${base}${SW_FILE}`, { scope: base })
      .catch((err) => console.warn('Service Worker nicht registriert:', err));
  });
}

/** Schickt allen aktiven Workern "skip-waiting" und lädt neu (Einstellungen → Update). */
export async function applyUpdateAndReload(): Promise<void> {
  if (!('serviceWorker' in navigator)) {
    window.location.reload();
    return;
  }
  const regs = await navigator.serviceWorker.getRegistrations();
  await Promise.all(regs.map((r) => r.update().catch(() => undefined)));
  await Promise.all(regs.map((r) => r.waiting?.postMessage('skip-waiting')));
  window.location.reload();
}

/** Cache-Status für die Einstellungen (offline verfügbar?). */
export async function offlineStatus(): Promise<{ supported: boolean; active: boolean }> {
  if (!('serviceWorker' in navigator)) return { supported: false, active: false };
  const regs = await navigator.serviceWorker.getRegistrations();
  return { supported: true, active: regs.length > 0 };
}
