import { type HTMLAttributes, type ReactNode } from 'react';

import { DashboardCard } from '../DashboardCard';

import styles from './StreakBadge.module.css';

/** A day's place in the streak: `done` (filled), `today` (open ring), `upcoming` (faint). */
export type StreakDayState = 'done' | 'today' | 'upcoming';

export interface StreakDay {
  /** Short weekday marker shown above the dot, e.g. "П". */
  label: ReactNode;
  /** Visual state of the day. */
  state: StreakDayState;
}

export interface StreakBadgeProps extends Omit<HTMLAttributes<HTMLDivElement>, 'children'> {
  /** The streak length, shown large in terracotta, e.g. 7. */
  count: number;
  /** Text after the count, e.g. "дней подряд". */
  label: ReactNode;
  /** The week's days, in order, each with its state. */
  days: StreakDay[];
  /** Accessible summary of the week row; when omitted the row is treated as decorative. */
  calendarLabel?: string;
}

/**
 * The "дней подряд" panel: a big terracotta streak count over a week of weekday dots — filled
 * for days done, an open ring for today, faint for days still to come. Presentational; the
 * count and calendar are driven entirely by props. The dot row is a visual echo of the count,
 * so pass `calendarLabel` to expose it to assistive tech, or leave it decorative. Wrapped in a
 * {@link DashboardCard}; extra props pass through to that card.
 */
export function StreakBadge({
  count,
  label,
  days,
  calendarLabel,
  className,
  ...rest
}: StreakBadgeProps) {
  return (
    <DashboardCard className={className} {...rest}>
      <p className={styles.headline}>
        <span className={styles.count}>{count}</span>
        <span className={styles.label}>{label}</span>
      </p>
      <div
        className={styles.week}
        role={calendarLabel ? 'img' : undefined}
        aria-label={calendarLabel}
        aria-hidden={calendarLabel ? undefined : true}
      >
        {days.map((day, index) => (
          <div key={index} className={styles.day}>
            <span className={styles.dayLabel}>{day.label}</span>
            <span className={[styles.dot, styles[day.state]].join(' ')} />
          </div>
        ))}
      </div>
    </DashboardCard>
  );
}
