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
    selected: false,
  },
  argTypes: {
    unit: { control: 'inline-radio', options: ['kanji', 'word', 'phrase'] },
    badge: { control: false },
  },
  parameters: {
    layout: 'padded',
  },
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

/** The active / highlighted row, as picked out by the arrow keys. */
export const Selected: Story = {
  args: { selected: true },
};

/** All three units, stacked as they appear in the popover. */
export const Units: Story = {
  render: (args) => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 4, maxWidth: 460 }}>
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
    </div>
  ),
};
