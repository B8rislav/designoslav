import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';

import { ToggleGroup } from './ToggleGroup';

const meta: Meta<typeof ToggleGroup> = {
  title: 'Components/ToggleGroup',
  component: ToggleGroup,
  args: {
    'aria-label': 'Тип записи',
    options: [
      { value: 'kanji', label: '漢字 · Кандзи' },
      { value: 'word', label: '単語 · Слово' },
      { value: 'sentence', label: '文 · Предложение' },
    ],
    value: 'sentence',
    size: 'm',
    fullWidth: false,
    disabled: false,
  },
  argTypes: {
    size: { control: 'inline-radio', options: ['m', 'l'] },
    onChange: { action: 'changed' },
  },
};

export default meta;
type Story = StoryObj<typeof ToggleGroup>;

/** jpdict's search-scope picker, as discrete pills: kanji, word, or sentence. */
export const EntryType: Story = {
  render: (args) => {
    const [value, setValue] = useState(args.value);
    return <ToggleGroup {...args} value={value} onChange={setValue} />;
  },
};

export const Large: Story = {
  render: (args) => {
    const [value, setValue] = useState(args.value);
    return <ToggleGroup {...args} size="l" value={value} onChange={setValue} />;
  },
};

export const FullWidth: Story = {
  render: (args) => {
    const [value, setValue] = useState(args.value);
    return (
      <div style={{ width: 420 }}>
        <ToggleGroup {...args} fullWidth value={value} onChange={setValue} />
      </div>
    );
  },
};

/** A single disabled pill mixed with enabled ones — arrow keys skip it. */
export const OneOptionDisabled: Story = {
  args: {
    options: [
      { value: 'kanji', label: '漢字 · Кандзи' },
      { value: 'word', label: '単語 · Слово', disabled: true },
      { value: 'sentence', label: '文 · Предложение' },
    ],
    value: 'kanji',
  },
  render: (args) => {
    const [value, setValue] = useState(args.value);
    return <ToggleGroup {...args} value={value} onChange={setValue} />;
  },
};

export const Disabled: Story = {
  args: { disabled: true },
};
