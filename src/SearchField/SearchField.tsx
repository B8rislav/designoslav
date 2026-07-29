import {
  forwardRef,
  type InputHTMLAttributes,
  type KeyboardEvent,
  type ReactNode,
  type SyntheticEvent,
} from 'react';

import { Button } from '../Button';
import { optionDomId } from '../shared/listbox';

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
  /**
   * Called with the current text when the user submits (Enter or the action button).
   * Enter does *not* submit while an option is highlighted — it commits that option
   * instead, through `onOptionCommit`.
   */
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

  /* ── Combobox ──────────────────────────────────────────────────────────────
   * Pass these to pair the field with a {@link SearchOptionList} popover. The field
   * becomes a `role="combobox"` and takes over ↑↓ / Home / End / Enter / Escape while the
   * popover is open. Focus never leaves the input, so the user can keep refining the query
   * while browsing options — the highlight is conveyed by `aria-activedescendant`, not by
   * moving focus. Omit them and the field stays a plain search box.
   */

  /** `id` of the paired list's listbox element — the same value you give it as `id`. */
  listboxId?: string;
  /** Whether the popover is open (controlled). Drives `aria-expanded`. */
  expanded?: boolean;
  /** The option ids currently in the popover, in render order. Arrow keys walk this. */
  optionIds?: readonly string[];
  /** `id` of the highlighted option (controlled). Browsing only — it commits nothing. */
  activeOptionId?: string;
  /** Called as ↑↓ / Home / End move the highlight. */
  onActiveOptionChange?: (id: string) => void;
  /** Called with the highlighted option's `id` when Enter commits it. */
  onOptionCommit?: (id: string) => void;
  /** Called on Escape. Dismissing the popover is the caller's to do. */
  onDismiss?: () => void;
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
 *
 * Pass `listboxId` and the combobox props to pair it with a {@link SearchOptionList}: the
 * input becomes a `role="combobox"` that owns ↑↓ / Home / End / Enter / Escape for the
 * popover. Focus stays in the input the whole time — the highlight travels through
 * `aria-activedescendant` — so browsing the parse options never interrupts typing, and
 * moving the highlight commits nothing until Enter.
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
    listboxId,
    expanded = false,
    optionIds,
    activeOptionId,
    onActiveOptionChange,
    onOptionCommit,
    onDismiss,
    onKeyDown,
    ...rest
  },
  ref,
) {
  const showClear = clearable && value.length > 0 && !disabled;

  const isCombobox = listboxId != null;
  const ids = optionIds ?? [];
  const isBrowsable = isCombobox && expanded && ids.length > 0;

  const classes = [
    styles.form,
    styles[size],
    fullWidth ? styles.fullWidth : '',
    disabled ? styles.disabled : '',
    className ?? '',
  ]
    .filter(Boolean)
    .join(' ');

  const handleSubmit = (event: SyntheticEvent<HTMLFormElement, SubmitEvent>) => {
    event.preventDefault();
    onSubmit?.(value);
  };

  /** Move the highlight by `delta`, wrapping. With nothing highlighted, ↓ takes the first
   *  option and ↑ the last — so a single keypress always lands somewhere. */
  const step = (delta: number) => {
    const current = activeOptionId == null ? -1 : ids.indexOf(activeOptionId);
    const next =
      current === -1
        ? delta > 0
          ? 0
          : ids.length - 1
        : (current + delta + ids.length) % ids.length;
    onActiveOptionChange?.(ids[next]);
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    onKeyDown?.(event);
    if (event.defaultPrevented || !isBrowsable) return;

    switch (event.key) {
      case 'ArrowDown':
        // preventDefault throughout: otherwise the caret jumps to either end of the query
        // while the user is only trying to browse the list.
        event.preventDefault();
        step(1);
        break;
      case 'ArrowUp':
        event.preventDefault();
        step(-1);
        break;
      case 'Home':
        event.preventDefault();
        onActiveOptionChange?.(ids[0]);
        break;
      case 'End':
        event.preventDefault();
        onActiveOptionChange?.(ids[ids.length - 1]);
        break;
      case 'Enter':
        // Only swallow the submit when there is something to commit; with no highlight,
        // Enter still means "search for what I typed".
        if (activeOptionId == null) break;
        event.preventDefault();
        onOptionCommit?.(activeOptionId);
        break;
      case 'Escape':
        // type="search" clears itself on Escape in some browsers — not what dismissing a
        // popover should do to the query.
        event.preventDefault();
        onDismiss?.();
        break;
      default:
        break;
    }
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
          onKeyDown={handleKeyDown}
          {...rest}
          // After `rest` on purpose — the combobox relationship is computed from props we
          // own, and a stray caller-supplied aria-expanded would silently desync it.
          role={isCombobox ? 'combobox' : undefined}
          aria-expanded={isCombobox ? expanded : undefined}
          aria-controls={isCombobox && expanded ? listboxId : undefined}
          aria-autocomplete={isCombobox ? 'list' : undefined}
          aria-activedescendant={
            isCombobox && expanded && activeOptionId != null
              ? optionDomId(listboxId, activeOptionId)
              : undefined
          }
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
