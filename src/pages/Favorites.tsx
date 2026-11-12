import { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { BASE_TACTICS, getMap, getOperator, getSite } from '../lib/queries';
import { useTacticsVersion } from '../lib/useTactics';
import { useApp } from '../lib/store';

export default function Favorites() {
  const tacticsVersion = useTacticsVersion();
  const { favorites, userTactics, toggleFavorite, recent } = useApp();
  const all = useMemo(() => [...userTactics, ...BASE_TACTICS], [userTactics, tacticsVersion]);

  const favTactics = favorites.map((id) => all.find((t) => t.id === id)).filter(Boolean) as typeof all;
  const recentTactics = recent.map((id) => all.find((t) => t.id === id)).filter(Boolean) as typeof all;

  function downloadJson() {
    const payload = { schemaVersion: 1, exported: new Date().toISOString(), tactics: favTactics };
    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `r6pb-favoriten-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <div>
      <div className="breadcrumbs"><Link to="/">Start</Link><span className="sep">/</span><span>Favoriten</span></div>
      <div className="row" style={{ alignItems: 'flex-end', marginBottom: 12 }}>
        <div style={{ flex: 1 }}>
          <div className="row-tight" style={{ marginBottom: 3 }}>
            <span className="chip warn">{favTactics.length} gespeichert</span>
          </div>
          <h1>Favoriten</h1>
          <p className="muted small" style={{ margin: 0 }}>Lokal im Browser gespeichert – kein Account nötig.</p>
        </div>
        <button className="btn" onClick={downloadJson} disabled={!favTactics.length}>JSON exportieren</button>
      </div>

      {favTactics.length === 0 ? (
        <div className="infobox">
          Noch keine Favoriten. Öffne eine Taktik und klicke auf „☆ Favorit“ – sie erscheint dann hier und auf der Startseite.
        </div>
      ) : (
        <div className="panel scroll-x">
          <div className="table-scroll">
          <table className="table">
            <thead><tr><th>Seite</th><th>Karte</th><th>Site</th><th>Taktik</th><th>Lineup</th><th /></tr></thead>
            <tbody>
              {favTactics.map((t) => (
                <tr key={t.id}>
                  <td><span className={`chip ${t.side === 'attack' ? 'atk' : 'def'}`}>{t.side === 'attack' ? 'Angriff' : 'Verteidigung'}</span></td>
                  <td className="muted">{getMap(t.map)?.name}</td>
                  <td className="muted">{getSite(t.map, t.site)?.short}</td>
                  <td><Link to={`/tactic/${t.id}`} style={{ color: 'var(--text)', fontWeight: 600 }}>{t.name}</Link></td>
                  <td className="xsmall muted">{t.players.map((p) => getOperator(p.operator)?.name).join(', ')}</td>
                  <td><button className="btn btn-sm btn-danger" onClick={() => toggleFavorite(t.id)}>entfernen</button></td>
                </tr>
              ))}
            </tbody>
          </table>
          </div>
        </div>
      )}

      {recentTactics.length > 0 && (
        <>
          <div className="section-head"><h2>Zuletzt geöffnet</h2></div>
          <div className="panel flush recent-list">
            {recentTactics.slice(0, 8).map((t) => (
              <Link key={t.id} to={`/tactic/${t.id}`} className="recent-row">
                <span className={`chip ${t.side === 'attack' ? 'atk' : 'def'}`}>{t.side === 'attack' ? 'ATK' : 'DEF'}</span>
                <span className="recent-main">
                  <b>{t.name}</b>
                  <span className="recent-sub">{getMap(t.map)?.name} · {getSite(t.map, t.site)?.short}</span>
                </span>
                <span className="recent-go">→</span>
              </Link>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
