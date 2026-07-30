import { forwardRef, type ButtonHTMLAttributes, type ReactNode } from 'react';

import styles from './Switch.module.css';

export type SwitchSize = 'm' | 'l';

export interface SwitchProps extends Omit<
  ButtonHTMLAttributes<HTMLButtonElement>,
  'onChange' | 'type' | 'value'
> {
  /** Whether the switch is on (controlled). */
  checked: boolean;
  /** Called with the next state when the user toggles it. */
  onChange: (checked: boolean) => void;
  /**
   * Visible label rendered beside the track, e.g. "Фуригана". It also supplies the
   * control's accessible name — without it, pass `aria-label`.
   */
  label?: ReactNode;
  /** Put the label before the track instead of after. */
  labelPosition?: 'start' | 'end';
  /** `m` (20px track) · `l` (24px track). */
  size?: SwitchSize;
  disabled?: boolean;
  className?: string;
}

/**
 * An on/off toggle for a setting that applies immediately, with no confirmation step
 * (e.g. showing furigana). Rendered as a single `role="switch"` button so the label and
 * the track are one hit target and one tab stop; controlled only.
 *
 * Use it for state that takes effect on toggle. To choose between two *values*, reach
 * for {@link SegmentedControl} instead — that one is a `radiogroup` and reads as such.
 */
export const Switch = forwardRef<HTMLButtonElement, SwitchProps>(function Switch(
  {
    checked,
    onChange,
    label,
    labelPosition = 'end',
    size = 'm',
    disabled = false,
    className,
    ...rest
  },
  ref,
) {
  const classes = [
    styles.root,
    styles[size],
    checked ? styles.checked : '',
    disabled ? styles.disabled : '',
    labelPosition === 'start' ? styles.labelStart : '',
    className ?? '',
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <button
      ref={ref}
      type="button"
      role="switch"
      aria-checked={checked}
      disabled={disabled}
      className={classes}
      onClick={() => onChange(!checked)}
      {...rest}
    >
      <span className={styles.track} aria-hidden="true">
        <span className={styles.thumb} />
      </span>
      {label != null && <span className={styles.label}>{label}</span>}
    </button>
  );
});
