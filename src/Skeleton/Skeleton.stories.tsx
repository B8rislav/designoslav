import type { Meta, StoryObj } from '@storybook/react-vite';

import { Skeleton } from './Skeleton';

const meta: Meta<typeof Skeleton> = {
  title: 'Components/Skeleton',
  component: Skeleton,
  args: {
    shape: 'text',
    lines: 1,
  },
  argTypes: {
    shape: { control: 'inline-radio', options: ['text', 'block', 'circle'] },
    lines: { control: { type: 'number', min: 1, max: 6 } },
  },
  decorators: [
    (Story) => (
      <div style={{ maxWidth: 480 }}>
        <Story />
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof Skeleton>;

export const Text: Story = {};

/** A pending paragraph — the last bar is drawn short, the way real text ends. */
export const Paragraph: Story = {
  args: { lines: 3 },
};

export const Block: Story = {
  args: { shape: 'block', height: 160 },
};

export const Circle: Story = {
  args: { shape: 'circle', height: 48 },
};

/** How it reads in place: the word inspector's examples section while loading. */
export const PendingExamples: Story = {
  render: () => (
    <div
      aria-busy="true"
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: 16,
        padding: 20,
        borderRadius: 'var(--do-radius-lg)',
        border: '1px solid var(--do-color-border)',
        backgroundColor: 'var(--do-color-surface-raised)',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        <Skeleton shape="circle" height={44} />
        <Skeleton width="45%" height={20} />
      </div>
      <Skeleton lines={3} />
      <Skeleton shape="block" height={80} />
    </div>
  ),
};
