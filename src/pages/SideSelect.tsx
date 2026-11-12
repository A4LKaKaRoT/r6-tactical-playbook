import { Link, useParams } from 'react-router-dom';
import { BASE_TACTICS, getMap } from '../lib/queries';
import { useTacticsVersion } from '../lib/useTactics';
import { mapFloorUrl } from '../lib/paths';

/** Zwischenseite: Karte → Angriff oder Verteidigung. */
export default function SideSelect({ side }: { side: 'attack' | 'defense' }) {
  useTacticsVersion();
  const { mapSlug = '' } = useParams();
  const map = getMap(mapSlug);

  if (!map) {
    return (
      <div className="page">
        <div className="badbox">Karte „{mapSlug}“ nicht gefunden. <Link to="/maps">Zur Kartenliste</Link></div>
      </div>
    );
  }

  const counts = (site: string) =>
    BASE_TACTICS.filter((t) => t.map === map.slug && t.site === site && t.side === side).length;

  return (
    <div>
      <div className="breadcrumbs">
        <Link to="/">Start</Link><span className="sep">/</span>
        <Link to="/maps">Karten</Link><span className="sep">/</span>
        <span>{map.name}</span>
      </div>

      <div className="row" style={{ marginBottom: 14, alignItems: 'flex-start' }}>
        <div style={{ flex: '1 1 340px', minWidth: 0 }}>
          <h1>{map.name}</h1>
          <p className="muted small" style={{ marginTop: -2 }}>{map.location} · {map.floors.length} Etagen</p>
          <div className="row-tight" style={{ marginBottom: 12 }}>
            {map.ranked && <span className="chip atk">Ranked-Pool</span>}
            {map.siegeCup && <span className="chip def">Siege Cup</span>}
            {map.pro && <span className="chip intel">Pro-Pool</span>}
            <span className="chip mono">Stand {new Date(map.updated).toLocaleDateString('de-DE')}</span>
          </div>
          <div className="pill-group">
            <Link to={`/map/${map.slug}/defense`} style={{ textDecoration: 'none' }}>
              <button className={side === 'defense' ? 'on def' : ''}>Verteidigung</button>
            </Link>
            <Link to={`/map/${map.slug}/attack`} style={{ textDecoration: 'none' }}>
              <button className={side === 'attack' ? 'on atk' : ''}>Angriff</button>
            </Link>
          </div>
          {map.notes && <p className="map-notes">{map.notes}</p>}
        </div>
        <img
          src={mapFloorUrl(map.slug, map.floors[map.floors.length - 1])}
          alt={`${map.name} Blueprint`}
          style={{ width: 'min(420px, 100%)', borderRadius: 'var(--radius-sm)', border: '1px solid var(--line)', opacity: 0.8, display: 'block' }}
        />
      </div>

      <div className="section-head">
        <h2>Bombsite wählen</h2>
        <span className="spacer" />
        <span className="small faint">{side === 'attack' ? 'danach: Spawn & Execute' : 'danach: Lineup & Setup'}</span>
      </div>

      <div className="sitebar">
        {map.bombSites.map((s) => (
          <Link key={s.id} to={`/map/${map.slug}/${side}/${s.id}`} className="sitebtn">
            <strong>{s.short}</strong>
            <span>{s.name}</span>
            <span className="xsmall faint" style={{ display: 'block', marginTop: 2 }}>
              {s.floors.map((f) => (f === 'B' ? 'KG' : f)).join(' · ')} · {counts(s.id)} Taktik(en)
            </span>
          </Link>
        ))}
      </div>

      <div className="section-head"><h2>Alle Taktiken dieser Karte</h2></div>
      <div className="card scroll-x">
        <div className="table-scroll">
        <table className="table">
          <thead><tr><th>Taktik</th><th>Site</th><th>Stil</th><th>Lineup</th><th>Bewertung</th></tr></thead>
          <tbody>
            {BASE_TACTICS.filter((t) => t.map === map.slug && t.side === side).map((t) => (
              <tr key={t.id}>
                <td><Link to={`/tactic/${t.id}`} style={{ color: 'var(--text)', fontWeight: 600 }}>{t.name}</Link></td>
                <td className="muted">{map.bombSites.find((s) => s.id === t.site)?.short}</td>
                <td><span className="chip">{t.style}</span></td>
                <td className="small muted">{t.players.map((p) => p.operator).join(', ')}</td>
                <td className="mono small">{t.ratings.competitive}/5</td>
              </tr>
            ))}
          </tbody>
        </table>
        </div>
      </div>
    </div>
  );
}
