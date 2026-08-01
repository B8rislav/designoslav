import { forwardRef, type ButtonHTMLAttributes, type ReactNode, type Ref } from 'react';

import styles from './Badge.module.css';

/** Color role. Meaning is the caller's — the badge only knows how to look. */
export type BadgeTone = 'neutral' | 'primary' | 'accent';
export type BadgeSize = 's' | 'm';

export interface BadgeProps extends Omit<ButtonHTMLAttributes<HTMLElement>, 'type'> {
  /** Label. Kept short — a badge is a tag, not a sentence. */
  children: ReactNode;
  /** `neutral` (grey) · `primary` (celadon) · `accent` (terracotta). */
  tone?: BadgeTone;
  /** `s` (20px, inside dense rows) · `m` (24px). */
  size?: BadgeSize;
  /** Uppercase with wide tracking, for standing labels like «ОТКРЫТА». */
  caps?: boolean;
  /**
   * Render as a real `<button>`. Required for a badge that does something on click
   * — a clickable `<span>` is unreachable by keyboard and invisible to assistive
   * tech, so this is an explicit choice rather than something inferred from
   * `onClick` being present.
   */
  as?: 'span' | 'button';
}

/**
 * A small status tag: a JLPT level, a mastery state, «ОТКРЫТА» on an open deck, a
 * stroke count. Presentational — `tone` picks a color role and the caller decides
 * what that role means (jpdict maps its mastery states onto them).
 *
 * Defaults to a `<span>`. Pass `as="button"` for an interactive badge, such as a
 * status pill that advances on click; native button attributes then pass through.
 */
export const Badge = forwardRef<HTMLElement, BadgeProps>(function Badge(
  { children, tone = 'neutral', size = 's', caps = false, as = 'span', className, ...rest },
  ref,
) {
  const classes = [
    styles.badge,
    styles[tone],
    styles[size],
    caps ? styles.caps : '',
    as === 'button' ? styles.interactive : '',
    className ?? '',
  ]
    .filter(Boolean)
    .join(' ');

  if (as === 'button') {
    return (
      <button ref={ref as Ref<HTMLButtonElement>} type="button" className={classes} {...rest}>
        {children}
      </button>
    );
  }

  return (
    <span ref={ref as Ref<HTMLSpanElement>} className={classes} {...rest}>
      {children}
    </span>
  );
});
