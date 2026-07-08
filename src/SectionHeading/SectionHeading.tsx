import { type HTMLAttributes, type ReactNode } from 'react';

import styles from './SectionHeading.module.css';

export interface SectionHeadingProps extends HTMLAttributes<HTMLHeadingElement> {
  /** The heading text. */
  children: ReactNode;
  /** Semantic heading level — pick to fit the document outline. Default `h2`. */
  as?: 'h1' | 'h2' | 'h3' | 'h4';
}

/**
 * A section title marked by a vertical celadon accent bar — the header above a block
 * of content (e.g. "Предложение" over a sentence breakdown). Presentational: renders a
 * single heading element; choose its level with `as` so it slots into the page outline.
 */
export function SectionHeading({
  as: Tag = 'h2',
  className,
  children,
  ...rest
}: SectionHeadingProps) {
  const classes = [styles.heading, className ?? ''].filter(Boolean).join(' ');
  return (
    <Tag className={classes} {...rest}>
      {children}
    </Tag>
  );
}
