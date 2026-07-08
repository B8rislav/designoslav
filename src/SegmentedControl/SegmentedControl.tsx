import { useId, type ReactNode } from 'react';

import { useRadioGroupKeys } from '../shared/useRadioGroupKeys';

import styles from './SegmentedControl.module.css';

export type SegmentedControlSize = 'm' | 'l';

export interface SegmentedControlOption<Value extends string = string> {
  value: Value;
  label: ReactNode;
  disabled?: boolean;
}

export interface SegmentedControlProps<Value extends string = string> {
  /** The options rendered as segments, in order. */
  options: SegmentedControlOption<Value>[];
  /** Currently selected value (controlled). */
  value: Value;
  /** Called with the newly selected value when the user picks a segment. */
  onChange: (value: Value) => void;
  /** `m` (32px track) · `l` (40px track). */
  size?: SegmentedControlSize;
  /** Stretch to fill the container's width, splitting segments evenly. */
  fullWidth?: boolean;
  /** Required — this control has no visible label of its own (e.g. "Display language"). */
  'aria-label': string;
  disabled?: boolean;
  className?: string;
}

/**
 * A two-or-more-way switch for mutually exclusive choices (e.g. 日本語 / 中文),
 * styled as a pill track with a solid celadon segment marking the active choice.
 * Implements the WAI-ARIA `radiogroup` pattern: arrow keys move both focus and
 * selection between segments, matching native radio-button behavior.
 */
export function SegmentedControl<Value extends string = string>({
  options,
  value,
  onChange,
  size = 'm',
  fullWidth = false,
  disabled = false,
  className,
  ...rest
}: SegmentedControlProps<Value>) {
  const name = useId();
  const { rootRef, handleKeyDown } = useRadioGroupKeys({ options, value, onChange });

  const classes = [
    styles.track,
    styles[size],
    fullWidth ? styles.fullWidth : '',
    disabled ? styles.disabled : '',
    className ?? '',
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <div
      ref={rootRef}
      role="radiogroup"
      aria-label={rest['aria-label']}
      aria-disabled={disabled || undefined}
      className={classes}
      onKeyDown={handleKeyDown}
    >
      {options.map((option) => {
        const selected = option.value === value;
        const isDisabled = disabled || option.disabled;
        return (
          <button
            key={option.value}
            type="button"
            role="radio"
            aria-checked={selected}
            disabled={isDisabled}
            tabIndex={selected ? 0 : -1}
            name={name}
            className={[styles.segment, selected ? styles.selected : ''].filter(Boolean).join(' ')}
            onClick={() => !isDisabled && onChange(option.value)}
          >
            {option.label}
          </button>
        );
      })}
    </div>
  );
}
