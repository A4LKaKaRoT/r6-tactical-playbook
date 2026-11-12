/**
 * Asset-Pfade – GitHub-Pages-safe.
 * `import.meta.env.BASE_URL` entspricht der `base` aus vite.config.ts
 * (z. B. "/" lokal oder "/r6-tactical-playbook/" auf GitHub Pages).
 */
const BASE = import.meta.env.BASE_URL.replace(/\/$/, '');

export function assetUrl(path: string): string {
  const clean = path.replace(/^\//, '');
  return `${BASE}/${clean}`;
}

export function mapFloorUrl(mapSlug: string, floor: string): string {
  return assetUrl(`maps/${mapSlug}/floor-${floor}.webp`);
}

export function mapKeyartUrl(mapSlug: string): string {
  return assetUrl(`maps/${mapSlug}/keyart.jpg`);
}

const PNG_OPERATORS = new Set(['noor', 'solid-snake']);

export function operatorIconUrl(slug: string): string {
  return assetUrl(`operators/${slug}.${PNG_OPERATORS.has(slug) ? 'png' : 'svg'}`);
}
