import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import type { StoredSettings, TeamSlot, Tactic, UserTactic } from '../types';
import {
  DEFAULT_SETTINGS, getBans, getCustomMarkers, getFavorites, getRecent, getSettings, getUserTactics,
  saveSettings as persistSettings, setBans as persistBans, toggleFavorite as persistFavorite,
  pushRecent as persistRecent, saveUserTactic, deleteUserTactic, importUserTactics,
  type CustomMarkerRecord,
} from './storage';
import teamJson from '../data/metadata/team.json';
import { loadVariants } from './queries';

interface AppState {
  settings: StoredSettings;
  favorites: string[];
  recent: string[];
  bans: string[];
  userTactics: UserTactic[];
  customMarkers: CustomMarkerRecord;
  toggleFavorite: (id: string) => void;
  markRecent: (id: string) => void;
  setBans: (bans: string[]) => void;
  toggleBan: (slug: string) => void;
  updateSettings: (patch: Partial<StoredSettings>) => void;
  saveTactic: (t: Tactic) => void;
  deleteTactic: (id: string) => void;
  importTactics: (list: Tactic[]) => void;
  reloadCustomMarkers: () => void;
  resetAll: () => void;
}

const teamDefaults: TeamSlot[] = (teamJson as { players: TeamSlot[] }).players;

const initialSettings: StoredSettings = {
  ...DEFAULT_SETTINGS,
  teamName: (teamJson as { teamName: string }).teamName,
  players: teamDefaults,
};

const AppCtx = createContext<AppState | null>(null);

export function AppProvider({ children }: { children: ReactNode }) {
  const [settings, setSettings] = useState<StoredSettings>(() => {
    const stored = getSettings();
    return {
      ...initialSettings,
      ...stored,
      players: stored.players.length === 5 ? stored.players : initialSettings.players,
    };
  });
  const [favorites, setFavorites] = useState<string[]>(() => getFavorites());
  const [recent, setRecent] = useState<string[]>(() => getRecent());
  const [bans, setBansState] = useState<string[]>(() => getBans());
  const [userTactics, setUserTactics] = useState<UserTactic[]>(() => getUserTactics());
  const [customMarkers, setCustomMarkers] = useState<CustomMarkerRecord>(() => getCustomMarkers());

  useEffect(() => { persistSettings(settings); }, [settings]);

  // Varianten (aggressiv/defensiv/Ban-Alternative) liegen in einem eigenen Chunk
  // und werden nach dem ersten Rendern nachgeladen – blockiert den Start nicht.
  useEffect(() => {
    void loadVariants();
  }, []);

  const toggleFavorite = useCallback((id: string) => setFavorites(persistFavorite(id)), []);
  const markRecent = useCallback((id: string) => setRecent(persistRecent(id)), []);
  const setBans = useCallback((next: string[]) => {
    persistBans(next);
    setBansState(next);
  }, []);
  const toggleBan = useCallback((slug: string) => {
    setBansState((prev) => {
      const next = prev.includes(slug) ? prev.filter((x) => x !== slug) : [...prev, slug];
      persistBans(next);
      return next;
    });
  }, []);
  const updateSettings = useCallback((patch: Partial<StoredSettings>) => {
    setSettings((prev) => ({ ...prev, ...patch }));
  }, []);
  const saveTactic = useCallback((t: Tactic) => setUserTactics(saveUserTactic(t)), []);
  const deleteTacticCb = useCallback((id: string) => setUserTactics(deleteUserTactic(id)), []);
  const importTactics = useCallback((list: Tactic[]) => setUserTactics(importUserTactics(list)), []);
  const reloadCustomMarkers = useCallback(() => setCustomMarkers(getCustomMarkers()), []);
  const resetAll = useCallback(() => {
    try {
      Object.keys(localStorage)
        .filter((k) => k.startsWith('r6pb.'))
        .forEach((k) => localStorage.removeItem(k));
    } catch { /* ignore */ }
    setFavorites([]);
    setRecent([]);
    setBansState([]);
    setUserTactics([]);
    setSettings(initialSettings);
    setCustomMarkers({});
  }, []);

  const value = useMemo<AppState>(() => ({
    settings, favorites, recent, bans, userTactics, customMarkers,
    toggleFavorite, markRecent, setBans, toggleBan, updateSettings,
    saveTactic, deleteTactic: deleteTacticCb, importTactics, reloadCustomMarkers, resetAll,
  }), [settings, favorites, recent, bans, userTactics, customMarkers, toggleFavorite, markRecent,
    setBans, toggleBan, updateSettings, saveTactic, deleteTacticCb, importTactics, reloadCustomMarkers, resetAll]);

  return <AppCtx.Provider value={value}>{children}</AppCtx.Provider>;
}

export function useApp(): AppState {
  const ctx = useContext(AppCtx);
  if (!ctx) throw new Error('useApp muss innerhalb von AppProvider verwendet werden');
  return ctx;
}

/** Spielername für einen Slot (editiert in den Einstellungen). */
export function usePlayerName() {
  const { settings } = useApp();
  return (slot: number): string =>
    settings.players.find((p) => p.slot === slot)?.name || `Spieler ${slot}`;
}
