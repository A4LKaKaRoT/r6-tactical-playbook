import { useMemo, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { BASE_TACTICS, MAPS, getMap } from '../lib/queries';
import { useTacticsVersion } from '../lib/useTactics';
import MapTile from '../components/MapTile';

/** /attack und /defense: alle Karten des jeweiligen Flows. */
export default function SideList({ side }: { side: 'attack' | 'defense' }) {
  useTacticsVersion();
  const { mapSlug } = useParams();
  const [q, setQ] = useState('');
  const isAtk = side === 'attack';

  const maps = useMemo(
    () => MAPS.filter((m) => !q || m.name.toLowerCase().includes(q.toLowerCase()))
      .sort((a, b) => a.name.localeCompare(b.name, 'de')),
    [q],
  );

  const count = (slug: string) => BASE_TACTICS.filter((t) => t.map === slug && t.side === side).length;

  return (
    <div>
      <div className="breadcrumbs">
        <Link to="/">Start</Link><span className="sep">/</span>
        <span>{isAtk ? 'Angriff' : 'Verteidigung'}</span>
        {mapSlug && <><span className="sep">/</span><Link to={`/map/${mapSlug}`}>{getMap(mapSlug)?.name}</Link></>}
      </div>
      <div className="row" style={{ alignItems: 'flex-end', marginBottom: 12 }}>
        <div style={{ flex: '1 1 320px' }}>
          <div className="row-tight" style={{ marginBottom: 3 }}>
            <span className={`chip ${isAtk ? 'atk' : 'def'}`}>{isAtk ? 'Angriff' : 'Verteidigung'}</span>
            <span className="chip">{maps.length} Karten</span>
          </div>
          <h1>{isAtk ? 'Angriff' : 'Verteidigung'}</h1>
          <p className="muted" style={{ margin: 0 }}>
            {isAtk
              ? 'Karte → Bombsite → Spawn → Lineup mit Entry, Support, Hard/Soft Breach, Intel und Flank Watch.'
              : 'Karte → Bombsite → sofort das komplette 5er-Lineup mit Anker-, Roam- und Utility-Aufgaben.'}
          </p>
        </div>
        <input className="input search" placeholder="Karte filtern …" value={q} onChange={(e) => setQ(e.target.value)} />
      </div>

      <div className="maptiles">
        {maps.map((m) => (
          <div key={m.slug} style={{ position: 'relative' }}>
            <MapTile map={m} to={`/map/${m.slug}/${side}`} showCounts={false} />
            <span className="maptile-flag" style={{ left: 'auto', right: 7, top: 'auto', bottom: 44 }}>
              <span className={`chip ${isAtk ? 'atk' : 'def'}`}>{count(m.slug)} Taktik(en)</span>
            </span>
          </div>
        ))}
      </div>

      <div className="section-head">
        <h2>Direkt zur Taktik</h2>
        <span className="spacer" />
        <span className="mono xsmall faint">{BASE_TACTICS.filter((t) => t.side === side).length} Einträge</span>
      </div>
      <div className="card scroll-x">
        <div className="table-scroll">
        <table className="table">
          <thead><tr><th>Karte</th><th>Site</th><th>Taktik</th><th>Lineup</th><th>Stil</th><th>Rating</th></tr></thead>
          <tbody>
            {BASE_TACTICS.filter((t) => t.side === side)
              .filter((t) => !q || getMap(t.map)?.name.toLowerCase().includes(q.toLowerCase()))
              .sort((a, b) => (getMap(a.map)?.name ?? a.map).localeCompare(getMap(b.map)?.name ?? b.map, 'de'))
              .map((t) => {
                const m = getMap(t.map);
                return (
                  <tr key={t.id}>
                    <td className="muted">{m?.name ?? t.map}</td>
                    <td className="muted">{m?.bombSites.find((s) => s.id === t.site)?.short}</td>
                    <td><Link to={`/tactic/${t.id}`} style={{ color: 'var(--text)', fontWeight: 600 }}>{t.name}</Link></td>
                    <td className="small muted">{t.players.map((p) => p.operator).join(', ')}</td>
                    <td><span className="chip">{t.style}</span></td>
                    <td className="mono small">{t.ratings.competitive}/5</td>
                  </tr>
                );
              })}
          </tbody>
        </table>
        </div>
      </div>
    </div>
  );
}
