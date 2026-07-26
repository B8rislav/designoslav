import { useState } from 'react';

import type { Meta, StoryObj } from '@storybook/react-vite';

import { SearchField } from './SearchField';

const meta: Meta<typeof SearchField> = {
  title: 'Components/SearchField',
  component: SearchField,
  args: {
    'aria-label': 'Поиск по словарю',
    placeholder: 'Найти слово, кандзи или предложение',
    size: 'm',
    fullWidth: false,
    clearable: true,
    clearLabel: 'Очистить',
    actionLabel: 'Найти',
    disabled: false,
  },
  argTypes: {
    size: { control: 'inline-radio', options: ['m', 'l'] },
    value: { control: false },
    onValueChange: { control: false },
    onSubmit: { control: false },
    icon: { control: false },
  },
  parameters: {
    layout: 'padded',
  },
};

export default meta;
type Story = StoryObj<typeof SearchField>;

/** Controlled wrapper — the component is stateless, so stories own the query state. */
function Controlled({ initial = '', ...args }: { initial?: string } & Story['args']) {
  const [value, setValue] = useState(initial);
  return (
    <div style={{ maxWidth: 620 }}>
      <SearchField
        {...args}
        aria-label={args?.['aria-label'] ?? 'Поиск по словарю'}
        value={value}
        onValueChange={setValue}
        onSubmit={(q) => window.alert(`Найти: ${q}`)}
      />
    </div>
  );
}

/** The dictionary search bar as it appears on the board — icon, input, and the Найти CTA. */
export const Default: Story = {
  render: (args) => <Controlled {...args} initial="私は毎日日本語を勉強します" />,
};

/** Empty state showing the placeholder. */
export const Empty: Story = {
  render: (args) => <Controlled {...args} />,
};

/** Full-width, larger size — the hero search at the top of a page. */
export const FullWidth: Story = {
  args: { size: 'l', fullWidth: true },
  render: (args) => <Controlled {...args} initial="日本語" />,
};

/** Standalone field with no trailing button — submit happens on Enter alone. */
export const WithoutActionButton: Story = {
  args: { actionLabel: undefined },
  render: (args) => <Controlled {...args} initial="勉強" />,
};

export const Disabled: Story = {
  args: { disabled: true },
  render: (args) => <Controlled {...args} initial="日本語" />,
};

/** Both sizes side by side. */
export const Sizes: Story = {
  render: (args) => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16, maxWidth: 620 }}>
      <Controlled {...args} size="m" initial="毎日" />
      <Controlled {...args} size="l" initial="毎日" />
    </div>
  ),
};
