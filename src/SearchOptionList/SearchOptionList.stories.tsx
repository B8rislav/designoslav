import { useState } from 'react';

import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, fn, userEvent, within } from 'storybook/test';

import { SearchField } from '../SearchField';

import { SearchOptionList, type SearchOptionHint, type SearchOptionItem } from './SearchOptionList';

const meta: Meta<typeof SearchOptionList> = {
  title: 'Components/SearchOptionList',
  component: SearchOptionList,
  args: {
    heading: 'Варианты разбора',
  },
  argTypes: {
    options: { control: false },
    activeId: { control: false },
    onSelect: { control: false },
  },
  parameters: {
    layout: 'padded',
  },
};

export default meta;
type Story = StoryObj<typeof SearchOptionList>;

/** The four parse variants offered for 勉強, exactly as they appear on the board. */
const OPTIONS: SearchOptionItem[] = [
  { id: 'word', unit: 'word', text: '勉強', hint: 'разобрать как слово', unitLabel: 'Слово' },
  { id: 'verb', unit: 'word', text: '勉強する', hint: 'учиться · глагол', unitLabel: 'Слово' },
  { id: 'kanji', unit: 'kanji', text: '勉', hint: 'усердие · N3', unitLabel: 'Кандзи' },
  {
    id: 'sentence',
    unit: 'phrase',
    text: '私は毎日日本語を勉強します',
    hint: 'полный разбор предложения',
    unitLabel: 'Фраза',
  },
];

/** The affordances the popover advertises. Localized — jpdict passes its own copy. */
const HINTS: SearchOptionHint[] = [
  { keys: '↑↓', label: 'выбрать' },
  { keys: '↵', label: 'разобрать' },
  { keys: 'esc', label: 'закрыть' },
];

/** Controlled wrapper — the list is stateless, so stories own the highlight. */
function Controlled({ initialId, ...args }: { initialId?: string } & Story['args']) {
  const [activeId, setActiveId] = useState(initialId ?? OPTIONS[0].id);
  return (
    <div style={{ maxWidth: 480 }}>
      <SearchOptionList
        {...args}
        options={args?.options ?? OPTIONS}
        activeId={activeId}
        onSelect={setActiveId}
      />
    </div>
  );
}

/** The full "варианты разбора" popover with a heading and the first option highlighted. */
export const Default: Story = {
  render: (args) => <Controlled {...args} />,
};

/** No visible heading — pass an `aria-label` so the list is still named for screen readers. */
export const WithoutHeading: Story = {
  args: { heading: undefined, 'aria-label': 'Варианты разбора' },
  render: (args) => <Controlled {...args} />,
};

/** With the footer hint bar advertising what the keyboard does. */
export const WithHints: Story = {
  args: { hints: HINTS },
  render: (args) => <Controlled {...args} />,
};

/**
 * More options than fit. The listbox is an overlay, so it is bounded and scrolls internally
 * rather than growing over the page — and the hint bar stays put below the scrollport.
 */
export const Overflowing: Story = {
  args: {
    hints: HINTS,
    options: Array.from({ length: 24 }, (_, index) => ({
      ...OPTIONS[index % OPTIONS.length],
      id: `option-${index}`,
    })),
  },
  render: (args) => <Controlled {...args} />,
};

/* ────────────────────────────────────────────────────────────────────────────
 * The combobox: SearchField owns the keyboard, this list is the presentation.
 * ──────────────────────────────────────────────────────────────────────────── */

function ComboboxDemo({
  options = OPTIONS,
  onCommit,
}: {
  options?: SearchOptionItem[];
  onCommit?: (id: string) => void;
}) {
  const [query, setQuery] = useState('勉強');
  const [expanded, setExpanded] = useState(true);
  const [activeId, setActiveId] = useState<string | undefined>(options[0]?.id);

  const commit = (id: string) => {
    onCommit?.(id);
    setExpanded(false);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12, maxWidth: 480 }}>
      <SearchField
        aria-label="Поиск по словарю"
        value={query}
        onValueChange={setQuery}
        actionLabel="Найти"
        clearLabel="Очистить"
        listboxId="parse-options"
        expanded={expanded}
        optionIds={options.map((option) => option.id)}
        activeOptionId={activeId}
        onActiveOptionChange={setActiveId}
        onOptionCommit={commit}
        onDismiss={() => setExpanded(false)}
      />
      {expanded && (
        <SearchOptionList
          id="parse-options"
          heading="Варианты разбора"
          hints={HINTS}
          options={options}
          activeId={activeId}
          onSelect={commit}
        />
      )}
    </div>
  );
}

