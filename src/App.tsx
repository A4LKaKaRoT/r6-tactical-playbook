import { useEffect, useState } from 'react';
import { BrowserRouter, NavLink, Route, Routes, useLocation } from 'react-router-dom';
import { AppProvider, useApp } from './lib/store';
import { META } from './lib/queries';

import Home from './pages/Home';
import Maps from './pages/Maps';
import SideList from './pages/SideList';
import SideSelect from './pages/SideSelect';
import SiteFlow from './pages/SiteFlow';
import TacticDetail from './pages/TacticDetail';
import Favorites from './pages/Favorites';
import EditorIndex from './pages/EditorIndex';
import TacticEditor from './pages/TacticEditor';
import Settings from './pages/Settings';
import Tactics from './pages/Tactics';
import QuickMode from './pages/QuickMode';
import GlobalUI from './components/GlobalUI';
import UpdateBanner from './components/UpdateBanner';

const NAV = [
  { to: '/', label: 'Start', end: true },
  { to: '/maps', label: 'Karten' },
  { to: '/attack', label: 'Angriff' },
  { to: '/defense', label: 'Verteidigung' },
  { to: '/tactics', label: 'Taktiken' },
  { to: '/favorites', label: 'Favoriten' },
  { to: '/editor', label: 'Editor' },
  { to: '/settings', label: 'Einstellungen' },
];

function NotFound() {
  return (
    <div>
      <div className="hero-kicker">Fehler 404</div>
      <h1>Seite nicht gefunden</h1>
      <p className="muted">Die Adresse existiert nicht (mehr).</p>
      <a className="btn" href={import.meta.env.BASE_URL}>Zur Startseite</a>
    </div>
  );
}

function Chrome({ children }: { children: React.ReactNode }) {
  const { settings, favorites, bans } = useApp();
  const [open, setOpen] = useState(false);
  const location = useLocation();

  // Menü schließen, wenn die Route wechselt (Zurück-Button, Deep-Link)
  useEffect(() => { setOpen(false); }, [location.pathname]);

  return (
    <div className="app">
      <header className="topbar">
        <div className="topbar-inner">
          <NavLink to="/" className="brand" onClick={() => setOpen(false)}>
            <span className="brand-mark">R6</span>
            <span>
              <b>Tactical Playbook</b>
              <small>{settings.teamName} · {META.seasonLabel}</small>
            </span>
          </NavLink>

          <button
            className="nav-toggle"
            onClick={() => setOpen((v) => !v)}
            aria-expanded={open}
            aria-label="Navigation öffnen"
          >
            {open ? '✕' : '☰'} Menü
          </button>

          <nav className={`nav${open ? ' open' : ''}`}>
            {NAV.map((n, i) => (
              <NavLink
                key={`${n.to}-${i}`}
                to={n.to}
                end={n.end}
                onClick={() => setOpen(false)}
                className={({ isActive }) => (isActive ? 'active' : '')}
              >
                {n.label}
              </NavLink>
            ))}
            <NavLink to="/quick" onClick={() => setOpen(false)} className={({ isActive }) => `nav-quick${isActive ? ' active' : ''}`}>
              Schnellmodus
            </NavLink>
          </nav>
        </div>
      </header>

      {/* Statuszeile: echte Betriebsdaten statt Deko */}
      <div className="quickbar">
        <div className="quickbar-inner">
          <span className="qb-meta"><b>{META.operation}</b> · {META.seasonLabel} · Meta {new Date(META.lastUpdated).toLocaleDateString('de-DE')}</span>
          <span>★ {favorites.length} Fav</span>
          <span className={bans.length ? 'chip warn' : 'chip'}>{bans.length ? `${bans.length} Bans` : 'Keine Bans'}</span>
          <span className="spacer" />
          <NavLink to="/quick">Mid-Match? → Schnellmodus</NavLink>
        </div>
      </div>

      <main className={`page${location.pathname === '/' ? ' page-home' : ''}`}>
        <UpdateBanner />
        {children}
      </main>
      <GlobalUI />

      <footer className="footer">
        <div className="footer-inner">
          <span>INOFFIZIELLES FAN-PROJEKT · NICHT MIT UBISOFT VERBUNDEN</span>
          <span>BLUEPRINTS: SIEGESTRATS.COM · ICONS: R6OPERATORS (MIT)</span>
          <span className="spacer" />
          <span>
            META {META.metaVersion} · TAKTIK {META.tacticVersion} · KARTEN {META.mapVersion}
            {settings.teamName ? ` · ${settings.teamName.toUpperCase()}` : ''}
          </span>
        </div>
      </footer>
    </div>
  );
}

export default function App() {
  return (
    <AppProvider>
      <BrowserRouter basename={import.meta.env.BASE_URL.replace(/\/$/, '')}>
        <Chrome>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/maps" element={<Maps />} />
            <Route path="/attack" element={<SideList side="attack" />} />
            <Route path="/defense" element={<SideList side="defense" />} />
            <Route path="/quick" element={<QuickMode />} />
            <Route path="/map/:mapSlug" element={<SideSelect side="defense" />} />
            <Route path="/map/:mapSlug/attack" element={<SideSelect side="attack" />} />
            <Route path="/map/:mapSlug/defense" element={<SideSelect side="defense" />} />
            <Route path="/map/:mapSlug/:side/:siteId" element={<SiteFlow />} />
            <Route path="/tactic/:tacticId" element={<TacticDetail />} />
            <Route path="/tactics" element={<Tactics />} />
            <Route path="/favorites" element={<Favorites />} />
            <Route path="/editor" element={<EditorIndex />} />
            <Route path="/editor/new" element={<TacticEditor />} />
            <Route path="/editor/:tacticId" element={<TacticEditor />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Chrome>
      </BrowserRouter>
    </AppProvider>
  );
}
