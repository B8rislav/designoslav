import type { Meta, StoryObj } from '@storybook/react-vite';

import { Badge } from '../Badge';

import { CardTile } from './CardTile';

const meta: Meta<typeof CardTile> = {
  title: 'Components/CardTile',
  component: CardTile,
  args: {
    glyph: '私',
    meaning: 'я, частный, личный',
    reading: 'シ',
    tone: 'primary',
    badges: (
      <>
        <Badge tone="primary">N5</Badge>
        <Badge tone="neutral">7 черт</Badge>
      </>
    ),
    status: 'Знаю',
  },
  argTypes: {
    tone: { control: 'inline-radio', options: ['neutral', 'primary', 'accent'] },
  },
  decorators: [
    (Story) => (
      <div style={{ width: 190, height: 190 }}>
        <Story />
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof CardTile>;

export const Known: Story = {};

export const Learning: Story = {
  args: {
    glyph: '本',
    meaning: 'книга, основа, корень',
    reading: 'ホン',
    tone: 'accent',
    status: 'Учу',
  },
};

export const New: Story = {
  args: {
    glyph: '語',
    meaning: 'язык; слово; рассказ',
    reading: 'ゴ',
    tone: 'neutral',
    status: 'Новое',
  },
};

/** Long meanings clamp to one line, so every tile in a grid keeps the same height. */
export const Overflowing: Story = {
  args: { meaning: 'я, частный, личный, персональный, собственный, приватный' },
};

/** Just the character — no footer at all rather than an empty one. */
export const GlyphOnly: Story = {
  args: { meaning: undefined, reading: undefined, badges: undefined, status: undefined },
};
