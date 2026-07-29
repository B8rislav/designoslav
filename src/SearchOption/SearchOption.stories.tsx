import type { Meta, StoryObj } from '@storybook/react-vite';

import { SearchOption } from './SearchOption';

const meta: Meta<typeof SearchOption> = {
  title: 'Components/SearchOption',
  component: SearchOption,
  args: {
    unit: 'word',
    text: '勉強',
    hint: 'разобрать как слово',
    unitLabel: 'Слово',
    active: false,
  },
  argTypes: {
    unit: { control: 'inline-radio', options: ['kanji', 'word', 'phrase'] },
    badge: { control: false },
  },
  parameters: {
    layout: 'padded',
  },
  // An option is only valid inside a listbox — rendering one bare would be invalid HTML
  // and would strip its role from the accessibility tree.
  decorators: [
    (Story) => (
      <ul
        role="listbox"
        aria-label="Варианты разбора"
        style={{ margin: 0, padding: 0, listStyle: 'none', maxWidth: 460 }}
      >
        <Story />
      </ul>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof SearchOption>;

/** Parse the query as a single dictionary word — the 語 badge. */
export const Word: Story = {};

/** Parse the query as a kanji — the 漢 badge, terracotta accent. */
export const Kanji: Story = {
  args: { unit: 'kanji', text: '勉', hint: 'усердие · N3', unitLabel: 'Кандзи' },
};

/** Parse the whole query as a sentence — the 文 badge. */
export const Phrase: Story = {
  args: {
    unit: 'phrase',
    text: '私は毎日日本語を勉強します',
    hint: 'полный разбор предложения',
    unitLabel: 'Фраза',
  },
};

/**
 * The keyboard-active row. Options are never focused, so this highlight is the only signal
 * the user has about where the arrow keys have landed.
 */
export const Active: Story = {
  args: { active: true },
};

/**
 * Long content. The Japanese text wraps rather than truncating — the user has to be able to
 * read the whole candidate before committing to parse it — while the hint clamps to one
 * line so rows stay predictable in the scrollport.
 */
export const LongContent: Story = {
  args: {
    unit: 'phrase',
    text: '私は毎日日本語を勉強していますが、漢字を覚えるのはとても難しいと思います',
    hint: 'полный разбор предложения со всеми частицами и вспомогательными глаголами',
    unitLabel: 'Фраза',
  },
};

/** All three units, stacked as they appear in the popover. */
export const Units: Story = {
  render: (args) => (
    <>
      <SearchOption
        {...args}
        unit="word"
        text="勉強"
        hint="разобрать как слово"
        unitLabel="Слово"
      />
      <SearchOption
        {...args}
        unit="word"
        text="勉強する"
        hint="учиться · глагол"
        unitLabel="Слово"
      />
      <SearchOption {...args} unit="kanji" text="勉" hint="усердие · N3" unitLabel="Кандзи" />
      <SearchOption
        {...args}
        unit="phrase"
        text="私は毎日日本語を勉強します"
        hint="полный разбор предложения"
        unitLabel="Фраза"
      />
    </>
  ),
};
