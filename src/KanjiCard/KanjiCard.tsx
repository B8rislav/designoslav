import { type HTMLAttributes, type ReactNode, useEffect, useRef } from 'react';

import styles from './KanjiCard.module.css';

/** One on'yomi / kun'yomi row: a fixed 音/訓 glyph, a localized label, and the readings. */
export interface KanjiReading {
  /** Localized label shown in bold, e.g. "Оньёми". */
  label: ReactNode;
  /** The readings themselves, e.g. キョウ・ゴウ. */
  readings: ReactNode;
}

/** A radical or a component part: the glyph plus an optional reading and gloss. */
export interface KanjiComponent {
  /** The glyph, e.g. 弓. */
  char: ReactNode;
  /** Optional native reading, e.g. ゆみ. */
  reading?: ReactNode;
  /** Optional localized gloss, e.g. "лук". */
  gloss?: ReactNode;
}

export interface KanjiCardProps extends HTMLAttributes<HTMLDivElement> {
  /** The headword kanji, shown large, e.g. 強. */
  kanji: ReactNode;
  /** The gloss / meaning, e.g. "сильный; крепкий". */
  meaning: ReactNode;
  /** A combined reading summary under the meaning, e.g. キョウ・ゴウ・つよ.い. */
  readings?: ReactNode;
  /** JLPT level badge on the trailing edge, e.g. "JLPT N3". */
  jlpt?: ReactNode;
  /** Stroke-count pill, e.g. "11 черт". */
  strokeCount?: ReactNode;
  /** On'yomi row (音). */
  onyomi?: KanjiReading;
  /** Kun'yomi row (訓). */
  kunyomi?: KanjiReading;
  /** The classifying radical. */
  radical?: KanjiComponent;
  /** Label above the radical. Default "Радикал". */
  radicalLabel?: ReactNode;
  /** The component parts that make up the kanji. */
  parts?: KanjiComponent[];
  /** Label above the parts. Default "Части". */
  partsLabel?: ReactNode;
  /** Label above the stroke-order box. Default "Порядок черт". */
  strokeOrderLabel?: ReactNode;
  /**
   * Stroke-order slot — pass a stroke animation / SVG. When omitted, a placeholder
   * box with a faint watermark of the kanji and {@link strokeOrderHint} is shown.
   */
  strokeOrder?: ReactNode;
  /** Caption in the placeholder stroke-order box. Default "анимация штрихов". */
  strokeOrderHint?: ReactNode;
  /** Footer action slot — pass a `<Button fullWidth>` (kept presentational here). */
  action?: ReactNode;
  /**
   * Controlled expand/collapse. When `onToggleExpanded` is provided, a chevron
   * toggle is rendered and the body (everything below the header) is hidden while
   * `expanded` is false. Leave both unset for an always-open, non-collapsible card.
   */
  expanded?: boolean;
  /**
   * Toggle handler — its presence makes the whole header a clickable toggle (as in
   * jpdict's "кандзи в слове" list). Controlled: pair with `expanded`.
   */
  onToggleExpanded?: () => void;
  /**
   * When the card transitions from collapsed to expanded, scroll it into view — the
   * click-to-open-and-reveal behavior of selecting a token in the sentence view.
   */
  scrollIntoViewOnExpand?: boolean;
}

function Component({ char, reading, gloss }: KanjiComponent) {
  return (
    <span className={styles.component}>
      <span className={styles.componentChar}>{char}</span>
      {(reading != null || gloss != null) && (
        <span className={styles.componentText}>
          {reading != null && <span className={styles.componentReading}>{reading}</span>}
          {gloss}
        </span>
      )}
    </span>
  );
}

/**
 * A kanji detail card, as jpdict renders it beside a search: the headword with its
 * meaning and reading summary, a JLPT badge, stroke count, broken-out on'yomi / kun'yomi
 * readings, the classifying radical, the component parts, and a stroke-order box.
 *
 * Presentational only — it holds no state. Collapse is *controlled* (`expanded` +
 * `onToggleExpanded`); the footer button is a slot (`action`) so navigation stays in
 * the app. Structured content (readings, radical, parts) comes in as typed props; the
 * stroke-order animation comes in via the `strokeOrder` slot.
 */
