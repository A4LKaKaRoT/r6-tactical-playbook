/* =========================================================================
 * R6 Tactical Playbook – zentrale Typen
 * Alle JSON-Dateien werden gegen diese Typen validiert (src/lib/validate.ts).
 * Fehlerhafte Taktiken werden markiert und ignoriert, statt die App zu crashen.
 * ========================================================================= */

export type Side = 'attack' | 'defense';
export type Floor = 'B' | '1F' | '2F' | '3F';
export type Role =
  | 'Anchor'
  | 'Flex-Anchor'
  | 'Roamer'
  | 'Deep-Roamer'
  | 'Support-Roamer'
  | 'Utility-Support'
  | 'Hard-Breach'
  | 'Soft-Breach'
  | 'Entry'
  | 'Support'
  | 'Intel'
  | 'Flank-Watch'
  | 'Vertical';

export type Difficulty = 'niedrig' | 'mittel' | 'hoch';
export type Confidence = 'verifiziert' | 'community' | 'eigene-analyse';
export type TacticStyle = 'standard' | 'aggressiv' | 'defensiv' | 'anti-ban';

/* ------------------------------------------------------------------ Meta */
export interface GameMeta {
  schemaVersion: number;
  game: string;
  year: number;
  season: number;
  /** Kurzlabel wie "Y11S3" (Jahr 11 = 2026). */
  seasonLabel: string;
  operation: string;
  operationLaunch: string;
  midSeasonPatch: string;
  lastUpdated: string;
  metaVersion: string;
  tacticVersion: string;
  mapVersion: string;
  rankedPool: string[];
  proPool: string[];
  rankedPoolUpdated: string;
  proPoolUpdated: string;
  siegeCup: { rotationLabel: string; maps: string[]; note: string; source: string };
  archivePool: string[];
  archiveNote?: string;
  balanceHighlights: { date: string; topic: string; change: string; source: string }[];
  sources: { label: string; url: string }[];
  /** Versionshistorie des Projekts (nicht der Spiel-Balance). */
  projectChangelog?: { version: string; date: string; changes: string[] }[];
}

/* ------------------------------------------------------------------ Maps */
export interface BombSite {
  id: string;
  name: string;
  floors: Floor[];
  short: string;
}

/** Angreifer-Spawn mit Position auf dem Blueprint (Prozent-Koordinaten). */
export interface Spawn {
  name: string;
  floor: Floor;
  x: number;
  y: number;
}

/** Callout / Raumbereich auf dem Blueprint (Prozent-Koordinaten). */
export interface Landmark {
  id: string;
  floor: Floor;
  x: number;
  y: number;
  label: string;
}

export interface MapChoke {
  area: string;
  floor: Floor;
  x: number;
  y: number;
  note?: string;
}

export interface MapInfo {
  slug: string;
  name: string;
  location: string;
  floors: Floor[];
  bombSites: BombSite[];
  spawns: Spawn[];
  landmarks?: Landmark[];
  chokePoints?: MapChoke[];
  callouts: string[];
  ranked: boolean;
  siegeCup: boolean;
  pro: boolean;
  notes?: string;
  updated: string;
}

/* -------------------------------------------------------------- Operators */
export interface Weapon {
  name: string;
  type: 'Primär' | 'Sekundär';
  note?: string;
}

export interface Operator {
  slug: string;
  name: string;
  role: Side;
  org: string;
  squad: string;
  speed: 1 | 2 | 3;
  health: 1 | 2 | 3;
  difficulty: 1 | 2 | 3;
  ability: { name: string; description: string };
  weapons: Weapon[];
  gadgets: string[];
  tags: string[];
  source: 'r6operators' | 'ubisoft' | 'community';
  updated: string;
}

/* ----------------------------------------------------------------- Taktik */
export type ObjectiveKey =
  | 'anchor'
  | 'roam'
  | 'support'
  | 'antiEntry'
  | 'plantDenial'
  | 'hardBreach'
  | 'softBreach'
  | 'intel'
  | 'flankWatch'
  | 'vertical'
  | 'entry'
  | 'retake'
  | 'postPlant'
  | 'breach'
  | 'utility';

export interface Marker {
  floor: Floor;
  x: number;
  y: number;
  kind: 'position' | 'gadget' | 'angle' | 'plant' | 'spawn' | 'rotation' | 'breach';
  label: string;
  toFloor?: Floor;
  toX?: number;
  toY?: number;
}

export interface PlayerSlot {
  slot: number;
  playerName: string;
  operator: string;
  role: Role;
  tagline: string;
  pickReason: string;
  keyAbility: string;
  loadout: { primary: string; secondary: string; gadget: string };
  objectives: ObjectiveKey[];
  prep: string[];
  action: string[];
  markers: Marker[];
}

export interface Substitute {
  operator: string;
  for: string;
  role: Role;
  reason: string;
  takesOver: string[];
  setupChange: string;
  weakness: string;
}

export interface TacticRatings {
  competitive: 1 | 2 | 3 | 4 | 5;
  difficulty: Difficulty;
  utilityDependency: Difficulty;
  coordination: Difficulty;
  strengths: string[];
  weaknesses: string[];
}

export interface AttackPlan {
  spawn: string;
  spawnFloor: Floor;
  spawnX: number;
  spawnY: number;
  entryRoute: string[];
  drones: string[];
  execute: string[];
  plant: { floor: Floor; x: number; y: number; spot: string; cover: string };
  postPlant: string[];
  alt: { spawn: string; why: string; alternativePush: string };
}

export interface Tactic {
  id: string;
  map: string;
  site: string;
  side: Side;
  name: string;
  style: TacticStyle;
  summary: string;
  confidence: Confidence;
  updated: string;
  ratings: TacticRatings;
  players: PlayerSlot[];
  substitutes: Substitute[];
  attackPlan?: AttackPlan;
  defensePlan?: { retake: string[]; roamPlan: string[] };
  notes?: string;
  /** ID des Basisplans, aus dem diese Variante abgeleitet wurde. */
  derivedFrom?: string;
  userCreated?: boolean;
  createdAt?: string;
}

/* ------------------------------------------------------------- Team/Meta */
export interface TeamSlot {
  slot: number;
  name: string;
  preferredRoles: Role[];
  note?: string;
}

export interface StoredSettings {
  teamName: string;
  players: TeamSlot[];
  quickMode: boolean;
  showGrid: boolean;
  mapOpacity: number;
}

export interface UserTactic extends Tactic {
  userCreated: true;
}

export interface ValidationIssue {
  file: string;
  path: string;
  message: string;
  severity: 'error' | 'warning';
}
