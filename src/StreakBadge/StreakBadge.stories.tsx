import type { Meta, StoryObj } from '@storybook/react-vite';

import { StreakBadge, type StreakDay } from './StreakBadge';

/** A full week: six days done, today (Sunday) still an open ring. */
const WEEK: StreakDay[] = [
  { label: 'П', state: 'done' },
  { label: 'В', state: 'done' },
  { label: 'С', state: 'done' },
  { label: 'Ч', state: 'done' },
  { label: 'П', state: 'done' },
  { label: 'С', state: 'done' },
  { label: 'В', state: 'today' },
];

const meta: Meta<typeof StreakBadge> = {
  title: 'Components/StreakBadge',
  component: StreakBadge,
  args: {
    count: 7,
    label: 'дней подряд',
    days: WEEK,
    calendarLabel: '6 из 7 дней недели выполнено, сегодня ещё нет',
  },
  argTypes: {
    days: { control: false },
  },
  parameters: {
    layout: 'padded',
  },
};

export default meta;
type Story = StoryObj<typeof StreakBadge>;

/** A seven-day streak with the current day still pending. */
export const Default: Story = {
  render: (args) => (
    <div style={{ maxWidth: 320 }}>
      <StreakBadge {...args} />
    </div>
  ),
};

/** Mid-week, with the days still to come shown faint. */
export const InProgress: Story = {
  args: {
    count: 3,
    days: [
      { label: 'П', state: 'done' },
      { label: 'В', state: 'done' },
      { label: 'С', state: 'done' },
      { label: 'Ч', state: 'today' },
      { label: 'П', state: 'upcoming' },
      { label: 'С', state: 'upcoming' },
      { label: 'В', state: 'upcoming' },
    ],
    calendarLabel: '3 дня выполнено, впереди ещё четыре',
  },
  render: (args) => (
    <div style={{ maxWidth: 320 }}>
      <StreakBadge {...args} />
    </div>
  ),
};
