import { useId, type ReactNode } from 'react';

import { useRadioGroupKeys } from '../shared/useRadioGroupKeys';

import styles from './ToggleGroup.module.css';

export type ToggleGroupSize = 'm' | 'l';

export interface ToggleGroupOption<Value extends string = string> {
  value: Value;
  label: ReactNode;
  disabled?: boolean;
}

export interface ToggleGroupProps<Value extends string = string> {
  /** The options rendered as pills, in order. */
  options: ToggleGroupOption<Value>[];
  /** Currently selected value (controlled). */
  value: Value;
  /** Called with the newly selected value when the user picks a pill. */
  onChange: (value: Value) => void;
  /** `m` (32px pills) · `l` (40px pills). */
  size?: ToggleGroupSize;
  /** Stretch to fill the container's width, splitting pills evenly. */
  fullWidth?: boolean;
  /** Required — this control has no visible label of its own (e.g. "Тип записи"). */
  'aria-label': string;
  disabled?: boolean;
  className?: string;
}

/**
 * A single-select switch rendered as discrete, individually-bordered pills separated
 * by gaps — the selected pill is filled solid celadon, the rest are outlined surface
 * pills. Shares the WAI-ARIA `radiogroup` keyboard behavior with SegmentedControl (via
 * {@link useRadioGroupKeys}) but presents each option as its own standalone chip rather
 * than segments of one continuous track.
 */
export function ToggleGroup<Value extends string = string>({
  options,
  value,
  onChange,
  size = 'm',
  fullWidth = false,
  disabled = false,
  className,
  ...rest
}: ToggleGroupProps<Value>) {
  const name = useId();
  const { rootRef, handleKeyDown } = useRadioGroupKeys({ options, value, onChange });

  const classes = [
    styles.group,
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
            className={[styles.pill, selected ? styles.selected : ''].filter(Boolean).join(' ')}
            onClick={() => !isDisabled && onChange(option.value)}
          >
            {option.label}
          </button>
        );
      })}
    </div>
  );
}
