import type { Meta, StoryObj } from '@storybook/react-vite';

import { SectionHeading } from './SectionHeading';

const meta: Meta<typeof SectionHeading> = {
  title: 'Components/SectionHeading',
  component: SectionHeading,
  args: {
    children: 'Предложение',
    as: 'h2',
  },
  argTypes: {
    as: { control: 'inline-radio', options: ['h1', 'h2', 'h3', 'h4'] },
  },
};

export default meta;
type Story = StoryObj<typeof SectionHeading>;

export const Default: Story = {};

export const Levels: Story = {
  render: (args) => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <SectionHeading {...args} as="h1">
        Заголовок
      </SectionHeading>
      <SectionHeading {...args} as="h2">
        Предложение
      </SectionHeading>
      <SectionHeading {...args} as="h3">
        Похожие слова
      </SectionHeading>
    </div>
  ),
};
