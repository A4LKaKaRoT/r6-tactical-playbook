import { useEffect, useState } from 'react';
import { applyUpdateAndReload } from '../lib/pwa';

/**
 * Zeigt einen Hinweis, wenn im Hintergrund eine neue Version installiert wurde.
 * Der Nutzer entscheidet, wann neu geladen wird (mid-match nicht ungefragt reloaden).
 */
export default function UpdateBanner() {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (typeof navigator === 'undefined' || !('serviceWorker' in navigator)) return;
    const onChange = () => {
      navigator.serviceWorker.getRegistration().then((reg) => {
        if (reg?.waiting) setReady(true);
      }).catch(() => undefined);
    };
    navigator.serviceWorker.addEventListener('controllerchange', onChange);
    // Beim Start prüfen, ob schon ein Update wartet.
    navigator.serviceWorker.getRegistration().then((reg) => {
      if (reg?.waiting) setReady(true);
      reg?.update?.().catch(() => undefined);
    }).catch(() => undefined);
    return () => navigator.serviceWorker.removeEventListener('controllerchange', onChange);
  }, []);

  if (!ready) return null;

  return (
    <div className="update-banner">
      <b>Neue Version verfügbar.</b>
      <span className="small muted">Karten/Taktiken wurden aktualisiert.</span>
      <span className="spacer" />
      <button className="btn btn-sm btn-primary" onClick={() => void applyUpdateAndReload()}>Jetzt neu laden</button>
      <button className="btn btn-sm" onClick={() => setReady(false)}>Später</button>
    </div>
  );
}
