import { useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { BASE_TACTICS, MAPS, getMap } from '../lib/queries';
import { useTacticsVersion } from '../lib/useTactics';
import { useApp } from '../lib/store';
import { validateTactic } from '../lib/validate';

export default function EditorIndex() {
  useTacticsVersion();
  const { userTactics, deleteTactic, importTactics, saveTactic } = useApp();
  const nav = useNavigate();
  const fileRef = useRef<HTMLInputElement>(null);
  const [msg, setMsg] = useState<string | null>(null);

  function copy(tacticId: string) {
    const t = userTactics.find((x) => x.id === tacticId);
    if (!t) return;
    const copyTactic = {
      ...t,
      id: `${t.id}-kopie-${Date.now().toString(36)}`,
      name: `${t.name} (Kopie)`,
    };
    saveTactic(copyTactic);
    setMsg('Kopie erstellt – jetzt bearbeiten.');
    nav(`/editor/${copyTactic.id}`);
  }

  function exportAll() {
    const payload = { schemaVersion: 1, exported: new Date().toISOString(), tactics: userTactics };
    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `r6pb-eigene-taktiken-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  }

  async function onImport(file: File) {
    try {
      const text = await file.text();
      const parsed: unknown = JSON.parse(text);
      const list = Array.isArray(parsed) ? parsed : (parsed as { tactics?: unknown[] })?.tactics;
      if (!Array.isArray(list)) { setMsg('Import fehlgeschlagen: keine Taktik-Liste gefunden.'); return; }
      const valid = [];
      const errors: string[] = [];
      for (const [i, raw] of list.entries()) {
        const { tactic, issues } = validateTactic(raw, `import[${i}]`);
        if (tactic) valid.push(tactic);
        else errors.push(`Eintrag ${i + 1}: ${issues.filter((x) => x.severity === 'error').map((x) => x.message).join(', ')}`);
      }
      if (valid.length) importTactics(valid);
      setMsg(`${valid.length} Taktik(en) importiert${errors.length ? ` – ${errors.length} fehlerhaft übersprungen: ${errors.slice(0, 3).join(' | ')}` : ''}.`);
    } catch (e) {
      setMsg(`Import fehlgeschlagen: ${(e as Error).message}`);
    }
  }

  return (
    <div>
      <div className="breadcrumbs"><Link to="/">Start</Link><span className="sep">/</span><span>Editor</span></div>
      <div className="row" style={{ alignItems: 'flex-end', marginBottom: 12 }}>
        <div style={{ flex: '1 1 340px' }}>
          <div className="row-tight" style={{ marginBottom: 3 }}>
            <span className="chip">{userTactics.length} eigene Taktiken</span>
          </div>
          <h1>Taktik-Editor</h1>
          <p className="muted" style={{ margin: 0 }}>
            Eigene Taktiken anlegen, kopieren, löschen, als JSON exportieren/importieren. Eigene Taktiken liegen lokal im
            Browser und überschreiben bei gleicher ID die eingebaute Taktik.
          </p>
        </div>
        <div className="row-tight">
          <Link className="btn btn-primary" to="/editor/new">+ Neue Taktik</Link>
          <button className="btn" onClick={exportAll} disabled={!userTactics.length}>Alle exportieren</button>
          <button className="btn" onClick={() => fileRef.current?.click()}>JSON importieren</button>
          <input
            ref={fileRef}
            type="file"
            accept="application/json,.json"
            style={{ display: 'none' }}
            onChange={(e) => { const f = e.target.files?.[0]; if (f) void onImport(f); e.target.value = ''; }}
          />
        </div>
      </div>

      {msg && <div className="infobox" style={{ marginBottom: 12 }}>{msg}</div>}

      {userTactics.length === 0 ? (
        <div className="card">
          <p style={{ marginTop: 0 }}>Noch keine eigenen Taktiken.</p>
          <p className="small muted">
            Neue Taktik über <Link to="/editor/new">+ Neue Taktik</Link> – oder eine vorhandene Taktik öffnen und dort
            „Bearbeiten“ wählen (erzeugt eine bearbeitbare Kopie).
          </p>
        </div>
      ) : (
        <div className="card scroll-x">
          <div className="table-scroll">
          <table className="table">
            <thead><tr><th>Name</th><th>Karte</th><th>Seite</th><th>Site</th><th>Picks</th><th>Erstellt</th><th /></tr></thead>
            <tbody>
              {userTactics.map((t) => (
                <tr key={t.id}>
                  <td><Link to={`/tactic/${t.id}`} style={{ color: 'var(--text)', fontWeight: 600 }}>{t.name}</Link></td>
                  <td className="muted">{getMap(t.map)?.name ?? t.map}</td>
                  <td><span className={`chip ${t.side === 'attack' ? 'atk' : 'def'}`}>{t.side === 'attack' ? 'ATK' : 'DEF'}</span></td>
                  <td className="muted">{t.site}</td>
                  <td className="xsmall muted">{t.players.map((p) => p.operator).join(', ')}</td>
                  <td className="xsmall muted">{t.createdAt ? new Date(t.createdAt).toLocaleDateString('de-DE') : '–'}</td>
                  <td>
                    <div className="row-tight">
                      <Link className="btn btn-sm" to={`/editor/${t.id}`}>bearbeiten</Link>
                      <button className="btn btn-sm" onClick={() => copy(t.id)}>kopieren</button>
                      <button
                        className="btn btn-sm btn-danger"
                        onClick={() => { if (window.confirm(`„${t.name}“ wirklich löschen?`)) deleteTactic(t.id); }}
                      >
                        löschen
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          </div>
        </div>
      )}

      <div className="section-head"><h2>Vorlagen: eingebaute Taktik als Startpunkt</h2></div>
      <p className="small muted" style={{ marginTop: 0 }}>
        Wähle Karte, Seite und Site – der Editor erzeugt daraus eine eigene Taktik mit sinnvollen Standardwerten,
        die Du frei änderst.
      </p>
      <div className="grid" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(min(230px, 100%), 1fr))' }}>
        {MAPS.sort((a, b) => a.name.localeCompare(b.name, 'de')).map((m) => (
          <div className="card tight" key={m.slug}>
            <div className="panel-title"><strong>{m.name}</strong></div>
            <div className="row-tight">
              {m.bombSites.map((s) => {
                const defT = BASE_TACTICS.find((t) => t.map === m.slug && t.site === s.id && t.side === 'defense');
                const atkT = BASE_TACTICS.find((t) => t.map === m.slug && t.site === s.id && t.side === 'attack');
                const q = (side: 'defense' | 'attack', from?: string) =>
                  `/editor/new?map=${m.slug}&site=${s.id}&side=${side}${from ? `&from=${from}` : ''}`;
                return (
                  <span key={s.id} className="row-tight" style={{ gap: 3 }}>
                    <Link className="chip def" to={q('defense', defT?.id)} title={`Verteidigung ${s.short}${defT ? ' – aus Vorlage' : ''}`}>DEF {s.short}</Link>
                    <Link className="chip atk" to={q('attack', atkT?.id)} title={`Angriff ${s.short}${atkT ? ' – aus Vorlage' : ''}`}>ATK {s.short}</Link>
                  </span>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
