import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { BASE_TACTICS, MAPS, META, getMap } from '../lib/queries';
import { useTacticsVersion } from '../lib/useTactics';
import MapTile from '../components/MapTile';

type Filter = 'alle' | 'ranked' | 'cup' | 'pro';

export default function Maps() {
  useTacticsVersion();
  const [q, setQ] = useState('');
  const [filter, setFilter] = useState<Filter>('alle');

  const filtered = useMemo(() => {
    return MAPS.filter((m) => {
      if (q && !`${m.name} ${m.location}`.toLowerCase().includes(q.toLowerCase())) return false;
      if (filter === 'ranked') return m.ranked;
      if (filter === 'cup') return m.siegeCup;
      if (filter === 'pro') return m.pro;
      return true;
    });
  }, [q, filter]);

  const ranked = filtered.filter((m) => m.ranked);
  const cupOnly = filtered.filter((m) => !m.ranked && m.siegeCup);
  const others = filtered.filter((m) => !m.ranked && !m.siegeCup);

  return (
    <div>
      <div className="breadcrumbs"><Link to="/">Start</Link><span className="sep">/</span><span>Karten</span></div>
      <div className="page-head">
        <div>
          <h1>Karten</h1>
          <p className="muted small" style={{ margin: 0, maxWidth: '72ch' }}>
            {MAPS.length} Karten mit Blueprint-Übersichten je Etage und Taktiken.
            Ranked-Pool und Siege-Cup-Rotation werden getrennt geführt.
          </p>
        </div>
        <div className="head-figs">
          <span><b>{MAPS.filter((m) => m.ranked).length}</b> Ranked</span>
          <span><b>{MAPS.filter((m) => m.siegeCup).length}</b> Cup</span>
          <span><b>{BASE_TACTICS.length}</b> Taktiken</span>
        </div>
      </div>

      <div className="toolbar">
        <input className="input search" placeholder="Karte suchen (z. B. Kafe, Villa) …" value={q} onChange={(e) => setQ(e.target.value)} />
        <div className="pill-group">
          {(['alle', 'ranked', 'cup', 'pro'] as Filter[]).map((f) => (
            <button key={f} className={filter === f ? 'on' : ''} onClick={() => setFilter(f)}>
              {f === 'alle' ? 'Alle' : f === 'ranked' ? 'Ranked' : f === 'cup' ? 'Siege Cup' : 'Pro-Pool'}
            </button>
          ))}
        </div>
        <span className="spacer" />
        <span className="mono xsmall faint">
          {BASE_TACTICS.filter((t) => t.side === 'defense').length} DEF / {BASE_TACTICS.filter((t) => t.side === 'attack').length} ATK
        </span>
      </div>

      <div className="section-head">
        <h2>Ranked Pool</h2>
        <span className="spacer" />
        <span className="small faint">Stand {new Date(META.rankedPoolUpdated).toLocaleDateString('de-DE')} · {ranked.length} Karten</span>
      </div>
      <div className="maptiles">{ranked.map((m) => <MapTile key={m.slug} map={m} />)}</div>

      {cupOnly.length > 0 && (
        <>
          <div className="section-head"><h2>Nur im Siege Cup</h2></div>
          <div className="maptiles">{cupOnly.map((m) => <MapTile key={m.slug} map={m} />)}</div>
        </>
      )}

      {others.length > 0 && (
        <>
          <div className="section-head">
            <h2>Weitere Karten</h2>
            <span className="spacer" />
            <span className="small faint">nicht in Ranked / Cup aktiv</span>
          </div>
          <div className="maptiles">{others.map((m) => <MapTile key={m.slug} map={m} />)}</div>
        </>
      )}

      <div className="section-head">
        <h2>Archiv – nicht im Ranked-Pool</h2>
      </div>
      <div className="card">
        <p className="small muted" style={{ marginTop: 0 }}>{META.archiveNote}</p>
        <div className="row-tight">
          {META.archivePool.map((slug) => (
            <span key={slug} className="chip">{getMap(slug)?.name ?? slug.replace(/-/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase())}</span>
          ))}
        </div>
      </div>

      <div className="section-head">
        <h2>Siege Cup – Rotation</h2>
      </div>
      <div className="card">
        <p className="small muted" style={{ marginTop: 0 }}>
          <b>{META.siegeCup.rotationLabel}.</b> {META.siegeCup.note}
        </p>
        <div className="row-tight">
          {META.siegeCup.maps.map((s) => {
            const m = getMap(s);
            return m ? <Link className="chip def" key={s} to={`/map/${s}`}>{m.name}</Link> : null;
          })}
        </div>
        <p className="xsmall faint" style={{ margin: '8px 0 0' }}>Quelle: {META.siegeCup.source}</p>
      </div>
    </div>
  );
}
