import { EntryCard, type EntryCardProps } from '../EntryCard';

import styles from './EntryList.module.css';

export interface EntryListItem extends EntryCardProps {
  /** Stable identity — the React key and the value passed to `onSelect`. */
  id: string;
}

export interface EntryListProps {
  /** The entries to render, in order. */
  items: EntryListItem[];
  /** `id` of the currently highlighted entry (controlled). */
  selectedId?: string;
  /** Called with an entry's `id` when its card is clicked. */
  onSelect?: (id: string) => void;
  /** Labels the list for assistive tech (e.g. "Разбор предложения"). */
  'aria-label'?: string;
  className?: string;
}

/**
 * A vertical list of {@link EntryCard}s — jpdict's search results or the token-by-token
 * breakdown of a sentence. Presentational and controlled: it renders the `items` array,
 * marks the entry whose `id` matches `selectedId`, and reports clicks through `onSelect`.
 * It owns no selection state of its own.
 */
export function EntryList({ items, selectedId, onSelect, className, ...rest }: EntryListProps) {
  const classes = [styles.list, className ?? ''].filter(Boolean).join(' ');

  return (
    <ul className={classes} aria-label={rest['aria-label']}>
      {items.map(({ id, ...card }) => (
        <li key={id} className={styles.item}>
          <EntryCard {...card} selected={id === selectedId} onClick={() => onSelect?.(id)} />
        </li>
      ))}
    </ul>
  );
}
