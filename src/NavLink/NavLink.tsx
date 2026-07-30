import { type AnchorHTMLAttributes, type ElementType } from 'react';

import styles from './NavLink.module.css';

export interface NavLinkProps extends AnchorHTMLAttributes<HTMLAnchorElement> {
  /** Marks the destination the user is currently on — draws the underline. */
  active?: boolean;
  /**
   * Element to render as. Defaults to `a`; pass a router link (`as={Link}`) to keep
   * client-side navigation, since the design system can't depend on a router itself.
   * Props are typed as anchor props either way, which is what router links accept.
   */
  as?: ElementType;
  className?: string;
}

/**
 * One destination in the app header. The active item is marked twice over — a celadon
 * underline for sighted users and `aria-current="page"` for assistive tech — because
 * color alone is not a state indicator.
 *
 * The underline is drawn on a pseudo-element that is always present and scaled to zero,
 * so it grows from the center on hover instead of shifting the text.
 */
export function NavLink({ active = false, as: Component = 'a', className, ...rest }: NavLinkProps) {
  const classes = [styles.link, active ? styles.active : '', className ?? '']
    .filter(Boolean)
    .join(' ');

  return <Component className={classes} aria-current={active ? 'page' : undefined} {...rest} />;
}
