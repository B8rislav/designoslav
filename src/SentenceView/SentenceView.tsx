import { type ReactNode } from 'react';

import { type EntryPartOfSpeech } from '../EntryCard';
import { useRadioGroupKeys } from '../shared/useRadioGroupKeys';

import styles from './SentenceView.module.css';

export interface SentenceToken<Value extends string = string> {
  /** Stable identity — matches the corresponding EntryList item's `id`. */
  id: Value;
  /** The surface form shown in the strip, e.g. 私. */
  text: ReactNode;
  /** Part of speech — colors the token text and its underline. */
  pos?: EntryPartOfSpeech;
}

export interface SentenceViewProps<Value extends string = string> {
  /** The sentence split into tokens, in reading order. */
  tokens: SentenceToken<Value>[];
  /** `id` of the currently highlighted token (controlled). */
  selectedId?: Value;
  /** Called with a token's `id` when it is clicked or selected via the keyboard. */
  onSelect?: (id: Value) => void;
  /** Labels the strip for assistive tech (e.g. "Разбор предложения"). */
  'aria-label': string;
  className?: string;
}

const noop = () => {};

/**
 * A tokenized sentence, shown as a strip of clickable tokens each colored by its part
 * of speech with a matching underline — the selected token is boxed. Pairs with
 * {@link EntryList}: share one `selectedId` between them so highlighting the token and
 * its entry stays in sync. Implements the WAI-ARIA `radiogroup` pattern (arrow keys move
 * between tokens) via the shared {@link useRadioGroupKeys} behavior; controlled only.
 */
export function SentenceView<Value extends string = string>({
  tokens,
  selectedId,
  onSelect,
  className,
  ...rest
}: SentenceViewProps<Value>) {
  // With nothing selected, keep the first token keyboard-reachable (roving tabindex).
  const rovingId = selectedId ?? tokens[0]?.id;

  const { rootRef, handleKeyDown } = useRadioGroupKeys({
    options: tokens.map((token) => ({ value: token.id })),
    value: rovingId ?? ('' as Value),
    onChange: onSelect ?? noop,
  });

  const classes = [styles.strip, className ?? ''].filter(Boolean).join(' ');

  return (
    <div
      ref={rootRef}
      role="radiogroup"
      aria-label={rest['aria-label']}
      className={classes}
      onKeyDown={handleKeyDown}
    >
      {tokens.map((token) => {
        const selected = token.id === selectedId;
        return (
          <button
            key={token.id}
            type="button"
            role="radio"
            aria-checked={selected}
            tabIndex={token.id === rovingId ? 0 : -1}
            className={[
              styles.token,
              token.pos ? styles[token.pos] : '',
              selected ? styles.selected : '',
            ]
              .filter(Boolean)
              .join(' ')}
            onClick={() => onSelect?.(token.id)}
          >
            {token.text}
          </button>
        );
      })}
    </div>
  );
}
