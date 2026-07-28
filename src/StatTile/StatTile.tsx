import { type HTMLAttributes, type ReactNode } from 'react';

import { DashboardCard, type DashboardCardVariant } from '../DashboardCard';

import styles from './StatTile.module.css';

export interface StatTileProps extends Omit<HTMLAttributes<HTMLDivElement>, 'children'> {
  /** The figure, shown large and centered, e.g. 6. */
  value: ReactNode;
  /** Caps label under the figure, e.g. "Изучено". */
  label: ReactNode;
  /** Card surface. Defaults to `muted` — the flat tile from the review dashboard. */
  variant?: DashboardCardVariant;
}

/**
 * A compact dashboard stat: a single figure centered over a caps label ("2 К ПОВТОРЕНИЮ").
 * Presentational — it bakes in the centering, so callers just pass `value` and `label` rather
 * than aligning by hand. Wrapped in a {@link DashboardCard} (muted by default); extra props
 * pass through to that card.
 */
export function StatTile({ value, label, variant = 'muted', className, ...rest }: StatTileProps) {
  return (
    <DashboardCard variant={variant} className={className} {...rest}>
      <div className={styles.stat}>
        <span className={styles.value}>{value}</span>
        <span className={styles.label}>{label}</span>
      </div>
    </DashboardCard>
  );
}
