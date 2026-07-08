import { forwardRef, type ButtonHTMLAttributes, type ReactNode } from 'react';

import styles from './EntryCard.module.css';

/** Parts of speech that carry a colored accent (matches the palette POS dots). */
export type EntryPartOfSpeech = 'noun' | 'verb' | 'particle' | 'pronoun';

export interface EntryCardProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  /** The headword — kanji or kana, e.g. 私. */
  headword: ReactNode;
  /** Furigana reading shown above the headword, e.g. わたし. */
  reading?: ReactNode;
  /** Part of speech — drives the left accent bar and the label color. */
  pos?: EntryPartOfSpeech;
  /** Localized POS label shown in caps next to the meaning, e.g. "Местоимение". */
  posLabel?: ReactNode;
  /** Japanese POS tag shown subtly on the trailing edge, e.g. 代名詞. */
  posTag?: ReactNode;
  /** The gloss / meaning, e.g. "я, 1-е лицо". */
  gloss: ReactNode;
  /** Highlight this card as the active entry (celadon border + tint). */
  selected?: boolean;
}

/**
 * A single clickable dictionary entry, as one row in a search-results list: a colored
 * part-of-speech accent, the headword with its furigana reading, the localized meaning,
 * and the Japanese POS tag on the trailing edge. Renders as a `<button>` — wire real
 * navigation via `onClick` (a native button attribute, passed straight through).
 *
 * Presentational only: it holds no state and does not know what a click does.
 */
export const EntryCard = forwardRef<HTMLButtonElement, EntryCardProps>(function EntryCard(
  {
    headword,
    reading,
    pos,
    posLabel,
    posTag,
    gloss,
    selected = false,
    type = 'button',
    className,
    ...rest
  },
  ref,
) {
  const classes = [
    styles.card,
    pos ? styles[pos] : '',
    selected ? styles.selected : '',
    className ?? '',
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <button
      ref={ref}
      type={type}
      className={classes}
      aria-current={selected || undefined}
      {...rest}
    >
      <span className={styles.accent} aria-hidden="true" />
      <span className={styles.headwordBlock}>
        {reading != null && <span className={styles.reading}>{reading}</span>}
        <span className={styles.headword}>{headword}</span>
      </span>
      <span className={styles.body}>
        {posLabel != null && <span className={styles.posLabel}>{posLabel}</span>}
        <span className={styles.gloss}>{gloss}</span>
      </span>
      {posTag != null && <span className={styles.posTag}>{posTag}</span>}
    </button>
  );
});
