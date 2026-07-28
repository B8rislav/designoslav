import { type HTMLAttributes, type ReactNode, useId } from 'react';

import { DashboardCard } from '../DashboardCard';

import styles from './DailyGoal.module.css';

export interface DailyGoalProps extends Omit<HTMLAttributes<HTMLDivElement>, 'children'> {
  /** Cards reviewed so far today. */
  value: number;
  /** The daily target. */
  target: number;
  /** Bold title beside the ring, e.g. "Дневная цель". */
  label: ReactNode;
  /** Sub-line under the title, e.g. "4 из 10 карточек". Defaults to `value / target`. */
  caption?: ReactNode;
}

/**
 * The "Дневная цель" panel: a celadon progress ring with the percentage in its centre, next
 * to a title and a caption. Presentational — the ring is derived from `value` / `target`, and
 * the whole widget is exposed to assistive tech as a `progressbar` labelled by its title.
 * Wrapped in a {@link DashboardCard}; extra props pass through to that card.
 */
export function DailyGoal({ value, target, label, caption, className, ...rest }: DailyGoalProps) {
  const labelId = useId();
  const raw = target > 0 ? Math.round((value / target) * 100) : 0;
  const percent = Math.max(0, Math.min(100, raw));

  return (
    <DashboardCard className={className} {...rest}>
      <div className={styles.layout}>
        <div
          className={styles.ring}
          role="progressbar"
          aria-valuemin={0}
          aria-valuemax={target}
          aria-valuenow={value}
          aria-valuetext={`${percent}%`}
          aria-labelledby={labelId}
        >
          <svg className={styles.ringSvg} viewBox="0 0 36 36" aria-hidden="true" focusable="false">
            <circle className={styles.track} cx="18" cy="18" r="15.9155" />
            <circle
              className={styles.progress}
              cx="18"
              cy="18"
              r="15.9155"
              strokeDasharray={`${percent} 100`}
              transform="rotate(-90 18 18)"
            />
            <text
              className={styles.percent}
              x="18"
              y="18"
              textAnchor="middle"
              dominantBaseline="central"
            >
              {percent}%
            </text>
          </svg>
        </div>
        <div className={styles.text}>
          <span id={labelId} className={styles.label}>
            {label}
          </span>
          <span className={styles.caption}>{caption ?? `${value} / ${target}`}</span>
        </div>
      </div>
    </DashboardCard>
  );
}
