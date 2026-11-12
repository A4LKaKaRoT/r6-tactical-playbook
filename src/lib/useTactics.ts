import { useSyncExternalStore } from 'react';
import { getTacticsVersion, subscribeTactics } from './queries';

/**
 * Abonniert den Taktik-Datenstand. Nötig für Komponenten, die direkt
 * `BASE_TACTICS` lesen: die Varianten kommen nachgeladen aus einem eigenen
 * Chunk, nach dem Laden rendert dieser Hook die Ansicht neu.
 */
export function useTacticsVersion(): number {
  return useSyncExternalStore(subscribeTactics, getTacticsVersion, getTacticsVersion);
}
