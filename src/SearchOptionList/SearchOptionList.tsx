import { useEffect, useId, useRef, type HTMLAttributes, type ReactNode } from 'react';

import { optionDomId } from '../shared/listbox';
import { SearchOption, type SearchOptionProps } from '../SearchOption';

import styles from './SearchOptionList.module.css';

export interface SearchOptionItem extends Omit<SearchOptionProps, 'active' | 'id'> {
  /** Stable identity — the React key and the value reported to `onSelect`. */
  id: string;
}

/** One entry in the footer hint bar, e.g. `↑↓ выбрать`. */
export interface SearchOptionHint {
  /** The key glyphs, rendered as a `<kbd>` chip — e.g. `↑↓`, `↵`, `esc`. */
  keys: ReactNode;
  /** What the keys do. Localized — pass it in. */
  label: ReactNode;
}

export interface SearchOptionListProps extends Omit<
  HTMLAttributes<HTMLDivElement>,
  'onSelect' | 'id'
> {
  /** The parse options to render, in order. */
  options: SearchOptionItem[];
  /**
   * `id` of the keyboard-active option (controlled) — the highlight, not a commitment.
   * Pair it with {@link SearchField}'s `activeOptionId`.
   */
  activeId?: string;
  /** Called with an option's `id` when it is clicked. */
  onSelect?: (id: string) => void;
  /** Optional visible header for the popover, e.g. "Варианты разбора". */
  heading?: ReactNode;
  /**
   * Keyboard affordances shown in the footer bar. Omit for no footer. The component owns
   * the styling; you supply the localized copy.
   */
  hints?: SearchOptionHint[];
  /**
   * Applied to the `role="listbox"` element rather than the card, because that is what a
   * combobox's `aria-controls` has to reference. Pass the same value as
   * {@link SearchField}'s `listboxId`. Defaults to a generated id.
   */
  id?: string;
  /** Labels the list for assistive tech when there is no visible `heading`. */
  'aria-label'?: string;
  className?: string;
}

/**
 * The search "варианты разбора" popover: a raised card holding an optional heading, a
 * scrollable `role="listbox"` of {@link SearchOption}s, and an optional footer hint bar.
 *
 * Presentational and controlled — it renders the `options` array, highlights the one whose
 * `id` matches `activeId`, and reports clicks through `onSelect`. It owns no selection
 * state and **no keyboard handling**: focus stays in the {@link SearchField} input so the
 * user can keep typing, and the field drives the highlight through `aria-activedescendant`.
 * The one thing this component does own is its scrollport, so it keeps the active option
 * scrolled into view.
 *
 * Visibility and placement are the caller's — render it when open, position it in your own
 * CSS.
 */
export function SearchOptionList({
  options,
  activeId,
  onSelect,
  heading,
  hints,
  id,
  className,
  'aria-label': ariaLabel,
  ...rest
}: SearchOptionListProps) {
  const generatedId = useId();
  const listboxId = id ?? generatedId;
  const headingId = `${listboxId}-heading`;
  const listRef = useRef<HTMLUListElement>(null);

  useEffect(() => {
    // Arrowing past the edge of the scrollport must not hide the highlight. `nearest`
    // keeps the surrounding page still when the option is already visible.
    if (activeId == null) return;
    const active = listRef.current?.ownerDocument.getElementById(optionDomId(listboxId, activeId));
    active?.scrollIntoView({ block: 'nearest' });
  }, [activeId, listboxId]);

  const classes = [styles.popover, className ?? ''].filter(Boolean).join(' ');

  return (
    <div className={classes} {...rest}>
      {heading != null && (
        <p id={headingId} className={styles.heading}>
          {heading}
        </p>
      )}
      <ul
        ref={listRef}
        id={listboxId}
        role="listbox"
        className={styles.list}
        aria-label={heading == null ? ariaLabel : undefined}
        aria-labelledby={heading != null ? headingId : undefined}
      >
        {options.map(({ id: optionId, ...option }) => (
          <SearchOption
            {...option}
            key={optionId}
            id={optionDomId(listboxId, optionId)}
            active={optionId === activeId}
            onClick={() => onSelect?.(optionId)}
          />
        ))}
      </ul>
      {hints != null && hints.length > 0 && (
        <p className={styles.hints}>
          {hints.map((hint, index) => (
            <span key={index} className={styles.hintItem}>
              <kbd className={styles.kbd}>{hint.keys}</kbd>
              {hint.label}
            </span>
          ))}
        </p>
      )}
    </div>
  );
}
