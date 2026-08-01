import { useCallback, useRef, type CSSProperties, type ReactNode } from 'react';
import { List } from 'react-window';

import { VocabRow, type VocabRowProps } from '../VocabRow';

import styles from './VocabList.module.css';

export interface VocabListItem extends VocabRowProps {
  /** Stable identity — the React key. */
  id: string;
}

export interface VocabListProps {
  /** The rows to render, in order. */
  items: VocabListItem[];
  /**
   * Height of the scrollport. A virtualized list must know its own height, so this
   * is required rather than inferred — see the note on the component.
   */
  height: number | string;
  /** Row height in pixels, gap included. Must match the CSS; default 76. */
  rowHeight?: number;
  /**
   * Called when the user scrolls within {@link endReachedThreshold} rows of the end.
   * Fires **once per crossing**, not once per render: it re-arms only after the
   * visible range moves back out of the threshold, so a handler that appends rows
   * cannot drive itself in a loop.
   */
  onEndReached?: () => void;
  /** How many rows from the end trigger {@link onEndReached}. Default 5. */
  endReachedThreshold?: number;
  /** Shown as a trailing row while the next page is in flight. */
  loadingLabel?: ReactNode;
  /** Whether that trailing row is present. */
  loadingMore?: boolean;
  /** Labels the list for assistive tech, e.g. «Сохранённые слова». */
  'aria-label': string;
  className?: string;
}

interface RowProps {
  items: VocabListItem[];
  loadingLabel: ReactNode;
}

function ListRow({
  index,
  style,
  ariaAttributes,
  items,
  loadingLabel,
}: {
  index: number;
  style: CSSProperties;
  ariaAttributes: { 'aria-posinset': number; 'aria-setsize': number; role: 'listitem' };
} & RowProps) {
  const item = items[index];

  // Past the end of `items` means the trailing loading row.
  if (!item) {
    return (
      <div style={style} className={styles.rowSlot} {...ariaAttributes}>
        <div className={styles.loading}>{loadingLabel}</div>
      </div>
    );
  }

  const { id: _id, ...row } = item;
  return (
    <div style={style} className={styles.rowSlot} {...ariaAttributes}>
      <VocabRow {...row} />
    </div>
  );
}

/**
 * The dictionary's saved-card list, virtualized with `react-window` so a collection of
 * any size renders a constant number of DOM nodes.
 *
 * **This component owns a scroll container.** That is a deliberate exception to the
 * design system's "in-flow lists are unbounded" rule (CLAUDE.md, interaction contract
 * 3): virtualization is only possible against a known viewport, so the list must be
 * given a `height` and scrolls within it. Reach for {@link EntryList} instead when the
 * collection is small enough to let the page scroll.
 */
export function VocabList({
  items,
  height,
  rowHeight = 76,
  onEndReached,
  endReachedThreshold = 5,
  loadingLabel,
  loadingMore = false,
  className,
  ...rest
}: VocabListProps) {
  const rowCount = items.length + (loadingMore ? 1 : 0);
  // Latched so the callback fires on entering the end zone, not on every render
  // while inside it — react-window reports rendered rows after each render, so an
  // unlatched call would re-enter any handler that causes one.
  const atEndRef = useRef(false);

  const handleRowsRendered = useCallback(
    (visible: { startIndex: number; stopIndex: number }) => {
      if (!onEndReached || rowCount === 0) return;

      const nearEnd = visible.stopIndex >= rowCount - 1 - endReachedThreshold;
      if (!nearEnd) {
        atEndRef.current = false;
        return;
      }
      if (atEndRef.current) return;

      atEndRef.current = true;
      onEndReached();
    },
    [onEndReached, rowCount, endReachedThreshold],
  );

  return (
    <List
      className={[styles.list, className ?? ''].filter(Boolean).join(' ')}
      style={{ height }}
      role="list"
      aria-label={rest['aria-label']}
      rowCount={rowCount}
      rowHeight={rowHeight}
      rowComponent={ListRow}
      rowProps={{ items, loadingLabel }}
      onRowsRendered={onEndReached ? handleRowsRendered : undefined}
    />
  );
}
