import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';

import { EntryList, type EntryListItem } from './EntryList';

const sentence: EntryListItem[] = [
  {
    id: 'watashi',
    headword: '私',
    reading: 'わたし',
    pos: 'pronoun',
    posLabel: 'Местоимение',
    posTag: '代名詞',
    gloss: 'я, 1-е лицо',
  },
  {
    id: 'wa',
    headword: 'は',
    pos: 'particle',
    posLabel: 'Частица',
    posTag: '助詞',
    gloss: 'частица темы',
  },
  {
    id: 'mainichi',
    headword: '毎日',
    reading: 'まいにち',
    pos: 'noun',
    posLabel: 'Существительное',
    posTag: '名詞',
    gloss: 'каждый день',
  },
  {
    id: 'nihongo',
    headword: '日本語',
    reading: 'にほんご',
    pos: 'noun',
    posLabel: 'Существительное',
    posTag: '名詞',
    gloss: 'японский язык',
  },
  {
    id: 'wo',
    headword: 'を',
    pos: 'particle',
    posLabel: 'Частица',
    posTag: '助詞',
    gloss: 'частица объекта',
  },
  {
    id: 'benkyou',
    headword: '勉強',
    reading: 'べんきょう',
    pos: 'noun',
    posLabel: 'Существительное',
    posTag: '名詞',
    gloss: 'учёба, занятие',
  },
  {
    id: 'shimasu',
    headword: 'します',
    pos: 'verb',
    posLabel: 'Глагол',
    posTag: '動詞',
    gloss: 'делать (する)',
  },
];

const meta: Meta<typeof EntryList> = {
  title: 'Components/EntryList',
  component: EntryList,
  args: {
    'aria-label': 'Разбор предложения',
    items: sentence,
    selectedId: 'benkyou',
  },
};

export default meta;
type Story = StoryObj<typeof EntryList>;

/** The sentence 私は毎日日本語を勉強します broken into tokens, with 勉強 selected. */
export const SentenceBreakdown: Story = {
  render: (args) => {
    const [selectedId, setSelectedId] = useState(args.selectedId);
    return (
      <div style={{ maxWidth: 640 }}>
        <EntryList {...args} selectedId={selectedId} onSelect={setSelectedId} />
      </div>
    );
  },
};

/** Nothing selected — every card sits at rest. */
export const NoSelection: Story = {
  args: { selectedId: undefined },
  render: (args) => {
    const [selectedId, setSelectedId] = useState(args.selectedId);
    return (
      <div style={{ maxWidth: 640 }}>
        <EntryList {...args} selectedId={selectedId} onSelect={setSelectedId} />
      </div>
    );
  },
};
