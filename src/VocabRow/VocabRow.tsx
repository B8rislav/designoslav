import { forwardRef, type HTMLAttributes, type ReactNode } from 'react';

import { type BadgeTone } from '../Badge';

import styles from './VocabRow.module.css';

export interface VocabRowProps extends Omit<HTMLAttributes<HTMLDivElement>, 'children'> {
  /** The headword — kanji or kana, e.g. 食べる. Primary content: it wraps, never truncates. */
  headword: ReactNode;
  /** Reading under the headword, e.g. たべる. */
  reading?: ReactNode;
  /** The meaning line, e.g. «есть · to eat». Secondary: clamps to one line. */
  gloss?: ReactNode;
  /** Color of the leading accent bar. jpdict drives it from mastery status. */
  tone?: BadgeTone;
  /** Trailing tags — pass {@link Badge}s (level, mastery). */
  badges?: ReactNode;
  /** Trailing controls — pass `<Button>`s. The row itself is not clickable. */
  actions?: ReactNode;
}

/**
 * One saved card as a row in the dictionary list: a status-colored accent bar, the
 * headword with its reading, the gloss, then tags and controls on the trailing edge.
 *
 * Presentational and deliberately **not** a button — the row has interactive children,
 * and a clickable row wrapping its own controls is the nested-interactive trap. Put
 * whatever the row should do into `actions`.
 */
export const VocabRow = forwardRef<HTMLDivElement, VocabRowProps>(function VocabRow(
  { headword, reading, gloss, tone = 'neutral', badges, actions, className, ...rest },
  ref,
) {
  const classes = [styles.row, styles[tone], className ?? ''].filter(Boolean).join(' ');

  return (
    <div ref={ref} className={classes} {...rest}>
      <span className={styles.headwordBlock}>
        <span className={styles.headword}>{headword}</span>
        {reading != null && <span className={styles.reading}>{reading}</span>}
      </span>
      {gloss != null && <span className={styles.gloss}>{gloss}</span>}
      {badges && <span className={styles.badges}>{badges}</span>}
      {actions && <span className={styles.actions}>{actions}</span>}
    </div>
  );
});
