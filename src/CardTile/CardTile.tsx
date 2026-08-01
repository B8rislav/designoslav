import { forwardRef, type HTMLAttributes, type ReactNode } from 'react';

import { type BadgeTone } from '../Badge';

import styles from './CardTile.module.css';

export interface CardTileProps extends Omit<HTMLAttributes<HTMLDivElement>, 'children'> {
  /** The character, shown large — e.g. 私. */
  glyph: ReactNode;
  /** The gloss, e.g. «я, частный, личный». */
  meaning?: ReactNode;
  /** Reading under the meaning, e.g. シ. */
  reading?: ReactNode;
  /** Mastery color, shown as a dot in the corner. */
  tone?: BadgeTone;
  /** Leading footer slot — pass {@link Badge}s (level, stroke count). */
  badges?: ReactNode;
  /** Trailing footer slot — the mastery label. */
  status?: ReactNode;
}

/**
 * One saved kanji as a tile in the deck grid: a corner status dot, the character, its
 * meaning and reading, and a footer of tags.
 *
 * Distinct from {@link KanjiCard}, which is the full detail card with radicals, parts
 * and stroke order — this is the compact browse tile. Presentational, with no click
 * behavior of its own.
 */
export const CardTile = forwardRef<HTMLDivElement, CardTileProps>(function CardTile(
  { glyph, meaning, reading, tone = 'neutral', badges, status, className, ...rest },
  ref,
) {
  const classes = [styles.tile, className ?? ''].filter(Boolean).join(' ');

  return (
    <div ref={ref} className={classes} {...rest}>
      <span className={[styles.dot, styles[tone]].join(' ')} aria-hidden="true" />
      <span className={styles.glyph}>{glyph}</span>
      <span className={styles.body}>
        {meaning != null && <span className={styles.meaning}>{meaning}</span>}
        {reading != null && <span className={styles.reading}>{reading}</span>}
      </span>
      {(badges || status) && (
        <span className={styles.footer}>
          <span className={styles.badges}>{badges}</span>
          {status != null && <span className={styles.status}>{status}</span>}
        </span>
      )}
    </div>
  );
});
