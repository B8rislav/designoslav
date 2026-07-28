import type { Meta, StoryObj } from '@storybook/react-vite';

import { DailyGoal } from '../DailyGoal';
import { SectionHeading } from '../SectionHeading';
import { StatTile } from '../StatTile';
import { StreakBadge, type StreakDay } from '../StreakBadge';

import { DashboardCard } from './DashboardCard';

const meta: Meta<typeof DashboardCard> = {
  title: 'Components/DashboardCard',
  component: DashboardCard,
  args: {
    variant: 'raised',
  },
  argTypes: {
    variant: { control: 'inline-radio', options: ['raised', 'muted'] },
    children: { control: false },
  },
  parameters: {
    layout: 'padded',
  },
};

export default meta;
type Story = StoryObj<typeof DashboardCard>;

/** The bare container with arbitrary content — a raised surface by default. */
export const Default: Story = {
  render: (args) => (
    <div style={{ maxWidth: 320 }}>
      <DashboardCard {...args}>
        <span>Любой виджет панели</span>
      </DashboardCard>
    </div>
  ),
};

/** Both surfaces side by side. */
export const Variants: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: 16 }}>
      <DashboardCard variant="raised">
        <span>raised</span>
      </DashboardCard>
      <DashboardCard variant="muted">
        <span>muted</span>
      </DashboardCard>
    </div>
  ),
};

const WEEK: StreakDay[] = [
  { label: 'П', state: 'done' },
  { label: 'В', state: 'done' },
  { label: 'С', state: 'done' },
  { label: 'Ч', state: 'done' },
  { label: 'П', state: 'done' },
  { label: 'С', state: 'done' },
  { label: 'В', state: 'today' },
];

const STATS = [
  { value: 2, label: 'К повторению' },
  { value: 2, label: 'Новые' },
  { value: 6, label: 'Изучено' },
];

/** The full "Повторение" dashboard: the container hosting a goal ring, a streak, and stats. */
export const ReviewDashboard: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16, maxWidth: 720 }}>
      <SectionHeading>
        <span style={{ fontFamily: 'var(--do-font-cjk)', color: 'var(--do-color-primary)' }}>
          復習
        </span>{' '}
        Повторение
      </SectionHeading>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
        <DailyGoal value={4} target={10} label="Дневная цель" caption="4 из 10 карточек" />
        <StreakBadge
          count={7}
          label="дней подряд"
          days={WEEK}
          calendarLabel="6 из 7 дней недели выполнено, сегодня ещё нет"
        />
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16 }}>
        {STATS.map((stat) => (
          <StatTile key={stat.label} value={stat.value} label={stat.label} />
        ))}
      </div>
    </div>
  ),
};
