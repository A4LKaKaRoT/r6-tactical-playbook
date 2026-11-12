import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';

/**
 * Globale Bedienkomfort-Funktionen:
 *  - Tastatur-Shortcuts (mid-match wichtig, wenn keine Maus/kein Zeit ist)
 *  - "Nach oben"-Knopf bei langen Seiten
 *
 * Shortcuts (nicht aktiv, solange in einem Eingabefeld getippt wird):
 *   /  oder  s   → Schnellmodus
 *   m            → Karten
 *   a            → Angriff
 *   v            → Verteidigung
 *   t            → Taktiken
 *   f            → Favoriten
 *   e            → Editor
 *   ?            → Shortcut-Hilfe ein-/ausblenden
 *   Esc          → Hilfe schließen
 */
const SHORTCUTS: { keys: string[]; label: string; to: string }[] = [
  { keys: ['/', 's'], label: 'Schnellmodus', to: '/quick' },
  { keys: ['m'], label: 'Karten', to: '/maps' },
  { keys: ['a'], label: 'Angriff', to: '/attack' },
  { keys: ['v'], label: 'Verteidigung', to: '/defense' },
  { keys: ['t'], label: 'Taktiken', to: '/tactics' },
  { keys: ['f'], label: 'Favoriten', to: '/favorites' },
  { keys: ['e'], label: 'Editor', to: '/editor' },
];

function isTyping(target: EventTarget | null): boolean {
  const el = target as HTMLElement | null;
  if (!el) return false;
  const tag = el.tagName;
  return tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT' || el.isContentEditable;
}

export default function GlobalUI() {
  const navigate = useNavigate();
  const [help, setHelp] = useState(false);
  const [showTop, setShowTop] = useState(false);
  const helpRef = useRef(help);
  helpRef.current = help;

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.metaKey || e.ctrlKey || e.altKey) return;
      if (isTyping(e.target)) return;
      const key = e.key.toLowerCase();
      if (key === 'escape') { setHelp(false); return; }
      if (key === '?') { setHelp((v) => !v); return; }
      const hit = SHORTCUTS.find((s) => s.keys.includes(key));
      if (hit) {
        e.preventDefault();
        setHelp(false);
        navigate(hit.to);
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [navigate]);

  useEffect(() => {
    const onScroll = () => setShowTop(window.scrollY > 700);
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <>
      {showTop && (
        <button
          className="to-top"
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          aria-label="Nach oben"
          title="Nach oben"
        >
          ↑
        </button>
      )}

      <button className="shortcut-hint" onClick={() => setHelp((v) => !v)} title="Tastatur-Kürzel anzeigen (?)">
        ?
      </button>

      {help && (
        <div className="modal-backdrop" onClick={() => setHelp(false)} role="presentation">
          <div className="modal" onClick={(e) => e.stopPropagation()} role="dialog" aria-label="Tastatur-Kürzel">
            <div className="row" style={{ marginBottom: 10 }}>
              <h2 style={{ margin: 0 }}>Tastatur-Kürzel</h2>
              <span className="spacer" />
              <button className="btn btn-sm" onClick={() => setHelp(false)}>Schließen (Esc)</button>
            </div>
            <p className="small muted" style={{ marginTop: 0 }}>
              Funktioniert überall außer in Eingabefeldern – gedacht für die Sekunden zwischen zwei Runden.
            </p>
            <table className="table">
              <tbody>
                {SHORTCUTS.map((s) => (
                  <tr key={s.to}>
                    <td style={{ width: 96 }}>
                      {s.keys.map((k) => <kbd key={k}>{k}</kbd>)}
                    </td>
                    <td>{s.label}</td>
                  </tr>
                ))}
                <tr><td><kbd>?</kbd></td><td>Diese Hilfe</td></tr>
                <tr><td><kbd>Esc</kbd></td><td>Hilfe schließen</td></tr>
              </tbody>
            </table>
          </div>
        </div>
      )}
    </>
  );
}
