import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';

import { Switch } from './Switch';

const meta: Meta<typeof Switch> = {
  title: 'Components/Switch',
  component: Switch,
  args: {
    label: 'Фуригана',
    checked: true,
    size: 'm',
    disabled: false,
  },
  argTypes: {
    size: { control: 'inline-radio', options: ['m', 'l'] },
    labelPosition: { control: 'inline-radio', options: ['start', 'end'] },
    onChange: { action: 'changed' },
  },
};

export default meta;
type Story = StoryObj<typeof Switch>;

/** Interactive: click the track or the label — both toggle, as one control. */
export const Furigana: Story = {
  render: (args) => {
    const [checked, setChecked] = useState(args.checked);
    return <Switch {...args} checked={checked} onChange={setChecked} />;
  },
};

export const Off: Story = {
  args: { checked: false },
};

export const Sizes: Story = {
  render: (args) => (
    <div style={{ display: 'flex', gap: 24, alignItems: 'center' }}>
      <Switch {...args} size="m" label="Фуригана" />
      <Switch {...args} size="l" label="Пиньинь" />
    </div>
  ),
};

/** The label can lead, for right-aligned clusters like the search band's toggle. */
export const LabelStart: Story = {
  args: { labelPosition: 'start' },
};

/** No visible label — `aria-label` then carries the accessible name. */
export const NoLabel: Story = {
  args: { label: undefined, 'aria-label': 'Показывать фуригану' },
};

export const Disabled: Story = {
  render: (args) => (
    <div style={{ display: 'flex', gap: 24, alignItems: 'center' }}>
      <Switch {...args} disabled checked label="Фуригана" />
      <Switch {...args} disabled checked={false} label="Пиньинь" />
    </div>
  ),
};
