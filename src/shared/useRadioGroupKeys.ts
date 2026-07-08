import { useRef, type KeyboardEvent } from 'react';

export interface RadioGroupItem<Value extends string = string> {
  value: Value;
  disabled?: boolean;
}

export interface UseRadioGroupKeysParams<Value extends string> {
  /** The selectable items, in DOM order — each must render as a `[role="radio"]`. */
  options: readonly RadioGroupItem<Value>[];
  /** Currently selected value. */
  value: Value;
  /** Called with the newly selected value on click or keyboard navigation. */
  onChange: (value: Value) => void;
}

/**
 * Shared WAI-ARIA `radiogroup` keyboard + roving-focus behavior for single-select
 * pill controls (SegmentedControl, ToggleGroup). Arrow keys move both focus and
 * selection between enabled options, wrapping around; Home/End jump to the first/last
 * enabled option — matching native radio-button behavior.
 *
 * Attach `rootRef` to the `radiogroup` container and `onKeyDown={handleKeyDown}`; each
 * option renders as a `<button role="radio">` with `tabIndex={selected ? 0 : -1}`.
 */
export function useRadioGroupKeys<Value extends string = string>({
  options,
  value,
  onChange,
}: UseRadioGroupKeysParams<Value>) {
  const rootRef = useRef<HTMLDivElement>(null);

  const selectByIndex = (index: number) => {
    const option = options[index];
    if (!option || option.disabled) return;
    onChange(option.value);
    rootRef.current?.querySelectorAll<HTMLButtonElement>('[role="radio"]')[index]?.focus();
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    const currentIndex = options.findIndex((option) => option.value === value);
    const enabledIndexes = options
      .map((_option, index) => index)
      .filter((index) => !options[index].disabled);
    if (enabledIndexes.length === 0) return;

    const step = (delta: number) => {
      const pos = enabledIndexes.indexOf(currentIndex);
      const base = pos === -1 ? 0 : pos;
      const next = enabledIndexes[(base + delta + enabledIndexes.length) % enabledIndexes.length];
      selectByIndex(next);
    };

    switch (event.key) {
      case 'ArrowRight':
      case 'ArrowDown':
        event.preventDefault();
        step(1);
        break;
      case 'ArrowLeft':
      case 'ArrowUp':
        event.preventDefault();
        step(-1);
        break;
      case 'Home':
        event.preventDefault();
        selectByIndex(enabledIndexes[0]);
        break;
      case 'End':
        event.preventDefault();
        selectByIndex(enabledIndexes[enabledIndexes.length - 1]);
        break;
      default:
        break;
    }
  };

  return { rootRef, handleKeyDown };
}
