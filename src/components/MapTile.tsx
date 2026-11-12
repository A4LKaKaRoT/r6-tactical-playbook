import { Link } from 'react-router-dom';
import type { MapInfo } from '../types';
import { mapKeyartUrl } from '../lib/paths';
import { BASE_TACTICS, CORE_TACTICS } from '../lib/queries';
import { useTacticsVersion } from '../lib/useTactics';

interface Props {
  map: MapInfo;
  to?: string;
  showCounts?: boolean;
}

export default function MapTile({ map, to, showCounts = true }: Props) {
  useTacticsVersion();
  const core = CORE_TACTICS.filter((t) => t.map === map.slug).length;
  const total = BASE_TACTICS.filter((t) => t.map === map.slug).length;
  const defCount = BASE_TACTICS.filter((t) => t.map === map.slug && t.side === 'defense').length;
  const atkCount = BASE_TACTICS.filter((t) => t.map === map.slug && t.side === 'attack').length;

  return (
    <Link
      className="maptile"
      to={to ?? `/map/${map.slug}`}
      title={`${map.name}: ${total} Taktiken (${core} Standardpläne, ${defCount} Verteidigung / ${atkCount} Angriff)`}
    >
      <span className="maptile-media">
        <img src={mapKeyartUrl(map.slug)} alt={`${map.name} Vorschau`} loading="lazy" />
        <span className="maptile-flag">
          {map.ranked && <span className="chip atk">Ranked</span>}
          {map.siegeCup && <span className="chip def">Cup</span>}
          {map.pro && <span className="chip intel">Pro</span>}
        </span>
      </span>
      <span className="maptile-body">
        <strong>{map.name}</strong>
        <span className="mt-stats">
          {showCounts
            ? <>{core} Standard · {defCount} DEF / {atkCount} ATK</>
            : map.location}
        </span>
      </span>
    </Link>
  );
}
