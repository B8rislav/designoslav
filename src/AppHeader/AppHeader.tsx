import { type HTMLAttributes, type ReactNode } from 'react';

import styles from './AppHeader.module.css';

export interface AppHeaderProps extends HTMLAttributes<HTMLElement> {
  /** Leading lockup — pass a {@link Brand}. */
  brand?: ReactNode;
  /** Sits beside the brand, for a scope switch like 日本語 / 中文. */
  center?: ReactNode;
  /** Trailing navigation — a row of {@link NavLink}s. Wrapped in a `<nav>`. */
  nav?: ReactNode;
  /** Far-trailing actions: settings, sign in/out. */
  actions?: ReactNode;
  /** Pin the bar to the top of the viewport while the page scrolls under it. */
  sticky?: boolean;
  /** Labels the `<nav>` for assistive tech, e.g. "Основная навигация". */
  navLabel?: string;
  className?: string;
}

/**
 * The application bar: brand and scope on the leading edge, navigation and actions on
 * the trailing edge. A pure shell — it owns the bar's height, surface, border and
 * horizontal rhythm, and nothing about what goes in the slots.
 *
 * `sticky` is a prop rather than a default because pinning is a page-level decision:
 * it only pays off when the page below actually scrolls.
 */
export function AppHeader({
  brand,
  center,
  nav,
  actions,
  sticky = false,
  navLabel,
  className,
  ...rest
}: AppHeaderProps) {
  const classes = [styles.header, sticky ? styles.sticky : '', className ?? '']
    .filter(Boolean)
    .join(' ');

  return (
    <header className={classes} {...rest}>
      <div className={styles.inner}>
        {brand != null && <div className={styles.brand}>{brand}</div>}
        {center != null && <div className={styles.center}>{center}</div>}
        <div className={styles.spacer} />
        {nav != null && (
          <nav className={styles.nav} aria-label={navLabel}>
            {nav}
          </nav>
        )}
        {actions != null && <div className={styles.actions}>{actions}</div>}
      </div>
    </header>
  );
}
