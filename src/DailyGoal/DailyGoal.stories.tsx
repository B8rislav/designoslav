import type { Meta, StoryObj } from '@storybook/react-vite';

import { DailyGoal } from './DailyGoal';

const meta: Meta<typeof DailyGoal> = {
  title: 'Components/DailyGoal',
  component: DailyGoal,
  args: {
    value: 4,
    target: 10,
    label: 'Дневная цель',
    caption: '4 из 10 карточек',
  },
  parameters: {
    layout: 'padded',
  },
};

export default meta;
type Story = StoryObj<typeof DailyGoal>;

/** The daily review goal at 40% — four of ten cards done. */
export const Default: Story = {
  render: (args) => (
    <div style={{ maxWidth: 320 }}>
      <DailyGoal {...args} />
    </div>
  ),
};

/** Nothing reviewed yet — an empty ring. */
export const Empty: Story = {
  args: { value: 0, target: 10, caption: '0 из 10 карточек' },
  render: (args) => (
    <div style={{ maxWidth: 320 }}>
      <DailyGoal {...args} />
    </div>
  ),
};

/** Goal reached — the ring is full. */
export const Complete: Story = {
  args: { value: 10, target: 10, caption: 'Цель выполнена' },
  render: (args) => (
    <div style={{ maxWidth: 320 }}>
      <DailyGoal {...args} />
    </div>
  ),
};

/** Caption falls back to `value / target` when none is given. */
export const DefaultCaption: Story = {
  args: { value: 7, target: 10, caption: undefined },
  render: (args) => (
    <div style={{ maxWidth: 320 }}>
      <DailyGoal {...args} />
    </div>
  ),
};
