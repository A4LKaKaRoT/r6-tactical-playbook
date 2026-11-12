import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { BASE_TACTICS, MAPS, getMap, getOperator, getSite } from '../lib/queries';
import { useTacticsVersion } from '../lib/useTactics';
import { useApp } from '../lib/store';

const STYLE_LABEL: Record<string, string> = {
  standard: 'Standard', aggressiv: 'Aggressiv', defensiv: 'Defensiv', 'anti-ban': 'Ban-Alternative',
};

export default function Tactics() {
  const tacticsVersion = useTacticsVersion();
  const { userTactics, favorites, toggleFavorite } = useApp();
  const [q, setQ] = useState('');
  const [mapFilter, setMapFilter] = useState('alle');
  const [sideFilter, setSideFilter] = useState<'alle' | 'attack' | 'defense'>('alle');
  const [styleFilter, setStyleFilter] = useState('alle');
  const [favOnly, setFavOnly] = useState(false);

  const all = useMemo(() => [...userTactics, ...BASE_TACTICS], [userTactics, tacticsVersion]);

  const rows = useMemo(() => {
    const needle = q.trim().toLowerCase();
    return all
      .filter((t) => (mapFilter === 'alle' ? true : t.map === mapFilter))
      .filter((t) => (sideFilter === 'alle' ? true : t.side === sideFilter))
      .filter((t) => (styleFilter === 'alle' ? true : t.style === styleFilter))
      .filter((t) => (favOnly ? favorites.includes(t.id) : true))
      .filter((t) => {
        if (!needle) return true;
        const hay = [
          t.name, t.summary, getMap(t.map)?.name, getSite(t.map, t.site)?.name,
          ...t.players.map((p) => `${getOperator(p.operator)?.name ?? p.operator} ${p.role}`),
        ].join(' ').toLowerCase();
        return hay.includes(needle);
      })
      .sort((a, b) => (getMap(a.map)?.name ?? a.map).localeCompare(getMap(b.map)?.name ?? b.map, 'de')
        || a.name.localeCompare(b.name, 'de'));
  }, [all, q, mapFilter, sideFilter, styleFilter, favOnly, favorites]);

  return (
    <div>
      <div className="breadcrumbs"><Link to="/">Start</Link><span className="sep">/</span><span>Taktiken</span></div>
      <div className="row" style={{ alignItems: 'flex-end', marginBottom: 10 }}>
        <div style={{ flex: '1 1 300px' }}>
          <h1>Taktiken</h1>
          <p className="muted" style={{ margin: 0 }}>
            Volltextsuche über Taktiknamen, Sites, Operatoren und Rollen. {all.length} Einträge.
          </p>
        </div>
        <Link className="btn btn-primary" to="/editor/new">+ Neue Taktik</Link>
      </div>

      <div className="toolbar">
        <input className="input search" placeholder="Suchen (Operator, Site, Karte …)" value={q} onChange={(e) => setQ(e.target.value)} />
        <select className="select" value={mapFilter} onChange={(e) => setMapFilter(e.target.value)}>
          <option value="alle">Alle Karten</option>
          {MAPS.slice().sort((a, b) => a.name.localeCompare(b.name, 'de')).map((m) => (
            <option key={m.slug} value={m.slug}>{m.name}</option>
          ))}
        </select>
        <div className="pill-group">
          {(['alle', 'defense', 'attack'] as const).map((s) => (
            <button key={s} className={`${sideFilter === s ? 'on' : ''}`} onClick={() => setSideFilter(s)}>
              {s === 'alle' ? 'Beide' : s === 'defense' ? 'Verteidigung' : 'Angriff'}
            </button>
          ))}
        </div>
        <select className="select" value={styleFilter} onChange={(e) => setStyleFilter(e.target.value)}>
          <option value="alle">Alle Stile</option>
          {Object.entries(STYLE_LABEL).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
        </select>
        <button className={`btn btn-sm${favOnly ? ' btn-blue' : ''}`} onClick={() => setFavOnly((v) => !v)}>★ nur Favoriten</button>
      </div>

      {rows.length === 0 ? (
        <div className="infobox">Keine Taktik passt zu dieser Suche.</div>
      ) : (
        <div className="card scroll-x">
          <div className="table-scroll">
          <table className="table">
            <thead>
              <tr><th>★</th><th>Karte</th><th>Site</th><th>Seite</th><th>Taktik</th><th>Lineup</th><th>Stil</th><th>Konfidenz</th><th>R</th></tr>
            </thead>
            <tbody>
              {rows.map((t) => {
                const m = getMap(t.map);
                const isFav = favorites.includes(t.id);
                return (
                  <tr key={t.id}>
                    <td>
                      <button className="btn btn-sm" style={{ padding: '1px 7px' }} onClick={() => toggleFavorite(t.id)} title="Favorit">
                        {isFav ? '★' : '☆'}
                      </button>
                    </td>
                    <td className="muted">{m?.name ?? t.map}</td>
                    <td className="muted">{getSite(t.map, t.site)?.short ?? t.site}</td>
                    <td><span className={`chip ${t.side === 'attack' ? 'atk' : 'def'}`}>{t.side === 'attack' ? 'ATK' : 'DEF'}</span></td>
                    <td>
                      <Link to={`/tactic/${t.id}`} style={{ color: 'var(--text)', fontWeight: 600 }}>{t.name}</Link>
                      {t.userCreated && <span className="chip intel" style={{ marginLeft: 6 }}>eigen</span>}
                    </td>
                    <td className="xsmall muted" style={{ maxWidth: 260 }}>{t.players.map((p) => getOperator(p.operator)?.name ?? p.operator).join(', ')}</td>
                    <td><span className="chip">{STYLE_LABEL[t.style] ?? t.style}</span></td>
                    <td><span className={`chip ${t.confidence === 'verifiziert' ? 'intel' : 'warn'}`}>{t.confidence}</span></td>
                    <td className="mono small">{t.ratings.competitive}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          </div>
        </div>
      )}
    </div>
  );
}