export function KanjiCard({
  kanji,
  meaning,
  readings,
  jlpt,
  strokeCount,
  onyomi,
  kunyomi,
  radical,
  radicalLabel = 'Радикал',
  parts,
  partsLabel = 'Части',
  strokeOrderLabel = 'Порядок черт',
  strokeOrder,
  strokeOrderHint = 'анимация штрихов',
  action,
  expanded = true,
  onToggleExpanded,
  scrollIntoViewOnExpand = false,
  className,
  ...rest
}: KanjiCardProps) {
  const classes = [styles.card, className ?? ''].filter(Boolean).join(' ');
  const collapsible = onToggleExpanded != null;
  const open = !collapsible || expanded;

  const cardRef = useRef<HTMLDivElement>(null);
  const wasExpanded = useRef(expanded);
  useEffect(() => {
    // Reveal the card only on the collapsed → expanded transition, not on mount.
    if (scrollIntoViewOnExpand && expanded && !wasExpanded.current) {
      cardRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
    wasExpanded.current = expanded;
  }, [expanded, scrollIntoViewOnExpand]);

  const headerInner = (
    <>
      <span className={styles.kanji}>{kanji}</span>
      <div className={styles.identity}>
        <span className={styles.meaning}>{meaning}</span>
        {readings != null && <span className={styles.readingSummary}>{readings}</span>}
      </div>
      <div className={styles.headerAside}>
        {jlpt != null && <span className={styles.jlpt}>{jlpt}</span>}
        {collapsible && (
          <span className={styles.chevronBox} aria-hidden="true">
            <svg className={styles.chevron} width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path
                d="M4 10l4-4 4 4"
                stroke="currentColor"
                strokeWidth="1.75"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </span>
        )}
      </div>
    </>
  );

  return (
    <div ref={cardRef} className={classes} {...rest}>
      {collapsible ? (
        <button
          type="button"
          className={`${styles.header} ${styles.headerToggle}`}
          onClick={onToggleExpanded}
          aria-expanded={expanded}
        >
          {headerInner}
        </button>
      ) : (
        <div className={styles.header}>{headerInner}</div>
      )}

      {open && (
        <div className={styles.body}>
          {strokeCount != null && <span className={styles.strokeCount}>{strokeCount}</span>}

          {(onyomi != null || kunyomi != null) && (
            <div className={styles.readingRows}>
              {onyomi != null && (
                <p className={styles.readingRow}>
                  <span className={styles.readingKind} aria-hidden="true">
                    音
                  </span>
                  <span className={styles.readingLabel}>{onyomi.label}:</span>
                  <span className={styles.readingValue}>{onyomi.readings}</span>
                </p>
              )}
              {kunyomi != null && (
                <p className={styles.readingRow}>
                  <span className={styles.readingKind} aria-hidden="true">
                    訓
                  </span>
                  <span className={styles.readingLabel}>{kunyomi.label}:</span>
                  <span className={styles.readingValue}>{kunyomi.readings}</span>
                </p>
              )}
            </div>
          )}

          {radical != null && (
            <section className={styles.section}>
              <h3 className={styles.sectionLabel}>{radicalLabel}</h3>
              <Component {...radical} />
            </section>
          )}

          {parts != null && parts.length > 0 && (
            <section className={styles.section}>
              <h3 className={styles.sectionLabel}>{partsLabel}</h3>
              <div className={styles.parts}>
                {parts.map((part, i) => (
                  <Component key={i} {...part} />
                ))}
              </div>
            </section>
          )}

          <section className={styles.section}>
            <h3 className={styles.sectionLabel}>{strokeOrderLabel}</h3>
            <div className={styles.strokeOrder}>
              {strokeOrder ?? (
                <>
                  <span className={styles.strokeWatermark} aria-hidden="true">
                    {kanji}
                  </span>
                  {strokeOrderHint != null && (
                    <span className={styles.strokeHint}>{strokeOrderHint}</span>
                  )}
                </>
              )}
            </div>
          </section>

          {action != null && <div className={styles.action}>{action}</div>}
        </div>
      )}
    </div>
  );
}
