import { type HTMLAttributes, type ReactNode } from 'react';

import styles from './SearchBand.module.css';

export interface SearchBandProps extends HTMLAttributes<HTMLDivElement> {
  /** Kicker above the field, e.g. 文を分解 · РАЗБОР ПРЕДЛОЖЕНИЯ. */
  eyebrow?: ReactNode;
  /** The search control itself — pass a {@link SearchField} with `fullWidth`. */
  children: ReactNode;
  /** Quiet explanatory line under the field, e.g. "Определяем тип запроса автоматически". */
  hint?: ReactNode;
  /** Trailing controls on the hint's row, e.g. a furigana {@link Switch}. */
  aside?: ReactNode;
  className?: string;
}

/**
 * The full-bleed band that carries search at the top of a page: a kicker, the field, and
 * a footer row pairing a hint with any display toggles.
 *
 * The band spans its container edge to edge while its contents stay in a centered
 * measure, so the tint reads as a page region rather than a card. The field is capped
 * narrower than the footer — a search box wider than about 800px is harder to scan, but
 * the hint and its toggles should still sit at the region's outer edges.
 */
export function SearchBand({
  eyebrow,
  children,
  hint,
  aside,
  className,
  ...rest
}: SearchBandProps) {
  const classes = [styles.band, className ?? ''].filter(Boolean).join(' ');

  return (
    <div className={classes} {...rest}>
      <div className={styles.inner}>
        {eyebrow != null && <p className={styles.eyebrow}>{eyebrow}</p>}
        <div className={styles.field}>{children}</div>
        {(hint != null || aside != null) && (
          <div className={styles.footer}>
            {hint != null && <p className={styles.hint}>{hint}</p>}
            {aside != null && <div className={styles.aside}>{aside}</div>}
          </div>
        )}
      </div>
    </div>
  );
}
