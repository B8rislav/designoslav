import { forwardRef, type ButtonHTMLAttributes } from 'react';

import styles from './Button.module.css';

export type ButtonVariant = 'primary' | 'secondary' | 'accent' | 'ghost';
export type ButtonSize = 'm' | 'l' | 'xl';

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  /** Visual role. `primary` is solid celadon, `secondary` is a bordered surface. */
  variant?: ButtonVariant;
  /** `m` (40px) · `l` (48px) · `xl` (56px, larger radius). */
  size?: ButtonSize;
  /** Stretch to fill the container's width. */
  fullWidth?: boolean;
}

/**
 * Designoslav Button. A thin, presentational wrapper over `<button>` styled from
 * the color tokens — no state, no side effects. Forwards its ref so callers can
 * focus/measure it (mirrors how the app wires refs into buttons).
 */
export const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  { variant = 'primary', size = 'm', fullWidth = false, type = 'button', className, ...rest },
  ref,
) {
  const classes = [
    styles.button,
    styles[variant],
    styles[size],
    fullWidth ? styles.fullWidth : '',
    className ?? '',
  ]
    .filter(Boolean)
    .join(' ');

  return <button ref={ref} type={type} className={classes} {...rest} />;
});
