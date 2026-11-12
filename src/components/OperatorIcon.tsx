import { useState } from 'react';
import { operatorIconUrl } from '../lib/paths';
import { getOperator } from '../lib/queries';

interface Props {
  slug: string;
  name?: string;
  size?: 'xs' | 'md' | 'lg';
  className?: string;
}

/**
 * Operator-Icon mit Fallback auf Initialen.
 * Icons stammen aus dem MIT-lizenzierten npm-Paket `r6operators`
 * (siehe scripts/fetch-assets.mjs) – keine Ubisoft-Originaldateien.
 */
export default function OperatorIcon({ slug, name, size = 'md', className = '' }: Props) {
  const [broken, setBroken] = useState(false);
  const op = getOperator(slug);
  const label = name || op?.name || slug;
  const cls = size === 'lg' ? 'op-icon lg' : size === 'xs' ? 'op-icon xs' : 'op-icon';
  return (
    <span className={`${cls} ${className}`} title={label} aria-label={label}>
      {broken ? (
        <span className="xsmall mono" style={{ color: 'var(--text-dim)' }}>{label.slice(0, 2).toUpperCase()}</span>
      ) : (
        <img
          src={operatorIconUrl(slug)}
          alt={label}
          loading="lazy"
          onError={() => setBroken(true)}
        />
      )}
    </span>
  );
}
