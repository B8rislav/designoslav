import { useId, type HTMLAttributes, type ReactNode } from 'react';

import { Badge, type BadgeTone } from '../Badge';
import { DashboardCard } from '../DashboardCard';

import styles from './DeckCard.module.css';

/** One dotted count under the progress bar, e.g. «Повторить · 3». */
export interface DeckCardLegendItem {
  /** Stable key and the dot's color role. */
  tone: BadgeTone;
  label: ReactNode;
}

// `title` is shadowed deliberately: the deck's name is a ReactNode, not the native
// tooltip string. Callers wanting a tooltip can pass one through `className`'s element.
interface DeckCardBase extends Omit<HTMLAttributes<HTMLDivElement>, 'children' | 'title'> {
  /** Deck sigil, shown in a tinted tile — e.g. 漢 or 語. */
  glyph: ReactNode;
  /** Tint behind {@link glyph}. */
  glyphTone?: BadgeTone;
  /** Deck name, e.g. «Кандзи». */
  title: ReactNode;
  /** Native name shown subtly beside the title, e.g. 漢字. */
  nativeTitle?: ReactNode;
  /** Collection size line, e.g. «7 карточек в колоде». */
  caption?: ReactNode;
  /** Marks this as the deck currently being browsed: celadon border + {@link openLabel}. */
  open?: boolean;
  /** Badge text for the open deck, e.g. «Открыта». Rendered only while `open`. */
  openLabel?: ReactNode;
  /** Caps label above today's workload, e.g. «На сегодня». */
  todayLabel?: ReactNode;
  /** Today's workload, e.g. «5 карточек». */
  todayValue?: ReactNode;
  /** Progress caption on the trailing edge, e.g. «2 из 5 сделано». */
  progressLabel?: ReactNode;
  /** Cards completed today — the filled part of the bar. */
  value?: number;
  /** Today's workload as a number — the bar's full width. */
  target?: number;
  /** Dotted counts under the bar (due / new). */
  legend?: DeckCardLegendItem[];
  /**
   * Footer call-to-action — pass a `<Button>`. Kept a sibling of the selection
   * overlay rather than a descendant, so it is never a button inside a button.
   */
  action?: ReactNode;
}

/** Selecting the deck requires an accessible name, since the overlay has no visible text. */
interface DeckCardSelectable {
  /** Called when the card body is activated. */
  onOpen: () => void;
  /** Accessible name for the selection control, e.g. «Открыть колоду Кандзи». */
  selectLabel: string;
}

interface DeckCardStatic {
  onOpen?: never;
  selectLabel?: never;
}

export type DeckCardProps = DeckCardBase & (DeckCardSelectable | DeckCardStatic);

/**
 * A study deck: its sigil and name, how many cards it holds, today's workload with a
 * progress bar and a dotted breakdown, and a footer action.
 *
 * The card is *selectable* and *contains* a call-to-action, which is the classic
 * nested-interactive trap. It is resolved by making the selection control a real
 * `<button>` stretched across the card, and lifting `action` above it — so the two are
 * siblings in the accessibility tree and each gets its own name and focus stop, rather
 * than a button nested inside a clickable card. Pass `onOpen` + `selectLabel` together
 * to enable it; omit both for a static card.
 */
export function DeckCard({
  glyph,
  glyphTone = 'primary',
  title,
  nativeTitle,
  caption,
  open = false,
  openLabel,
  todayLabel,
  todayValue,
  progressLabel,
  value = 0,
  target = 0,
  legend,
  action,
  onOpen,
  selectLabel,
  className,
  ...rest
}: DeckCardProps) {
  const titleId = useId();
  const percent = target > 0 ? Math.max(0, Math.min(100, Math.round((value / target) * 100))) : 0;
  const hasToday = todayValue != null || target > 0;

  const classes = [styles.deck, open ? styles.open : '', className ?? ''].filter(Boolean).join(' ');

  return (
    <DashboardCard className={classes} {...rest}>
      {onOpen && (
        <button
          type="button"
          className={styles.selectOverlay}
          aria-label={selectLabel}
          aria-pressed={open}
          onClick={onOpen}
        />
      )}

      <div className={styles.header}>
        <span className={[styles.glyph, styles[glyphTone]].join(' ')} aria-hidden="true">
          {glyph}
        </span>
        <span className={styles.naming}>
          <span className={styles.titleRow}>
            <span className={styles.title} id={titleId}>
              {title}
            </span>
            {nativeTitle != null && <span className={styles.nativeTitle}>{nativeTitle}</span>}
          </span>
          {caption != null && <span className={styles.caption}>{caption}</span>}
        </span>
        {open && openLabel != null && (
          <Badge className={styles.openBadge} tone="primary" caps>
            {openLabel}
          </Badge>
        )}
      </div>

      {hasToday && (
        <div className={styles.today}>
          <div className={styles.todayRow}>
            <span className={styles.todayLabel}>{todayLabel}</span>
            <span className={styles.todayValue}>{todayValue}</span>
            {progressLabel != null && <span className={styles.progressLabel}>{progressLabel}</span>}
          </div>

          <div
            className={styles.track}
            role="progressbar"
            aria-valuemin={0}
            aria-valuemax={target}
            aria-valuenow={value}
            aria-valuetext={`${percent}%`}
            aria-labelledby={titleId}
          >
            <span className={styles.fill} style={{ inlineSize: `${percent}%` }} />
          </div>
        </div>
      )}

      {(legend?.length || action) && (
        <div className={styles.footer}>
          {legend?.length ? (
            <ul className={styles.legend}>
              {legend.map((item, index) => (
                <li key={index} className={styles.legendItem}>
                  <span className={[styles.dot, styles[item.tone]].join(' ')} aria-hidden="true" />
                  {item.label}
                </li>
              ))}
            </ul>
          ) : (
            <span />
          )}
          {action && <div className={styles.action}>{action}</div>}
        </div>
      )}
    </DashboardCard>
  );
}
