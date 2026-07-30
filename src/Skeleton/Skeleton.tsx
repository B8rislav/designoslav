import { type CSSProperties, type HTMLAttributes } from 'react';

import styles from './Skeleton.module.css';

export type SkeletonShape = 'text' | 'block' | 'circle';

export interface SkeletonProps extends Omit<HTMLAttributes<HTMLDivElement>, 'children'> {
  /**
   * `text` — a short rounded bar at line height, for a pending word or label.
   * `block` — a filled rectangle, for a pending card. `circle` — an avatar or glyph.
   */
  shape?: SkeletonShape;
  /** CSS width. Defaults to `100%`, or to the height for a circle. */
  width?: number | string;
  /** CSS height. Defaults to one line for `text`, `100%` for `block`. */
  height?: number | string;
  /**
   * Render this many stacked bars instead of one. The last is drawn short, the way
   * a real paragraph ends. `text` shape only.
   */
  lines?: number;
  className?: string;
}

const size = (value: number | string | undefined): string | undefined =>
  typeof value === 'number' ? `${value}px` : value;

/**
 * A placeholder for content that hasn't arrived, shaped like the thing it stands in
 * for. Purely decorative: it is `aria-hidden`, because a screen reader should hear the
 * pending state from the live region that owns the request, not from a pile of empty
 * boxes. Label that region with `aria-busy` on the caller's side.
 *
 * The shimmer is suppressed under `prefers-reduced-motion`, leaving a flat placeholder.
 */
export function Skeleton({
  shape = 'text',
  width,
  height,
  lines = 1,
  className,
  style,
  ...rest
}: SkeletonProps) {
  const classes = [styles.skeleton, styles[shape], className ?? ''].filter(Boolean).join(' ');

  const dimensions: CSSProperties = {
    width: size(width),
    height: size(height),
    ...style,
  };

  if (shape === 'text' && lines > 1) {
    return (
      <div className={styles.stack} aria-hidden="true" style={style} {...rest}>
        {Array.from({ length: lines }, (_, index) => (
          <div
            key={index}
            className={classes}
            style={{
              width: index === lines - 1 ? '60%' : size(width),
              height: size(height),
            }}
          />
        ))}
      </div>
    );
  }

  return <div className={classes} aria-hidden="true" style={dimensions} {...rest} />;
}
