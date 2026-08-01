import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, within } from 'storybook/test';

import { Badge } from '../Badge';

import { CardGrid, type CardGridItem } from './CardGrid';

const KANJI = [
  ['私', 'я, частный, личный', 'シ', 'N5', '7 черт', 'Знаю', 'primary'],
  ['毎', 'каждый, всякий', 'マイ', 'N5', '6 черт', 'Учу', 'accent'],
  ['日', 'день; солнце', 'ニチ・ジツ', 'N5', '4 черты', 'Знаю', 'primary'],
  ['本', 'книга, основа, корень', 'ホン', 'N5', '5 черт', 'Учу', 'accent'],
  ['語', 'язык; слово; рассказ', 'ゴ', 'N5', '14 черт', 'Новое', 'neutral'],
  ['勉', 'усердие, старание', 'ベン', 'N3', '10 черт', 'Новое', 'neutral'],
  ['強', 'сильный; крепкий', 'キョウ・ゴウ', 'N3', '11 черт', 'Учу', 'accent'],
] as const;

function makeTiles(count: number): CardGridItem[] {
  return Array.from({ length: count }, (_, index) => {
    const [glyph, meaning, reading, level, strokes, status, tone] = KANJI[index % KANJI.length];
    return {
      id: `kanji-${index}`,
      glyph,
      meaning,
      reading,
      tone,
      badges: (
        <>
          <Badge tone="primary">{level}</Badge>
          <Badge tone="neutral">{strokes}</Badge>
        </>
      ),
      status,
    };
  });
}

/** Bulk fixture without per-tile badges, for the virtualization story. */
function makePlainTiles(count: number): CardGridItem[] {
  return Array.from({ length: count }, (_, index) => {
    const [glyph, meaning, reading] = KANJI[index % KANJI.length];
    return { id: `plain-${index}`, glyph, meaning, reading };
  });
}

const meta: Meta<typeof CardGrid> = {
  title: 'Components/CardGrid',
  component: CardGrid,
  args: {
    'aria-label': 'Сохранённые кандзи',
    items: makeTiles(7),
    columnCount: 5,
    height: 420,
  },
  parameters: { layout: 'padded' },
};

export default meta;
type Story = StoryObj<typeof CardGrid>;

/** The kanji deck at desktop width, as the dictionary page shows it. */
export const Default: Story = {};

/** The caller owns responsiveness: same tiles, one column. */
export const SingleColumn: Story = {
  args: { columnCount: 1, height: 400 },
};

/** Virtualized: 300 tiles, only a viewport's worth in the DOM. */
export const LargeCollection: Story = {
  args: { items: makePlainTiles(300), columnCount: 5, height: 400 },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const grid = canvas.getByLabelText('Сохранённые кандзи');

    await expect(grid).toBeInTheDocument();
    await expect(grid.querySelectorAll('[class*="cell"]').length).toBeLessThan(60);
  },
};

export const Empty: Story = {
  args: { items: [], height: 200 },
};
