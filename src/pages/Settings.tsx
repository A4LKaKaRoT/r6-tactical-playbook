import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { BASE_TACTICS, CORE_TACTICS, DEFAULT_TACTICS, DROPPED_TACTICS, VARIANT_TACTICS, issueSummary, MAPS, META, OPERATORS, TACTIC_ISSUES } from '../lib/queries';
import { useTacticsVersion } from '../lib/useTactics';
import { useApp } from '../lib/store';
import teamJson from '../data/metadata/team.json';
import type { TeamSlot } from '../types';
import { applyUpdateAndReload, offlineStatus } from '../lib/pwa';

export default function Settings() {
  useTacticsVersion();
  const { settings, updateSettings, bans, setBans, resetAll, userTactics, favorites } = useApp();
  const [msg, setMsg] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);
  const [showIssues, setShowIssues] = useState(false);
  const [offline, setOffline] = useState<{ supported: boolean; active: boolean }>({ supported: false, active: false });
  useEffect(() => { void offlineStatus().then(setOffline); }, []);

  const setPlayerName = (slot: number, name: string) => {
    const players = settings.players.map((p) => (p.slot === slot ? { ...p, name } : p));
    updateSettings({ players });
  };
  const resetTeam = () => {
    updateSettings({ players: (teamJson as { players: TeamSlot[] }).players, teamName: (teamJson as { teamName: string }).teamName });
    setMsg('Roster auf Standard zurückgesetzt.');
  };

  async function onImportTeam(file: File) {
    try {
      const data = JSON.parse(await file.text()) as { teamName?: string; players?: TeamSlot[] };
      if (!data.players || data.players.length !== 5) throw new Error('5 Spieler erwartet');
      updateSettings({ teamName: data.teamName || settings.teamName, players: data.players });
      setMsg('Roster importiert.');
    } catch (e) {
      setMsg(`Import fehlgeschlagen: ${(e as Error).message}`);
    }
  }

  function exportBackup() {
    const payload = {
      schemaVersion: 1,
      exported: new Date().toISOString(),
      settings,
      favorites,
      bans,
      userTactics,
    };
    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `r6pb-backup-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <div>
      <div className="breadcrumbs"><Link to="/">Start</Link><span className="sep">/</span><span>Einstellungen</span></div>
      <h1>Einstellungen</h1>

      {msg && <div className="okbox" style={{ marginBottom: 12 }}>{msg}</div>}

      <div className="grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(min(320px, 100%), 1fr))' }}>
        <div className="card">
          <div className="panel-title"><strong>Roster</strong><button className="btn btn-sm" onClick={resetTeam}>Standard</button></div>
          <label className="field" style={{ marginBottom: 8 }}>Teamname
            <input className="input" value={settings.teamName} onChange={(e) => updateSettings({ teamName: e.target.value })} />
          </label>
          {settings.players.map((p) => (
            <div className="row" key={p.slot} style={{ marginBottom: 6 }}>
              <span className="chip" style={{ minWidth: 34, justifyContent: 'center' }}>P{p.slot}</span>
              <input className="input" style={{ flex: 1 }} value={p.name} onChange={(e) => setPlayerName(p.slot, e.target.value)} />
              <span className="xsmall faint" style={{ minWidth: 96 }}>{p.preferredRoles.join(', ')}</span>
            </div>
          ))}
          <div className="row-tight" style={{ marginTop: 8 }}>
            <button className="btn btn-sm" onClick={() => fileRef.current?.click()}>Roster importieren</button>
            <input ref={fileRef} type="file" accept="application/json" style={{ display: 'none' }}
              onChange={(e) => { const f = e.target.files?.[0]; if (f) void onImportTeam(f); e.target.value = ''; }} />
            <button className="btn btn-sm" onClick={exportBackup}>Backup exportieren (inkl. Taktiken)</button>
          </div>
        </div>

        <div className="card">
          <div className="panel-title"><strong>Aktive Bans</strong><span className="chip">{bans.length}</span></div>
          <p className="small muted" style={{ marginTop: 0 }}>
            Bans gelten global und werden in jeder Taktik für Ersatzpicks berücksichtigt.
          </p>
          <div className="row-tight">
            {bans.length === 0 && <span className="small faint">Keine Bans gesetzt.</span>}
            {bans.map((b) => (
              <button key={b} className="chip warn" onClick={() => setBans(bans.filter((x) => x !== b))} title="Ban entfernen">
                {OPERATORS.find((o) => o.slug === b)?.name ?? b} ×
              </button>
            ))}
          </div>
          {bans.length > 0 && <button className="btn btn-sm btn-danger" style={{ marginTop: 8 }} onClick={() => setBans([])}>Alle löschen</button>}
        </div>

        <div className="card">
          <div className="panel-title"><strong>Anzeige</strong></div>
          <label className="row-tight small" style={{ marginBottom: 8 }}>
            <input type="checkbox" checked={settings.quickMode} onChange={(e) => updateSettings({ quickMode: e.target.checked })} />
            Schnellansicht auf Site-Seiten standardmäßig aktiv
          </label>
          <label className="row-tight small" style={{ marginBottom: 8 }}>
            <input type="checkbox" checked={settings.showGrid} onChange={(e) => updateSettings({ showGrid: e.target.checked })} />
            Raster über der Karte anzeigen
          </label>
          <label className="field">Karten-Deckkraft ({Math.round(settings.mapOpacity * 100)} %)
            <input type="range" min={0.4} max={1} step={0.05} value={settings.mapOpacity} onChange={(e) => updateSettings({ mapOpacity: Number(e.target.value) })} />
          </label>
          <button className="btn btn-sm btn-danger" style={{ marginTop: 10 }}
            onClick={() => { if (window.confirm('Alle lokalen Daten (Favoriten, eigene Taktiken, Roster, Bans) löschen?')) { resetAll(); setMsg('Alle lokalen Daten gelöscht.'); } }}>
            Alle lokalen Daten löschen
          </button>
        </div>

        <div className="card">
          <div className="panel-title"><strong>Datenbestand</strong></div>
          <dl className="kv">
            <dt>Spielversion</dt><dd>{META.game}</dd>
            <dt>Season</dt><dd>Jahr {META.year}, Season {META.season}</dd>
            <dt>Operation</dt><dd>{META.operation} (Start {new Date(META.operationLaunch).toLocaleDateString('de-DE')})</dd>
            <dt>Mid-Season</dt><dd>{new Date(META.midSeasonPatch).toLocaleDateString('de-DE')}</dd>
            <dt>Letztes Meta</dt><dd>{new Date(META.lastUpdated).toLocaleDateString('de-DE')}</dd>
            <dt>Meta-Version</dt><dd className="mono">{META.metaVersion}</dd>
            <dt>Taktik-Version</dt><dd className="mono">{META.tacticVersion}</dd>
            <dt>Karten-Version</dt><dd className="mono">{META.mapVersion}</dd>
            <dt>Operatoren</dt><dd>{OPERATORS.length}</dd>
            <dt>Karten</dt><dd>{MAPS.length}</dd>
            <dt>Taktiken</dt>
            <dd>
              {BASE_TACTICS.length} eingebaut
              <span className="xsmall faint"> ({CORE_TACTICS.length} Standard + {VARIANT_TACTICS.length} Varianten)</span>
              {' '}+ {userTactics.length} eigene
            </dd>
          </dl>
        </div>
      </div>

      <div className="section-head"><h2>App, Offline &amp; Installation</h2></div>
      <div className="grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(min(280px, 100%), 1fr))' }}>
        <div className="card">
          <div className="panel-title"><strong>Offline-Modus</strong>
            <span className={`chip ${offline.active ? 'intel' : 'warn'}`}>{offline.active ? 'aktiv' : 'nicht aktiv'}</span>
          </div>
          <p className="small muted" style={{ marginTop: 0 }}>
            Nach dem ersten Aufruf speichert ein Service Worker Karten, Taktiken und Bilder lokal.
            Danach startet das Playbook auch ohne Netz (z. B. im Turnier-WLAN).
          </p>
          <ul className="steps small">
            <li>Service Worker: {offline.supported ? 'vom Browser unterstützt' : 'nicht unterstützt'}</li>
            <li>{offline.active ? 'Cache ist eingerichtet.' : 'Cache wird beim ersten Production-Aufruf eingerichtet (nicht im Dev-Modus).'}</li>
            <li>Eigene Taktiken und Favoriten liegen weiter im Browser-Speicher.</li>
          </ul>
          <button className="btn btn-sm" onClick={() => void applyUpdateAndReload()}>App aktualisieren &amp; neu laden</button>
        </div>
        <div className="card">
          <div className="panel-title"><strong>Auf dem Handy installieren</strong><span className="chip">PWA</span></div>
          <ol className="steps small">
            <li><b>Android/Chrome:</b> Menü (⋮) → „App installieren“ bzw. „Zum Startbildschirm hinzufügen“.</li>
            <li><b>iPhone/Safari:</b> Teilen-Symbol → „Zum Home-Bildschirm“.</li>
            <li><b>Desktop:</b> in der Adressleiste auf das Installations-Symbol klicken.</li>
          </ol>
          <p className="xsmall faint" style={{ marginBottom: 0 }}>
            Danach startet das Playbook ohne Browser-Leiste – praktisch für den zweiten Monitor oder das Handy neben dem Rechner.
          </p>
        </div>
      </div>

      <div className="section-head"><h2>Datenprüfung</h2></div>
      <div className="card">
        {TACTIC_ISSUES.length === 0 ? (
          <div className="okbox">
            Alle {BASE_TACTICS.length} Taktik-Datensätze sind valide (Schema, 5 Spieler, Marker, Duplikate geprüft) –
            davon {DEFAULT_TACTICS.length} Standardpläne und {VARIANT_TACTICS.length} Varianten.
          </div>
        ) : (
          <>
            <div className="warnbox">
              {issueSummary().errors} Fehler, {issueSummary().warnings} Warnungen – davon {DROPPED_TACTICS.basis} Taktik(en) nicht geladen.
              Fehlerhafte Taktiken werden übersprungen, die App läuft weiter.
              <button className="btn btn-sm" style={{ marginLeft: 8 }} onClick={() => setShowIssues((v) => !v)}>
                {showIssues ? 'Details ausblenden' : 'Details anzeigen'}
              </button>
            </div>
            {showIssues && (
              <div className="scroll-x" style={{ marginTop: 8 }}>
                <div className="table-scroll">
                <table className="table">
                  <thead><tr><th>Taktik</th><th>Pfad</th><th>Meldung</th><th>Schwere</th></tr></thead>
                  <tbody>
                    {TACTIC_ISSUES.slice(0, 120).map((i, k) => (
                      <tr key={k}><td className="mono xsmall">{i.file}</td><td className="mono xsmall">{i.path}</td><td className="small">{i.message}</td>
                        <td><span className={`chip ${i.severity === 'error' ? 'atk' : 'warn'}`}>{i.severity}</span></td></tr>
                    ))}
                  </tbody>
                </table>
                </div>
              </div>
            )}
          </>
        )}
      </div>

      <div className="section-head"><h2>Changelog &amp; Versionen</h2></div>
      <div className="card scroll-x">
        <div className="table-scroll">
        <table className="table">
          <thead><tr><th>Datum</th><th>Thema</th><th>Änderung</th><th>Quelle</th></tr></thead>
          <tbody>
            {META.balanceHighlights.map((b, i) => (
              <tr key={i}>
                <td className="mono small">{new Date(b.date).toLocaleDateString('de-DE')}</td>
                <td>{b.topic}</td>
                <td className="small muted">{b.change}</td>
                <td className="xsmall faint">{b.source}</td>
              </tr>
            ))}
          </tbody>
        </table>
        </div>
      </div>

      {META.projectChangelog && META.projectChangelog.length > 0 && (
        <>
          <div className="section-head"><h2>Projekt-Changelog</h2></div>
          <div className="card">
            {META.projectChangelog.map((rel) => (
              <div key={rel.version} style={{ marginBottom: 12 }}>
                <div className="row-tight" style={{ marginBottom: 4 }}>
                  <span className="chip intel">v{rel.version}</span>
                  <span className="xsmall faint">{new Date(rel.date).toLocaleDateString('de-DE')}</span>
                </div>
                <ul className="steps small">
                  {rel.changes.map((c, i) => <li key={i}>{c}</li>)}
                </ul>
              </div>
            ))}
          </div>
        </>
      )}

      <div className="section-head"><h2>Quellen</h2></div>
      <div className="card">
        <ul className="steps">
          {META.sources.map((s) => (
            <li key={s.url}>
              {s.label} – <a href={s.url} target="_blank" rel="noreferrer" style={{ color: 'var(--defense)' }}>{s.url}</a>
            </li>
          ))}
        </ul>
      </div>

      <div className="section-head"><h2>Rechtliches &amp; Assets</h2></div>
      <div className="card">
        <p className="small muted">
          Inoffizielles Fan-Projekt, nicht mit Ubisoft verbunden. „Tom Clancy’s Rainbow Six Siege“ und alle
          Operator-/Kartennamen sind Marken von Ubisoft. Die App verwendet:
        </p>
        <ul className="steps small">
          <li><b>Blueprint-Übersichten</b>: aktuelle Layout-Übersichten aus der Community-Datenbank siegestrats.com (nur zur privaten, nicht-kommerziellen Nutzung, Quellenangabe in der Fußzeile).</li>
          <li><b>Operator-Icons</b>: MIT-lizenziertes npm-Paket <code>r6operators</code>. Fehlt ein Icon (z. B. neue Operatoren), zeigt die App automatisch Initialen – Import über <code>scripts/fetch-assets.mjs</code>.</li>
          <li><b>Keyart-Kacheln</b>: offizielle Karten-Keyarts (Ubisoft), nur als Vorschaubild.</li>
        </ul>
        <p className="small muted" style={{ marginBottom: 0 }}>
          Eigene Bilder: Dateien unter <code>public/maps/&lt;map&gt;/floor-&lt;etage&gt;.webp</code> bzw.
          <code> public/operators/&lt;slug&gt;.svg</code> ersetzen. Namensschema siehe README.
        </p>
      </div>
    </div>
  );
}
