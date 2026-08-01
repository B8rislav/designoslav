import { useState } from 'react';

import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, fn, userEvent, within } from 'storybook/test';

import { Button } from '../Button';

import { DeckCard } from './DeckCard';

const meta: Meta<typeof DeckCard> = {
  title: 'Components/DeckCard',
  component: DeckCard,
  args: {
    glyph: '漢',
    glyphTone: 'accent',
    title: 'Кандзи',
    nativeTitle: '漢字',
    caption: '7 карточек в колоде',
    open: true,
    openLabel: 'Открыта',
    todayLabel: 'На сегодня',
    todayValue: '5 карточек',
    progressLabel: '2 из 5 сделано',
    value: 2,
    target: 5,
    legend: [
      { tone: 'accent', label: 'Повторить · 3' },
      { tone: 'primary', label: 'Новых · 2' },
    ],
  },
  argTypes: {
    glyphTone: { control: 'inline-radio', options: ['neutral', 'primary', 'accent'] },
  },
  parameters: { layout: 'padded' },
};

export default meta;
type Story = StoryObj<typeof DeckCard>;

/** The open kanji deck, part-way through today's session. */
export const Open: Story = {
  args: { action: <Button size="m">Продолжить →</Button> },
};

/** A closed deck with nothing done yet — outlined CTA, no «Открыта» badge. */
export const Closed: Story = {
  args: {
    glyph: '語',
    glyphTone: 'primary',
    title: 'Слова',
    nativeTitle: '単語',
    caption: '8 карточек в колоде',
    open: false,
    todayValue: '6 карточек',
    progressLabel: '0 из 6 сделано',
    value: 0,
    target: 6,
    legend: [
      { tone: 'accent', label: 'Повторить · 3' },
      { tone: 'primary', label: 'Новых · 3' },
    ],
    action: (
      <Button size="m" variant="secondary">
        Учить →
      </Button>
    ),
  },
};

/** Both decks as the dictionary page shows them. */
export const DeckPair: Story = {
  render: (args) => {
    const [openDeck, setOpenDeck] = useState('kanji');
    return (
      <div style={{ display: 'grid', gap: 16, gridTemplateColumns: '1fr 1fr' }}>
        <DeckCard
          {...args}
          open={openDeck === 'kanji'}
          onOpen={() => setOpenDeck('kanji')}
          selectLabel="Открыть колоду Кандзи"
          action={<Button size="m">Продолжить →</Button>}
        />
        <DeckCard
          {...args}
          glyph="語"
          glyphTone="primary"
          title="Слова"
          nativeTitle="単語"
          caption="8 карточек в колоде"
          open={openDeck === 'word'}
          onOpen={() => setOpenDeck('word')}
          selectLabel="Открыть колоду Слова"
          todayValue="6 карточек"
          progressLabel="0 из 6 сделано"
          value={0}
          target={6}
          action={
            <Button size="m" variant="secondary">
              Учить →
            </Button>
          }
        />
      </div>
    );
  },
};

/** An empty deck: no workload section at all, rather than a 0% bar. */
export const EmptyDeck: Story = {
  args: {
    caption: 'Пока пусто',
    todayValue: undefined,
    progressLabel: undefined,
    value: 0,
    target: 0,
    legend: undefined,
    open: false,
    action: (
      <Button size="m" variant="secondary">
        Учить →
      </Button>
    ),
  },
};

/**
 * The card is selectable *and* holds a CTA. They must be two sibling controls, not a
 * button nested inside a clickable card — this asserts both are reachable and that
 * pressing the CTA does not also select the deck.
 */
export const SelectionAndActionAreSeparate: Story = {
  args: {
    open: false,
    onOpen: fn(),
    selectLabel: 'Открыть колоду Кандзи',
    action: <Button size="m">Продолжить →</Button>,
  },
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement);

    const select = canvas.getByRole('button', { name: 'Открыть колоду Кандзи' });
    const cta = canvas.getByRole('button', { name: 'Продолжить →' });

    // Two distinct controls, each with its own accessible name.
    await expect(select).not.toBe(cta);
    await expect(select).toHaveAttribute('aria-pressed', 'false');

    // Activating the CTA must not select the deck.
    await userEvent.click(cta);
    await expect(args.onOpen).not.toHaveBeenCalled();

    await userEvent.click(select);
    await expect(args.onOpen).toHaveBeenCalledTimes(1);
  },
};

/** The progress bar reports itself to assistive tech, named by the deck title. */
export const ProgressIsExposed: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const bar = canvas.getByRole('progressbar');

    await expect(bar).toHaveAttribute('aria-valuenow', '2');
    await expect(bar).toHaveAttribute('aria-valuemax', '5');
    await expect(bar).toHaveAccessibleName('Кандзи');
  },
};

/** Long names wrap; the size caption clamps, so the card keeps its height. */
export const Overflowing: Story = {
  args: {
    title: 'Кандзи повышенного уровня сложности',
    caption: 'Очень длинная подпись о количестве карточек в этой колоде',
    action: <Button size="m">Продолжить →</Button>,
  },
  parameters: { layout: 'centered' },
  render: (args) => (
    <div style={{ width: 320 }}>
      <DeckCard {...args} />
    </div>
  ),
};
