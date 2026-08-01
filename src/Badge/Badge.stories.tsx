import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, fn, userEvent, within } from 'storybook/test';

import { Badge } from './Badge';

const meta: Meta<typeof Badge> = {
  title: 'Components/Badge',
  component: Badge,
  args: {
    children: 'JLPT N5',
    tone: 'primary',
    size: 's',
    caps: false,
    as: 'span',
  },
  argTypes: {
    tone: { control: 'inline-radio', options: ['neutral', 'primary', 'accent'] },
    size: { control: 'inline-radio', options: ['s', 'm'] },
    as: { control: 'inline-radio', options: ['span', 'button'] },
    onClick: { action: 'clicked' },
  },
};

export default meta;
type Story = StoryObj<typeof Badge>;

export const Default: Story = {};

/** The three tones. jpdict maps its mastery states onto them: Новое → neutral, Учу → accent, Знаю → primary. */
export const Tones: Story = {
  render: (args) => (
    <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
      <Badge {...args} tone="neutral">
        Новое
      </Badge>
      <Badge {...args} tone="accent">
        Учу
      </Badge>
      <Badge {...args} tone="primary">
        Знаю
      </Badge>
    </div>
  ),
};

export const Sizes: Story = {
  render: (args) => (
    <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
      <Badge {...args} size="s">
        JLPT N5
      </Badge>
      <Badge {...args} size="m">
        JLPT N5
      </Badge>
    </div>
  ),
};

/** `caps` is for standing labels rather than values — the open deck's «ОТКРЫТА». */
export const Caps: Story = {
  args: { children: 'Открыта', caps: true, tone: 'primary' },
};

/** A row's badge cluster: level, stroke count, mastery. */
export const InARow: Story = {
  render: (args) => (
    <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
      <Badge {...args} tone="primary">
        JLPT N3
      </Badge>
      <Badge {...args} tone="neutral">
        11 черт
      </Badge>
      <Badge {...args} tone="accent">
        Учу
      </Badge>
    </div>
  ),
};

/**
 * A badge that does something must be a real button, so it is focusable and
 * announced as one. jpdict's status pill advances Новое → Учу → Знаю on click.
 */
export const Interactive: Story = {
  args: { as: 'button', tone: 'accent', children: 'Учу', onClick: fn() },
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement);
    const pill = canvas.getByRole('button', { name: 'Учу' });

    // Reachable by keyboard, and Enter activates it — the whole point of as="button".
    await userEvent.tab();
    await expect(pill).toHaveFocus();
    await userEvent.keyboard('{Enter}');
    await expect(args.onClick).toHaveBeenCalled();
  },
};

/** A non-interactive badge is a span, so it is not a tab stop and has no button role. */
export const StaticIsNotFocusable: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.queryByRole('button')).toBeNull();
  },
};

/** Long text truncates rather than wrapping — a badge must never be what reflows a row. */
export const Overflowing: Story = {
  render: (args) => (
    <div style={{ maxWidth: 120, border: '1px dashed #ccc', padding: 8 }}>
      <Badge {...args}>Очень длинная подпись уровня</Badge>
    </div>
  ),
};
