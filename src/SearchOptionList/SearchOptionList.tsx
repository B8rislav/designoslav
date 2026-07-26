import { useId, type ReactNode } from 'react';

import { SearchOption, type SearchOptionProps } from '../SearchOption';

import styles from './SearchOptionList.module.css';

export interface SearchOptionItem extends SearchOptionProps {
  /** Stable identity — the React key and the value reported to `onSelect`. */
  id: string;
}

export interface SearchOptionListProps {
  /** The parse options to render, in order. */
  options: SearchOptionItem[];
  /** `id` of the currently highlighted option (controlled). */
  selectedId?: string;
  /** Called with an option's `id` when it is clicked. */
  onSelect?: (id: string) => void;
  /** Optional visible header for the popover, e.g. "Варианты разбора". */
  heading?: ReactNode;
  /** Labels the list for assistive tech when there is no visible `heading`. */
  'aria-label'?: string;
  className?: string;
}

/**
 * The search "варианты разбора" popover: a raised card holding an optional heading and a
 * vertical list of {@link SearchOption}s. Presentational and controlled — it renders the
 * `options` array, highlights the one whose `id` matches `selectedId`, and reports clicks
 * through `onSelect`. It owns no selection state of its own.
 */
export function SearchOptionList({
  options,
  selectedId,
  onSelect,
  heading,
  className,
  ...rest
}: SearchOptionListProps) {
  const headingId = useId();
  const classes = [styles.popover, className ?? ''].filter(Boolean).join(' ');

  return (
    <div className={classes}>
      {heading != null && (
        <p id={headingId} className={styles.heading}>
          {heading}
        </p>
      )}
      <ul
        className={styles.list}
        aria-label={heading == null ? rest['aria-label'] : undefined}
        aria-labelledby={heading != null ? headingId : undefined}
      >
        {options.map(({ id, ...option }) => (
          <li key={id} className={styles.item}>
            <SearchOption {...option} selected={id === selectedId} onClick={() => onSelect?.(id)} />
          </li>
        ))}
      </ul>
    </div>
  );
}
