import { useState } from 'react';

import type { Meta, StoryObj } from '@storybook/react-vite';

import { SearchField } from '../SearchField';

import { SearchOptionList, type SearchOptionItem } from './SearchOptionList';

const meta: Meta<typeof SearchOptionList> = {
  title: 'Components/SearchOptionList',
  component: SearchOptionList,
  args: {
    heading: 'Варианты разбора',
  },
  argTypes: {
    options: { control: false },
    selectedId: { control: false },
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

/** Controlled wrapper — the list is stateless, so stories own the selection. */
function Controlled({ initialId, ...args }: { initialId?: string } & Story['args']) {
  const [selectedId, setSelectedId] = useState(initialId ?? OPTIONS[0].id);
  return (
    <div style={{ maxWidth: 480 }}>
      <SearchOptionList
        {...args}
        options={args?.options ?? OPTIONS}
        selectedId={selectedId}
        onSelect={setSelectedId}
      />
    </div>
  );
}

/** The full "варианты разбора" popover with a heading and the highlighted first option. */
export const Default: Story = {
  render: (args) => <Controlled {...args} />,
};

/** No visible heading — pass an `aria-label` so the list is still named for screen readers. */
export const WithoutHeading: Story = {
  args: { heading: undefined, 'aria-label': 'Варианты разбора' },
  render: (args) => <Controlled {...args} />,
};

/** Composed under the search bar, reproducing the board: field, CTA, then the parse popover. */
export const InSearchContext: Story = {
  render: (args) => {
    function Demo() {
      const [query, setQuery] = useState('勉強');
      const [selectedId, setSelectedId] = useState('word');
      return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12, maxWidth: 480 }}>
          <SearchField
            aria-label="Поиск по словарю"
            value={query}
            onValueChange={setQuery}
            actionLabel="Найти"
            clearLabel="Очистить"
          />
          <SearchOptionList
            {...args}
            options={OPTIONS}
            selectedId={selectedId}
            onSelect={setSelectedId}
          />
        </div>
      );
    }
    return <Demo />;
  },
};
