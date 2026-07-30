import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';

import { SearchField } from '../SearchField';
import { Switch } from '../Switch';
import { SearchBand } from './SearchBand';

const meta: Meta<typeof SearchBand> = {
  title: 'Components/SearchBand',
  component: SearchBand,
  parameters: { layout: 'fullscreen' },
  args: {
    eyebrow: '文を分解 · Разбор предложения',
    hint: 'Определяем тип запроса автоматически',
  },
};

export default meta;
type Story = StoryObj<typeof SearchBand>;

/** The band as drawn: kicker, field with its action, hint and the furigana toggle. */
export const Default: Story = {
  render: (args) => {
    const [value, setValue] = useState('私は毎日日本語を勉強します');
    const [furigana, setFurigana] = useState(true);
    return (
      <SearchBand
        {...args}
        aside={<Switch checked={furigana} onChange={setFurigana} label="Фуригана" />}
      >
        <SearchField
          aria-label="Поиск по словарю"
          value={value}
          onValueChange={setValue}
          placeholder="Введите слово или предложение"
          actionLabel="Найти"
          clearLabel="Очистить"
          size="l"
          fullWidth
        />
      </SearchBand>
    );
  },
};

/** Empty field — how the page looks on first load. */
export const Empty: Story = {
  render: (args) => {
    const [value, setValue] = useState('');
    const [furigana, setFurigana] = useState(true);
    return (
      <SearchBand
        {...args}
        aside={<Switch checked={furigana} onChange={setFurigana} label="Фуригана" />}
      >
        <SearchField
          aria-label="Поиск по словарю"
          value={value}
          onValueChange={setValue}
          placeholder="Введите слово или предложение"
          actionLabel="Найти"
          clearLabel="Очистить"
          size="l"
          fullWidth
        />
      </SearchBand>
    );
  },
};

/** Chinese mode — the toggle switches to pinyin, everything else holds. */
export const ChineseMode: Story = {
  render: (args) => {
    const [value, setValue] = useState('我每天学习中文');
    const [pinyin, setPinyin] = useState(false);
    return (
      <SearchBand
        {...args}
        eyebrow="句子分析 · Разбор предложения"
        aside={<Switch checked={pinyin} onChange={setPinyin} label="Пиньинь" />}
      >
        <SearchField
          aria-label="Поиск по словарю"
          value={value}
          onValueChange={setValue}
          actionLabel="Найти"
          clearLabel="Очистить"
          size="l"
          fullWidth
        />
      </SearchBand>
    );
  },
};

/** Field only — no kicker, hint or toggles. */
export const Bare: Story = {
  render: () => {
    const [value, setValue] = useState('');
    return (
      <SearchBand>
        <SearchField
          aria-label="Поиск по словарю"
          value={value}
          onValueChange={setValue}
          actionLabel="Найти"
          size="l"
          fullWidth
        />
      </SearchBand>
    );
  },
};
