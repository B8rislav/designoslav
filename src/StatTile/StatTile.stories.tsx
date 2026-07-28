import type { Meta, StoryObj } from '@storybook/react-vite';

import { StatTile } from './StatTile';

const meta: Meta<typeof StatTile> = {
  title: 'Components/StatTile',
  component: StatTile,
  args: {
    value: 6,
    label: 'Изучено',
    variant: 'muted',
  },
  argTypes: {
    variant: { control: 'inline-radio', options: ['raised', 'muted'] },
  },
  parameters: {
    layout: 'padded',
  },
};

export default meta;
type Story = StoryObj<typeof StatTile>;

/** A single stat: the figure centered over its caps label. */
export const Default: Story = {
  render: (args) => (
    <div style={{ maxWidth: 200 }}>
      <StatTile {...args} />
    </div>
  ),
};

/** The review dashboard's stat row — to-review, new, learned. */
export const Row: Story = {
  render: () => (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16, maxWidth: 560 }}>
      <StatTile value={2} label="К повторению" />
      <StatTile value={2} label="Новые" />
      <StatTile value={6} label="Изучено" />
    </div>
  ),
};
