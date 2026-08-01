import { useCallback, useRef, type CSSProperties } from 'react';
import { Grid } from 'react-window';

import { CardTile, type CardTileProps } from '../CardTile';

import styles from './CardGrid.module.css';

export interface CardGridItem extends CardTileProps {
  /** Stable identity — the React key. */
  id: string;
}

export interface CardGridProps {
  /** The tiles to render, in order. */
  items: CardGridItem[];
  /** Number of columns. The caller owns responsiveness — see the note on the component. */
  columnCount: number;
  /** Height of the scrollport. Required: virtualization needs a known viewport. */
  height: number | string;
  /** Row height in pixels, gap included. Must match the CSS; default 190. */
  rowHeight?: number;
  /**
   * Called when the last row comes into view. Latched like {@link VocabList}: fires on
   * entering the end zone, not once per render.
   */
  onEndReached?: () => void;
  /** Labels the grid for assistive tech, e.g. «Сохранённые кандзи». */
  'aria-label': string;
  className?: string;
}

interface CellProps {
  items: CardGridItem[];
  columnCount: number;
}

function GridCell({
  columnIndex,
  rowIndex,
  style,
  items,
  columnCount,
}: {
  columnIndex: number;
  rowIndex: number;
  style: CSSProperties;
} & CellProps) {
  const item = items[rowIndex * columnCount + columnIndex];
  if (!item) return null;

  const { id: _id, ...tile } = item;
  return (
    <div style={style} className={styles.cell}>
      <CardTile {...tile} />
    </div>
  );
}

/**
 * A virtualized grid of {@link CardTile}s — the dictionary's kanji deck.
 *
 * **This component owns a scroll container**, the same deliberate exception to the
 * "in-flow lists are unbounded" rule that {@link VocabList} takes (CLAUDE.md,
 * interaction contract 3): virtualization requires a known viewport.
 *
 * `columnCount` is a prop rather than something measured internally. A virtualized grid
 * has to know its geometry before it can decide what to render, so the caller — which
 * already knows its own breakpoints — owns that decision, and the component stays
 * presentational and testable at any fixed width.
 */
export function CardGrid({
  items,
  columnCount,
  height,
  rowHeight = 190,
  onEndReached,
  className,
  ...rest
}: CardGridProps) {
  const rowCount = Math.ceil(items.length / Math.max(1, columnCount));
  const atEndRef = useRef(false);

  const handleCellsRendered = useCallback(
    (visible: { rowStartIndex: number; rowStopIndex: number }) => {
      if (!onEndReached || rowCount === 0) return;

      const nearEnd = visible.rowStopIndex >= rowCount - 1;
      if (!nearEnd) {
        atEndRef.current = false;
        return;
      }
      if (atEndRef.current) return;

      atEndRef.current = true;
      onEndReached();
    },
    [onEndReached, rowCount],
  );

  return (
    <Grid<CellProps>
      className={[styles.grid, className ?? ''].filter(Boolean).join(' ')}
      style={{ height }}
      aria-label={rest['aria-label']}
      columnCount={columnCount}
      columnWidth={`${100 / Math.max(1, columnCount)}%`}
      rowCount={rowCount}
      rowHeight={rowHeight}
      cellComponent={GridCell}
      cellProps={{ items, columnCount }}
      onCellsRendered={onEndReached ? handleCellsRendered : undefined}
    />
  );
}