/**
 * The popover wired to the field, reproducing the board. Focus never leaves the input:
 * ↑↓ move the highlight, ↵ commits it, esc closes. Moving the highlight commits nothing.
 */
export const InSearchContext: Story = {
  render: () => <ComboboxDemo />,
};

/**
 * The keyboard contract, asserted. This is the behavior the footer hint bar promises —
 * if it regresses, this story fails.
 */
export const KeyboardContract: Story = {
  render: () => <ComboboxDemo />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const input = canvas.getByRole('combobox');

    await userEvent.click(input);
    await expect(input).toHaveFocus();
    await expect(input).toHaveAttribute('aria-expanded', 'true');
    await expect(input).toHaveAttribute('aria-controls', 'parse-options');

    // Options are not tab stops — they live in a listbox the input drives remotely.
    await expect(canvas.getAllByRole('option')).toHaveLength(OPTIONS.length);
    await expect(input).toHaveAttribute('aria-activedescendant', 'parse-options-option-word');

    // ↓ walks forward and reports the highlight through aria-activedescendant.
    await userEvent.keyboard('{ArrowDown}');
    await expect(input).toHaveAttribute('aria-activedescendant', 'parse-options-option-verb');
    await expect(input).toHaveFocus();

    // ↑ walks back and wraps around the top edge.
    await userEvent.keyboard('{ArrowUp}{ArrowUp}');
    await expect(input).toHaveAttribute('aria-activedescendant', 'parse-options-option-sentence');

    // Home / End jump to the ends.
    await userEvent.keyboard('{Home}');
    await expect(input).toHaveAttribute('aria-activedescendant', 'parse-options-option-word');
    await userEvent.keyboard('{End}');
    await expect(input).toHaveAttribute('aria-activedescendant', 'parse-options-option-sentence');

    // The highlighted option is the one marked selected — and only it.
    const selected = canvas.getAllByRole('option', { selected: true });
    await expect(selected).toHaveLength(1);
    await expect(selected[0]).toHaveAttribute('id', 'parse-options-option-sentence');

    // Typing still works while browsing, because focus never moved.
    await userEvent.keyboard('する');
    await expect(input).toHaveValue('勉強する');
  },
};

/** Escape dismisses the popover without clearing the query. */
export const EscapeDismisses: Story = {
  render: () => <ComboboxDemo />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const input = canvas.getByRole('combobox');

    await userEvent.click(input);
    await userEvent.keyboard('{Escape}');

    await expect(canvas.queryByRole('listbox')).not.toBeInTheDocument();
    // type="search" clears itself on Escape in some browsers — the query must survive.
    await expect(input).toHaveValue('勉強');
  },
};

/** Enter commits the highlighted option rather than submitting the query. */
const onCommit = fn();

export const EnterCommits: Story = {
  render: () => <ComboboxDemo onCommit={onCommit} />,
  beforeEach: () => {
    onCommit.mockClear();
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const input = canvas.getByRole('combobox');

    await userEvent.click(input);
    await userEvent.keyboard('{ArrowDown}{ArrowDown}');
    await expect(input).toHaveAttribute('aria-activedescendant', 'parse-options-option-kanji');

    // Browsing on its own commits nothing — that is the whole point of the split.
    await expect(onCommit).not.toHaveBeenCalled();

    await userEvent.keyboard('{Enter}');
    await expect(onCommit).toHaveBeenCalledWith('kanji');
    // Committing closes the popover; the query is untouched.
    await expect(canvas.queryByRole('listbox')).not.toBeInTheDocument();
    await expect(input).toHaveValue('勉強');
  },
};
