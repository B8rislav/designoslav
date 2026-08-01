import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, fn, userEvent, within } from 'storybook/test';

import { Badge } from '../Badge';
import { Button } from '../Button';

import { VocabRow } from './VocabRow';

const meta: Meta<typeof VocabRow> = {
  title: 'Components/VocabRow',
  component: VocabRow,
  args: {
    headword: '食べる',
    reading: 'たべる',
    gloss: 'есть · to eat',
    tone: 'neutral',
    badges: (
      <>
        <Badge tone="primary">JLPT N5</Badge>
        <Badge tone="neutral">Новое</Badge>
      </>
    ),
  },
  argTypes: {
    tone: { control: 'inline-radio', options: ['neutral', 'primary', 'accent'] },
  },
  parameters: { layout: 'padded' },
};

export default meta;
type Story = StoryObj<typeof VocabRow>;

export const Default: Story = {};

/** The accent bar and status pill track mastery: Новое → Учу → Знаю. */
export const MasteryStates: Story = {
  render: (args) => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      <VocabRow
        {...args}
        tone="neutral"
        badges={
          <>
            <Badge tone="primary">JLPT N5</Badge>
            <Badge tone="neutral">Новое</Badge>
          </>
        }
      />
      <VocabRow
        {...args}
        headword="図書館"
        reading="としょかん"
        gloss="библиотека · library"
        tone="accent"
        badges={
          <>
            <Badge tone="primary">JLPT N4</Badge>
            <Badge tone="accent">Учу</Badge>
          </>
        }
      />
      <VocabRow
        {...args}
        headword="経済"
        reading="けいざい"
        gloss="экономика · economy"
        tone="primary"
        badges={
          <>
            <Badge tone="primary">JLPT N3</Badge>
            <Badge tone="primary">Знаю</Badge>
          </>
        }
      />
    </div>
  ),
};

/**
 * The row is not itself clickable, so its controls are ordinary sibling buttons rather
 * than interactive content nested inside an interactive row.
 */
export const WithActions: Story = {
  args: {
    actions: (
      <>
        <Button size="m" variant="ghost" aria-label="Произнести 食べる">
          ▶
        </Button>
        <Button size="m" variant="ghost" aria-label="Удалить 食べる" onClick={fn()}>
          ✕
        </Button>
      </>
    ),
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    // Both controls are reachable, and the row itself is not a button.
    await expect(canvas.queryByRole('button', { name: 'Произнести 食べる' })).toBeInTheDocument();
    await userEvent.tab();
    await expect(canvas.getByRole('button', { name: 'Произнести 食べる' })).toHaveFocus();
  },
};

/** An interactive status pill advances mastery from within the row. */
export const CyclingStatus: Story = {
  args: {
    tone: 'accent',
    badges: (
      <>
        <Badge tone="primary">JLPT N4</Badge>
        <Badge tone="accent" as="button" onClick={fn()}>
          Учу
        </Badge>
      </>
    ),
  },
};

/** Headwords wrap; the gloss clamps — so a long entry cannot change the row's height. */
export const Overflowing: Story = {
  args: {
    headword: '一生懸命',
    reading: 'いっしょうけんめい',
    gloss:
      'изо всех сил · with all one’s might · for dear life · as hard as one possibly can manage',
  },
};

/** Without a reading — kana-only entries have nothing to put underneath. */
export const NoReading: Story = {
  args: { headword: 'ありがとう', reading: undefined, gloss: 'спасибо · thank you' },
};
