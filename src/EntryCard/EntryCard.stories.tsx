import type { Meta, StoryObj } from '@storybook/react-vite';

import { EntryCard } from './EntryCard';

const meta: Meta<typeof EntryCard> = {
  title: 'Components/EntryCard',
  component: EntryCard,
  args: {
    headword: '私',
    reading: 'わたし',
    pos: 'pronoun',
    posLabel: 'Местоимение',
    posTag: '代名詞',
    gloss: 'я, 1-е лицо',
    onClick: () => alert('открыть запись 私'),
  },
  argTypes: {
    pos: { control: 'inline-radio', options: ['noun', 'verb', 'particle', 'pronoun'] },
    onClick: { action: 'clicked' },
  },
};

export default meta;
type Story = StoryObj<typeof EntryCard>;

/** A single pronoun entry, matching jpdict's results-list row. */
export const Pronoun: Story = {};

export const Noun: Story = {
  args: {
    headword: '猫',
    reading: 'ねこ',
    pos: 'noun',
    posLabel: 'Существительное',
    posTag: '名詞',
    gloss: 'кошка, кот',
  },
};

export const Verb: Story = {
  args: {
    headword: '食べる',
    reading: 'たべる',
    pos: 'verb',
    posLabel: 'Глагол',
    posTag: '動詞',
    gloss: 'есть, кушать',
  },
};

export const Particle: Story = {
  args: {
    headword: 'は',
    reading: undefined,
    pos: 'particle',
    posLabel: 'Частица',
    posTag: '助詞',
    gloss: 'тематическая частица',
  },
};

/** A results list — the entry cards stacked as jpdict would render a search result. */
export const ResultsList: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8, maxWidth: 640 }}>
      <EntryCard
        headword="私"
        reading="わたし"
        pos="pronoun"
        posLabel="Местоимение"
        posTag="代名詞"
        gloss="я, 1-е лицо"
      />
      <EntryCard
        headword="猫"
        reading="ねこ"
        pos="noun"
        posLabel="Существительное"
        posTag="名詞"
        gloss="кошка, кот"
      />
      <EntryCard
        headword="食べる"
        reading="たべる"
        pos="verb"
        posLabel="Глагол"
        posTag="動詞"
        gloss="есть, кушать"
      />
      <EntryCard
        headword="は"
        pos="particle"
        posLabel="Частица"
        posTag="助詞"
        gloss="тематическая частица"
      />
    </div>
  ),
};
