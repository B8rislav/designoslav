import { useMemo, useState } from 'react';

import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, fn, userEvent, within } from 'storybook/test';

import { Badge } from '../Badge';
import { Button } from '../Button';

import { VocabList, type VocabListItem } from './VocabList';

const WORDS = [
  ['食べる', 'たべる', 'есть · to eat', 'N5', 'Новое', 'neutral'],
  ['図書館', 'としょかん', 'библиотека · library', 'N4', 'Учу', 'accent'],
  ['経済', 'けいざい', 'экономика · economy', 'N3', 'Знаю', 'primary'],
  ['難しい', 'むずかしい', 'трудный · difficult', 'N4', 'Новое', 'neutral'],
  ['約束', 'やくそく', 'обещание · promise', 'N3', 'Учу', 'accent'],
  ['環境', 'かんきょう', 'окружающая среда · environment', 'N2', 'Знаю', 'primary'],
  ['影響', 'えいきょう', 'влияние · influence', 'N2', 'Новое', 'neutral'],
  ['経験', 'けいけん', 'опыт · experience', 'N3', 'Учу', 'accent'],
] as const;

function makeItems(count: number, onDelete?: (word: string) => void): VocabListItem[] {
  return Array.from({ length: count }, (_, index) => {
    const [headword, reading, gloss, level, status, tone] = WORDS[index % WORDS.length];
    return {
      id: `word-${index}`,
      headword,
      reading,
      gloss,
      tone,
      badges: (
        <>
          <Badge tone="primary">JLPT {level}</Badge>
          <Badge tone={tone} as="button">
            {status}
          </Badge>
        </>
      ),
      actions: (
        <>
          <Button size="m" variant="ghost" aria-label={`Произнести ${headword}`}>
            ▶
          </Button>
          <Button
            size="m"
            variant="ghost"
            aria-label={`Удалить ${headword}`}
            onClick={() => onDelete?.(headword)}
          >
            ✕
          </Button>
        </>
      ),
    };
  });
}

/**
 * Bulk fixture without the per-row badges and buttons. The big stories are about
 * virtualization, not about row furniture, and building thousands of retained React
 * elements for them is what makes the story file heavy.
 */
function makePlainItems(count: number): VocabListItem[] {
  return Array.from({ length: count }, (_, index) => {
    const [headword, reading, gloss] = WORDS[index % WORDS.length];
    return { id: `plain-${index}`, headword, reading, gloss };
  });
}

const meta: Meta<typeof VocabList> = {
  title: 'Components/VocabList',
  component: VocabList,
  args: {
    'aria-label': 'Сохранённые слова',
    items: makeItems(8),
    height: 620,
  },
  parameters: { layout: 'padded' },
};

export default meta;
type Story = StoryObj<typeof VocabList>;

/** The dictionary's word deck, exactly as the page shows it. */
export const Default: Story = {};

/** The reason this component is virtualized: 500 rows, a constant number of DOM nodes. */
export const LargeCollection: Story = {
  args: { items: makePlainItems(500), height: 500 },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const list = canvas.getByRole('list', { name: 'Сохранённые слова' });

    // The whole collection is addressable...
    await expect(list).toBeInTheDocument();
    // ...but only a viewport's worth is actually rendered.
    const rendered = within(list).getAllByRole('listitem');
    await expect(rendered.length).toBeLessThan(40);
  },
};

/** A trailing row stands in for the page being fetched. */
export const LoadingMore: Story = {
  args: { items: makeItems(8), loadingMore: true, loadingLabel: 'Загружаем ещё…' },
};

/** Nothing to show — the caller renders its own empty state, so the list is simply empty. */
export const Empty: Story = {
  args: { items: [], height: 200 },
};

/**
 * With the end already in view, the next page is requested immediately — and only
 * once, however many times the list re-renders. The latch is the point: react-window
 * reports its rendered rows after every render, so an unlatched callback that appends
 * rows would feed itself.
 */
export const EndReachedFiresOnce: Story = {
  args: { items: makeItems(4), height: 500, onEndReached: fn() },
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement);
    // Query by role, not by text: the fixture cycles a handful of words, so any
    // given headword appears in several rendered rows.
    const list = await canvas.findByRole('list', { name: 'Сохранённые слова' });
    await expect(within(list).getAllByRole('listitem').length).toBeGreaterThan(0);

    await expect(args.onEndReached).toHaveBeenCalledTimes(1);
  },
};

/** Row controls stay reachable and independent inside a virtualized row. */
export const RowActionsWork: Story = {
  render: (args) => {
    const [deleted, setDeleted] = useState<string[]>([]);
    // Built once: rebuilding the array on every render would feed the list a new
    // identity each time it reports rendered rows, and spin.
    const items = useMemo(() => makeItems(8, (word) => setDeleted((prev) => [...prev, word])), []);
    return (
      <div>
        <VocabList {...args} items={items} />
        <p data-testid="deleted">{deleted.join(', ')}</p>
      </div>
    );
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    await userEvent.click(canvas.getByRole('button', { name: 'Удалить 食べる' }));
    await expect(canvas.getByTestId('deleted')).toHaveTextContent('食べる');
  },
};

/** Long glosses clamp to one line so every row keeps the same height. */
export const Overflowing: Story = {
  args: {
    height: 200,
    items: [
      {
        id: 'long',
        headword: '環境',
        reading: 'かんきょう',
        gloss:
          'окружающая среда · environment · surroundings · circumstances · the conditions in which one lives',
        tone: 'primary',
        badges: <Badge tone="primary">JLPT N2</Badge>,
      },
    ],
  },
};
