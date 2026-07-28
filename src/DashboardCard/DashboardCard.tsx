import { type HTMLAttributes, type ReactNode } from 'react';

import styles from './DashboardCard.module.css';

/** Surface treatment: `raised` for headline panels, `muted` for flat compact stat tiles. */
export type DashboardCardVariant = 'raised' | 'muted';

export interface DashboardCardProps extends HTMLAttributes<HTMLDivElement> {
  /** `raised` (white, soft shadow) · `muted` (flat, subtle fill). Default `raised`. */
  variant?: DashboardCardVariant;
  children: ReactNode;
}

/**
 * The surface container for a dashboard panel — a padded, rounded card that hosts a single
 * widget: a goal ring, a streak calendar, a stat. Presentational; it owns only the surface,
 * not the content. Compose widgets like {@link DailyGoal} and {@link StreakBadge} inside it,
 * or drop in your own children.
 */
export function DashboardCard({
  variant = 'raised',
  className,
  children,
  ...rest
}: DashboardCardProps) {
  const classes = [styles.card, styles[variant], className ?? ''].filter(Boolean).join(' ');
  return (
    <div className={classes} {...rest}>
      {children}
    </div>
  );
}
