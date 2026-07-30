import { type AnchorHTMLAttributes, type ElementType, type ReactNode } from 'react';

import styles from './Brand.module.css';

export type BrandSize = 'm' | 'l';

/**
 * Anchor props rather than plain HTML props: the lockup's main job beyond decoration is
 * linking home, so `href` has to typecheck. Same trade-off as {@link NavLink}.
 */
export interface BrandProps extends AnchorHTMLAttributes<HTMLElement> {
  /** The glyph in the tile, e.g. 語. Kept to one or two characters. */
  mark: ReactNode;
  /** Primary name beside the tile, e.g. 言葉ラボ. Omit for a tile-only lockup. */
  wordmark?: ReactNode;
  /** Small caps line under the wordmark, e.g. KOTOBA LAB. */
  subtitle?: ReactNode;
  /** `m` (32px tile) · `l` (40px tile). */
  size?: BrandSize;
  /**
   * Element to render as — pass a router link (`as={Link}` with `href`) to make the
   * lockup navigate home. Defaults to a plain `span`.
   */
  as?: ElementType;
  className?: string;
}

/**
 * The product lockup: a filled tile holding a single CJK mark, optionally followed by
 * the wordmark and a small caps subtitle. Every string is a prop — the design system
 * shouldn't hard-code the product's name, so renaming is a one-line change at the call
 * site.
 *
 * The tile's glyph and the wordmark are set in the display serif; the subtitle stays
 * sans, letterspaced, to keep it from competing.
 */
export function Brand({
  mark,
  wordmark,
  subtitle,
  size = 'm',
  as: Component = 'span',
  className,
  ...rest
}: BrandProps) {
  const classes = [styles.brand, styles[size], className ?? ''].filter(Boolean).join(' ');

  return (
    <Component className={classes} {...rest}>
      <span className={styles.tile} aria-hidden="true">
        {mark}
      </span>
      {(wordmark != null || subtitle != null) && (
        <span className={styles.text}>
          {wordmark != null && <span className={styles.wordmark}>{wordmark}</span>}
          {subtitle != null && <span className={styles.subtitle}>{subtitle}</span>}
        </span>
      )}
    </Component>
  );
}
