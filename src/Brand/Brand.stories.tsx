import type { Meta, StoryObj } from '@storybook/react-vite';

import { Brand } from './Brand';

const meta: Meta<typeof Brand> = {
  title: 'Components/Brand',
  component: Brand,
  args: {
    mark: '語',
    wordmark: '言葉ラボ',
    subtitle: 'KOTOBA LAB',
    size: 'm',
  },
  argTypes: {
    size: { control: 'inline-radio', options: ['m', 'l'] },
  },
};

export default meta;
type Story = StoryObj<typeof Brand>;

export const Default: Story = {};

export const Sizes: Story = {
  render: (args) => (
    <div style={{ display: 'flex', gap: 32, alignItems: 'center' }}>
      <Brand {...args} size="m" />
      <Brand {...args} size="l" />
    </div>
  ),
};

/** Tile only — for a collapsed header or a narrow viewport. */
export const MarkOnly: Story = {
  args: { wordmark: undefined, subtitle: undefined },
};

export const WithoutSubtitle: Story = {
  args: { subtitle: undefined },
};

/** As a link home: hover and focus styles apply only in this form. */
export const AsLink: Story = {
  args: { as: 'a', href: '#' },
};

/** Every string is a prop, so a rename never touches the design system. */
export const Renamed: Story = {
  args: { mark: '辞', wordmark: 'JapChin Dict', subtitle: 'JP · CN' },
};
