/* Farbpalette pro Spieler-Slot. Bewusst getrennt von den Marker-Typ-Farben. */
export const PLAYER_COLORS = ['#ffb020', '#57c7ff', '#a97bff', '#ff7a59', '#5ce0a8'];

export const PLAYER_COLOR_NAMES = ['Gelb', 'Blau', 'Violett', 'Orange', 'Grün'];

export function playerColor(slot: number): string {
  return PLAYER_COLORS[(slot - 1) % PLAYER_COLORS.length];
}

export const MARKER_KINDS: { key: string; label: string; color: string; short: string }[] = [
  { key: 'position', label: 'Position (weiß)', color: '#cfd6d9', short: 'POS' },
  { key: 'gadget', label: 'Gadget (gelb)', color: '#e8c03f', short: 'GAD' },
  { key: 'angle', label: 'Winkel (weiß)', color: '#ffffff', short: 'ANG' },
  { key: 'rotation', label: 'Rotation (grün)', color: '#46c08a', short: 'ROT' },
  { key: 'plant', label: 'Plant (orange)', color: '#f06a3a', short: 'PLT' },
  { key: 'breach', label: 'Breach (rot)', color: '#e8463f', short: 'BRH' },
  { key: 'spawn', label: 'Spawn (blau)', color: '#3d8ee8', short: 'SPN' },
];

export function markerColor(kind: string): string {
  return MARKER_KINDS.find((k) => k.key === kind)?.color ?? '#cfd6d9';
}
