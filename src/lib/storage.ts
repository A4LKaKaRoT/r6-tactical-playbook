/**
 * Persistenz im Browser (localStorage).
 * Es gibt bewusst kein Backend – alle eigenen Taktiken, Favoriten und
 * Einstellungen bleiben lokal im Browser bzw. werden als JSON exportiert.
 */
import type { StoredSettings, TeamSlot, Tactic, UserTactic } from '../types';

const NS = 'r6pb.v1';

const KEY = {
  favorites: `${NS}.favorites`,
  recent: `${NS}.recent`,
  userTactics: `${NS}.userTactics`,
  settings: `${NS}.settings`,
  bans: `${NS}.bans`,
  customMarkers: `${NS}.customMarkers`,
};

function read<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return fallback;
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

function write(key: string, value: unknown): void {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    /* Speicher voll / privater Modus – App darf nicht abstürzen */
  }
}

/* ------------------------------------------------------------- Favoriten */
export function getFavorites(): string[] {
  const v = read<unknown>(KEY.favorites, []);
  return Array.isArray(v) ? (v.filter((x) => typeof x === 'string') as string[]) : [];
}
export function toggleFavorite(id: string): string[] {
  const current = getFavorites();
  const next = current.includes(id) ? current.filter((x) => x !== id) : [id, ...current];
  write(KEY.favorites, next);
  return next;
}

/* ------------------------------------------------------- Zuletzt benutzt */
export function getRecent(): string[] {
  const v = read<unknown>(KEY.recent, []);
  return Array.isArray(v) ? (v.filter((x) => typeof x === 'string') as string[]) : [];
}
export function pushRecent(id: string): string[] {
  const next = [id, ...getRecent().filter((x) => x !== id)].slice(0, 12);
  write(KEY.recent, next);
  return next;
}

/* --------------------------------------------------------- Eigene Taktiken */
export function getUserTactics(): UserTactic[] {
  const v = read<unknown>(KEY.userTactics, []);
  return Array.isArray(v) ? (v as UserTactic[]) : [];
}
export function saveUserTactic(tactic: Tactic): UserTactic[] {
  const current = getUserTactics();
  const entry: UserTactic = { ...tactic, userCreated: true, createdAt: new Date().toISOString() };
  const idx = current.findIndex((t) => t.id === tactic.id);
  const next = idx >= 0 ? current.map((t) => (t.id === tactic.id ? entry : t)) : [entry, ...current];
  write(KEY.userTactics, next);
  return next;
}
export function deleteUserTactic(id: string): UserTactic[] {
  const next = getUserTactics().filter((t) => t.id !== id);
  write(KEY.userTactics, next);
  return next;
}
export function importUserTactics(tactics: Tactic[]): UserTactic[] {
  let all = getUserTactics();
  for (const t of tactics) {
    const entry: UserTactic = { ...t, userCreated: true, createdAt: new Date().toISOString() };
    all = [entry, ...all.filter((x) => x.id !== t.id)];
  }
  write(KEY.userTactics, all);
  return all;
}

/* ---------------------------------------------------------- Einstellungen */
export const DEFAULT_SETTINGS: StoredSettings = {
  teamName: 'Unsere Roster',
  players: [],
  quickMode: false,
  showGrid: false,
  mapOpacity: 1,
};

export function getSettings(): StoredSettings {
  const v = read<Partial<StoredSettings>>(KEY.settings, {});
  return {
    ...DEFAULT_SETTINGS,
    ...v,
    players: Array.isArray(v.players) ? (v.players as TeamSlot[]) : [],
  };
}
export function saveSettings(s: StoredSettings): void {
  write(KEY.settings, s);
}

/* ----------------------------------------------------------------- Bans */
export function getBans(): string[] {
  const v = read<unknown>(KEY.bans, []);
  return Array.isArray(v) ? (v.filter((x) => typeof x === 'string') as string[]) : [];
}
export function setBans(bans: string[]): void {
  write(KEY.bans, bans);
}

/* ------------------------------------------------------- Eigene Marker */
export interface CustomMarkerRecord {
  [tacticId: string]: { floor: string; x: number; y: number; label: string; kind: string }[];
}
export function getCustomMarkers(): CustomMarkerRecord {
  return read<CustomMarkerRecord>(KEY.customMarkers, {});
}
export function addCustomMarker(
  tacticId: string,
  marker: { floor: string; x: number; y: number; label: string; kind: string },
): CustomMarkerRecord {
  const all = getCustomMarkers();
  all[tacticId] = [...(all[tacticId] || []), marker];
  write(KEY.customMarkers, all);
  return all;
}
export function clearCustomMarkers(tacticId: string): CustomMarkerRecord {
  const all = getCustomMarkers();
  delete all[tacticId];
  write(KEY.customMarkers, all);
  return all;
}
