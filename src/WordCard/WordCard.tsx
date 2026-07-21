import { type HTMLAttributes, type ReactNode, useId } from 'react';

import { KanjiCard, type KanjiCardProps } from '../KanjiCard';

import styles from './WordCard.module.css';

/**
 * One kanji in the word's "кандзи в слове" list. Every {@link KanjiCard} prop passes
 * through except the controlled-expand ones — `WordCard` owns those so only one kanji
 * is open at a time.
 */
export interface KanjiInWord extends Omit<
  KanjiCardProps,
  'expanded' | 'onToggleExpanded' | 'scrollIntoViewOnExpand'
> {
  /** Stable identity — the React key and the value matched against `expandedKanjiId`. */
  id: string;
}

/** A collapsible section in the word body (Перевод / Грамматика / Примеры). */
export interface WordSection {
  /** Stable identity — the React key and the value passed to `onToggleSection`. */
  id: string;
  /** Section title, e.g. "Перевод". */
  title: ReactNode;
  /** Body shown while the section is open. A bare `<ol>`/`<ul>` is styled for you. */
  content?: ReactNode;
  /** Whether the section is expanded (controlled). */
  open?: boolean;
}

export interface WordCardProps extends HTMLAttributes<HTMLDivElement> {
  /** The headword, shown large, e.g. 勉強. */
  word: ReactNode;
  /** Part of speech, shown in caps, e.g. "Существительное". */
  pos?: ReactNode;
  /** Reading line under the POS, e.g. "Хирагана: べんきょう". */
  reading?: ReactNode;
  /** Audio handler — its presence renders the play button. */
  onPlay?: () => void;
  /** Accessible label for the play button. Default "Прослушать". */
  playLabel?: string;
  /** Collapsible body sections. Toggle them via {@link onToggleSection} (controlled). */
  sections?: WordSection[];
  /** Called with a section's `id` when its header is clicked. */
  onToggleSection?: (id: string) => void;
  /** Label above the kanji list. Default "Кандзи в слове". */
  kanjiLabel?: ReactNode;
  /** The kanji that make up the word, in order. The count badge is derived from this. */
  kanji?: KanjiInWord[];
  /** `id` of the currently expanded kanji — at most one open at a time (controlled). */
  expandedKanjiId?: string;
  /** Called with a kanji's `id` when its header is clicked. */
  onExpandKanji?: (id: string) => void;
  /** Footer action slot — pass a `<Button fullWidth>`. */
  action?: ReactNode;
}

function Chevron({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="none"
      aria-hidden="true"
    >
      <path
        d="M4 10l4-4 4 4"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

/**
 * The word-detail column, as jpdict renders it beside a search: the headword with its
 * part of speech, reading, and an audio button; a stack of collapsible sections
 * (Перевод / Грамматика / Примеры); the "кандзи в слове" list; and a footer action.
 *
 * Presentational only — it owns no state. The section disclosures are *controlled*
 * (each `WordSection.open` + `onToggleSection`) and so is the kanji list: it renders a
 * {@link KanjiCard} per `kanji` entry and opens the one whose `id` matches
 * `expandedKanjiId`, so at most one is expanded at a time (the `selectedId` pattern from
 * {@link EntryList} / {@link SentenceView}). Opening a kanji scrolls it into view. The
 * footer button is a slot, so navigation and audio stay in the app.
 */
export function WordCard({
  word,
  pos,
  reading,
  onPlay,
  playLabel = 'Прослушать',
  sections,
  onToggleSection,
  kanjiLabel = 'Кандзи в слове',
  kanji,
  expandedKanjiId,
  onExpandKanji,
  action,
  className,
  ...rest
}: WordCardProps) {
  const classes = [styles.card, className ?? ''].filter(Boolean).join(' ');
  const baseId = useId();

  return (
    <div className={classes} {...rest}>
      <header className={styles.header}>
        <span className={styles.word}>{word}</span>
        <div className={styles.identity}>
          {pos != null && <span className={styles.pos}>{pos}</span>}
          {reading != null && <span className={styles.reading}>{reading}</span>}
        </div>
        {onPlay != null && (
          <button type="button" className={styles.play} onClick={onPlay} aria-label={playLabel}>
            <svg width="14" height="14" viewBox="0 0 14 14" fill="currentColor" aria-hidden="true">
              <path d="M3 2.2v9.6a.7.7 0 0 0 1.07.6l7.7-4.8a.7.7 0 0 0 0-1.2l-7.7-4.8A.7.7 0 0 0 3 2.2Z" />
            </svg>
          </button>
        )}
      </header>

      {sections != null && sections.length > 0 && (
        <div className={styles.sections}>
          {sections.map((section) => {
            const contentId = `${baseId}-${section.id}`;
            return (
              <section key={section.id} className={styles.section}>
                <h3 className={styles.sectionHeading}>
                  <button
                    type="button"
                    className={styles.sectionTrigger}
                    aria-expanded={section.open ?? false}
                    aria-controls={contentId}
                    onClick={() => onToggleSection?.(section.id)}
                  >
                    <span className={styles.sectionTitle}>{section.title}</span>
                    <Chevron className={styles.sectionChevron} />
                  </button>
                </h3>
                {section.open && section.content != null && (
                  <div id={contentId} className={styles.sectionContent}>
                    {section.content}
                  </div>
                )}
              </section>
            );
          })}
        </div>
      )}

      {kanji != null && kanji.length > 0 && (
        <section className={styles.kanjiSection}>
          <h3 className={styles.kanjiHeading}>
            <span className={styles.kanjiLabel}>{kanjiLabel}</span>
            <span className={styles.kanjiCount}>{kanji.length}</span>
          </h3>
          <div className={styles.kanjiList}>
            {kanji.map(({ id, ...card }) => (
              <KanjiCard
                key={id}
                {...card}
                expanded={id === expandedKanjiId}
                onToggleExpanded={() => onExpandKanji?.(id)}
                scrollIntoViewOnExpand
              />
            ))}
          </div>
        </section>
      )}

      {action != null && <div className={styles.action}>{action}</div>}
    </div>
  );
}
