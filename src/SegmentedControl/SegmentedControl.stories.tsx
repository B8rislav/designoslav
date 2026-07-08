import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';

import { SegmentedControl } from './SegmentedControl';

const meta: Meta<typeof SegmentedControl> = {
  title: 'Components/SegmentedControl',
  component: SegmentedControl,
  args: {
    'aria-label': 'Display language',
    options: [
      { value: 'ja', label: '日本語' },
      { value: 'zh', label: '中文' },
    ],
    value: 'ja',
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
type Story = StoryObj<typeof SegmentedControl>;

/** Interactive: click a segment or use the arrow keys to change the selection. */
export const LanguageSwitch: Story = {
  render: (args) => {
    const [value, setValue] = useState(args.value);
    return <SegmentedControl {...args} value={value} onChange={setValue} />;
  },
};

export const Large: Story = {
  render: (args) => {
    const [value, setValue] = useState(args.value);
    return <SegmentedControl {...args} size="l" value={value} onChange={setValue} />;
  },
};

export const FullWidth: Story = {
  render: (args) => {
    const [value, setValue] = useState(args.value);
    return (
      <div style={{ width: 320 }}>
        <SegmentedControl {...args} fullWidth value={value} onChange={setValue} />
      </div>
    );
  },
};

/** Three-way segmented control, to show the pattern isn't limited to two options. */
export const ThreeOptions: Story = {
  args: {
    'aria-label': 'Text size',
    options: [
      { value: 'sm', label: 'Small' },
      { value: 'md', label: 'Medium' },
      { value: 'lg', label: 'Large' },
    ],
    value: 'md',
  },
  render: (args) => {
    const [value, setValue] = useState(args.value);
    return <SegmentedControl {...args} value={value} onChange={setValue} />;
  },
};

export const Disabled: Story = {
  args: { disabled: true },
};
