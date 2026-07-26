import { forwardRef, type FormEvent, type InputHTMLAttributes, type ReactNode } from 'react';

import { Button } from '../Button';

import styles from './SearchField.module.css';

export type SearchFieldSize = 'm' | 'l';

export interface SearchFieldProps extends Omit<
  InputHTMLAttributes<HTMLInputElement>,
  'onChange' | 'onSubmit' | 'size' | 'value' | 'type'
> {
  /** Current query text (controlled). */
  value: string;
  /** Called with the new text on every keystroke. */
  onValueChange: (value: string) => void;
  /** Called with the current text when the user submits (Enter or the action button). */
  onSubmit?: (value: string) => void;
  /** `m` (40px) · `l` (48px). Matches the equivalent Button sizes. */
  size?: SearchFieldSize;
  /** Stretch the field to fill the container's width. */
  fullWidth?: boolean;
  /** Show a clear (×) button while there is text. Defaults to `true`. */
  clearable?: boolean;
  /** Accessible label for the clear button. */
  clearLabel?: string;
  /** Render a trailing submit button with this label (e.g. `Найти`). */
  actionLabel?: ReactNode;
  /** Override the leading icon. Defaults to a magnifier glyph. */
  icon?: ReactNode;
  /** Required — the field has no visible label of its own (e.g. "Search the dictionary"). */
  'aria-label': string;
  className?: string;
}

const SearchIcon = () => (
  <svg
    className={styles.iconGlyph}
    viewBox="0 0 20 20"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.75"
    strokeLinecap="round"
    aria-hidden="true"
    focusable="false"
  >
    <circle cx="9" cy="9" r="6" />
    <path d="m14 14 3.5 3.5" />
  </svg>
);

const ClearIcon = () => (
  <svg
    viewBox="0 0 16 16"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.75"
    strokeLinecap="round"
    aria-hidden="true"
    focusable="false"
  >
    <path d="m4 4 8 8M12 4l-8 8" />
  </svg>
);

/**
 * Designoslav SearchField — the dictionary search bar. A controlled `<input type="search">`
 * wrapped in a `role="search"` form, with a leading magnifier, an optional clear button,
 * and an optional trailing submit Button (the "Найти" CTA). Pressing Enter or clicking the
 * action button both fire `onSubmit`. Forwards its ref to the underlying input so callers
 * can focus it (e.g. a `/` keyboard shortcut).
 */
export const SearchField = forwardRef<HTMLInputElement, SearchFieldProps>(function SearchField(
  {
    value,
    onValueChange,
    onSubmit,
    size = 'm',
    fullWidth = false,
    clearable = true,
    clearLabel = 'Clear',
    actionLabel,
    icon,
    disabled = false,
    placeholder,
    className,
    ...rest
  },
  ref,
) {
  const showClear = clearable && value.length > 0 && !disabled;

  const classes = [
    styles.form,
    styles[size],
    fullWidth ? styles.fullWidth : '',
    disabled ? styles.disabled : '',
    className ?? '',
  ]
    .filter(Boolean)
    .join(' ');

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    onSubmit?.(value);
  };

  return (
    <form role="search" className={classes} onSubmit={handleSubmit}>
      <div className={styles.field}>
        <span className={styles.icon}>{icon ?? <SearchIcon />}</span>
        <input
          ref={ref}
          type="search"
          className={styles.input}
          value={value}
          disabled={disabled}
          placeholder={placeholder}
          onChange={(event) => onValueChange(event.target.value)}
          {...rest}
        />
        {showClear && (
          <button
            type="button"
            className={styles.clear}
            aria-label={clearLabel}
            onClick={() => onValueChange('')}
          >
            <ClearIcon />
          </button>
        )}
      </div>
      {actionLabel != null && (
        <Button type="submit" size={size === 'l' ? 'l' : 'm'} disabled={disabled}>
          {actionLabel}
        </Button>
      )}
    </form>
  );
});
