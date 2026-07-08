import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';

import { EntryList, type EntryListItem } from '../EntryList';
import { SectionHeading } from '../SectionHeading';
import { SentenceView, type SentenceToken } from './SentenceView';

const tokens: SentenceToken[] = [
  { id: 'watashi', text: '私', pos: 'pronoun' },
  { id: 'wa', text: 'は', pos: 'particle' },
  { id: 'mainichi', text: '毎日', pos: 'noun' },
  { id: 'nihongo', text: '日本語', pos: 'noun' },
  { id: 'wo', text: 'を', pos: 'particle' },
  { id: 'benkyou', text: '勉強', pos: 'noun' },
  { id: 'shimasu', text: 'します', pos: 'verb' },
];

const entries: EntryListItem[] = [
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

const meta: Meta<typeof SentenceView> = {
  title: 'Components/SentenceView',
  component: SentenceView,
  args: {
    'aria-label': 'Разбор предложения',
    tokens,
    selectedId: 'benkyou',
  },
};

export default meta;
type Story = StoryObj<typeof SentenceView>;

/** Just the strip: click a token or arrow between them to change the selection. */
export const Default: Story = {
  render: (args) => {
    const [selectedId, setSelectedId] = useState(args.selectedId);
    return (
      <div style={{ maxWidth: 640 }}>
        <SentenceView {...args} selectedId={selectedId} onSelect={setSelectedId} />
      </div>
    );
  },
};

/**
 * The full upper section: SectionHeading + SentenceView + EntryList sharing one
 * `selectedId`, so selecting a token highlights its entry (and vice versa).
 */
export const WithBreakdown: Story = {
  render: (args) => {
    const [selectedId, setSelectedId] = useState<string | undefined>('benkyou');
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 16, maxWidth: 640 }}>
        <SectionHeading>Предложение</SectionHeading>
        <SentenceView {...args} selectedId={selectedId} onSelect={setSelectedId} />
        <EntryList
          aria-label="Разбор предложения"
          items={entries}
          selectedId={selectedId}
          onSelect={setSelectedId}
        />
      </div>
    );
  },
};
