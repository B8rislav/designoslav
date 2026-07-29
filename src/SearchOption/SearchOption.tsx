import { forwardRef, type LiHTMLAttributes, type ReactNode } from 'react';

import styles from './SearchOption.module.css';

/** The kind of parse an option offers — drives its badge glyph, accent, and tile tint. */
export type SearchUnitType = 'kanji' | 'word' | 'phrase';

/** Default badge glyph per unit — the CJK shorthand shown on the tile (漢 / 語 / 文). */
const UNIT_GLYPH: Record<SearchUnitType, string> = {
  kanji: '漢',
  word: '語',
  phrase: '文',
};

export interface SearchOptionProps extends Omit<LiHTMLAttributes<HTMLLIElement>, 'onSelect'> {
  /** Parse unit this option represents. Sets the default glyph, accent color, and tile tint. */
  unit: SearchUnitType;
  /** The Japanese text on offer, e.g. 勉強 or 私は毎日日本語を勉強します. Rendered in the CJK face. */
  text: ReactNode;
  /** Secondary line under the text, e.g. "разобрать как слово". Clamped to one line. */
  hint?: ReactNode;
  /** Caps label on the trailing edge, e.g. Слово / Кандзи / Фраза. Localized — pass it in. */
  unitLabel?: ReactNode;
  /** Override the badge glyph. Defaults to 漢 / 語 / 文 based on `unit`. */
  badge?: ReactNode;
  /**
   * Mark this row as the keyboard-active option — the one `aria-activedescendant` points
   * at. Being active is *not* a commitment: the user is browsing, and only Enter or a
   * click commits.
   */
  active?: boolean;
}

/**
 * A single parse option in the search "варианты разбора" popover: a unit badge (漢 / 語 / 文),
 * the Japanese text with a hint line beneath it, and a caps unit label on the trailing edge.
 *
 * Renders as `<li role="option">` and is **not** focusable — it belongs inside a
 * `role="listbox"` whose combobox owns focus and drives the highlight through
 * `aria-activedescendant`. Wire selection through `onClick`. Usually composed by
 * {@link SearchOptionList}; if you render one standalone, put it inside a listbox.
 */
export const SearchOption = forwardRef<HTMLLIElement, SearchOptionProps>(function SearchOption(
  { unit, text, hint, unitLabel, badge, active = false, className, ...rest },
  ref,
) {
  const classes = [styles.option, styles[unit], active ? styles.active : '', className ?? '']
    .filter(Boolean)
    .join(' ');

  return (
    <li ref={ref} role="option" aria-selected={active} className={classes} {...rest}>
      <span className={styles.badge} aria-hidden="true">
        {badge ?? UNIT_GLYPH[unit]}
      </span>
      <span className={styles.body}>
        <span className={styles.text}>{text}</span>
        {hint != null && <span className={styles.hint}>{hint}</span>}
      </span>
      {unitLabel != null && <span className={styles.unitLabel}>{unitLabel}</span>}
    </li>
  );
});
