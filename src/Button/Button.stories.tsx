import type { Meta, StoryObj } from '@storybook/react-vite';

import { Button } from './Button';

const meta: Meta<typeof Button> = {
  title: 'Components/Button',
  component: Button,
  args: {
    children: 'Найти',
    variant: 'primary',
    size: 'm',
    fullWidth: false,
    disabled: false,
  },
  argTypes: {
    variant: { control: 'inline-radio', options: ['primary', 'secondary', 'accent', 'ghost'] },
    size: { control: 'inline-radio', options: ['m', 'l', 'xl'] },
  },
};

export default meta;
type Story = StoryObj<typeof Button>;

export const Primary: Story = {};

export const Secondary: Story = {
  args: { variant: 'secondary', children: 'В словарь' },
};

export const Accent: Story = {
  args: { variant: 'accent', children: 'Терракота' },
};

export const Ghost: Story = {
  args: { variant: 'ghost', children: 'Ghost' },
};

/** All variants side by side, matching the two buttons on the Celadon Zen board. */
export const Variants: Story = {
  render: (args) => (
    <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
      <Button {...args} variant="primary">
        Найти
      </Button>
      <Button {...args} variant="secondary">
        В словарь
      </Button>
      <Button {...args} variant="accent">
        Accent
      </Button>
      <Button {...args} variant="ghost">
        Ghost
      </Button>
    </div>
  ),
};

export const Sizes: Story = {
  render: (args) => (
    <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
      <Button {...args} size="m">
        Medium
      </Button>
      <Button {...args} size="l">
        Large
      </Button>
      <Button {...args} size="xl">
        Extra large
      </Button>
    </div>
  ),
};

/** The full-width primary CTA, like "Начать повторение · 4 карточки". */
export const FullWidth: Story = {
  args: { size: 'xl', fullWidth: true, children: 'Начать повторение · 4 карточки' },
  decorators: [
    (Story) => (
      <div style={{ width: 420 }}>
        <Story />
      </div>
    ),
  ],
};
