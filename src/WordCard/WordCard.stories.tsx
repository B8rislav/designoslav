import { useState } from 'react';

import type { Meta, StoryObj } from '@storybook/react-vite';

import { Button } from '../Button';
import { WordCard, type KanjiInWord } from './WordCard';

const meta: Meta<typeof WordCard> = {
  title: 'Components/WordCard',
  component: WordCard,
  parameters: { layout: 'centered' },
  decorators: [
    (Story) => (
      <div style={{ width: 420, maxWidth: '100%' }}>
        <Story />
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof WordCard>;

const benkyouKanji: KanjiInWord[] = [
  {
    id: '勉',
    kanji: '勉',
    meaning: 'усердие, старание',
    readings: 'ベン・つと.める',
    jlpt: 'JLPT N3',
    strokeCount: '10 черт',
    onyomi: { label: 'Оньёми', readings: 'ベン' },
    kunyomi: { label: 'Кунъёми', readings: 'つと.める' },
    radical: { char: '力', reading: 'ちから', gloss: 'сила' },
    action: <Button fullWidth>+ Добавить кандзи в словарь</Button>,
  },
  {
    id: '強',
    kanji: '強',
    meaning: 'сильный; крепкий',
    readings: 'キョウ・ゴウ・つよ.い',
    jlpt: 'JLPT N3',
    strokeCount: '11 черт',
    onyomi: { label: 'Оньёми', readings: 'キョウ・ゴウ' },
    kunyomi: { label: 'Кунъёми', readings: 'つよ.い' },
    radical: { char: '弓', reading: 'ゆみ', gloss: 'лук' },
    parts: [
      { char: '弓', gloss: 'лук' },
      { char: 'ム', gloss: 'частный' },
      { char: '虫', gloss: 'насекомое' },
    ],
    action: <Button fullWidth>+ Добавить кандзи в словарь</Button>,
  },
];

/**
 * The 勉強 word column, matching jpdict's side panel: collapsible sections plus the
 * word's two kanji. WordCard is controlled — this story owns the open-section set and
 * the single expanded-kanji id with `useState`. Clicking a kanji opens it (closing any
 * other) and scrolls it into view.
 */
export const Default: Story = {
  render: () => {
    const [open, setOpen] = useState<Record<string, boolean>>({ translation: true });
    const [expandedKanjiId, setExpandedKanjiId] = useState<string>();

    return (
      <WordCard
        word="勉強"
        pos="Существительное"
        reading="Хирагана: べんきょう"
        onPlay={() => {}}
        onToggleSection={(id) => setOpen((s) => ({ ...s, [id]: !s[id] }))}
        sections={[
          {
            id: 'translation',
            title: 'Перевод',
            open: open.translation,
            content: (
              <ol>
                <li>учёба; занятия</li>
                <li>{'{〜する}'} учиться, заниматься</li>
              </ol>
            ),
          },
          { id: 'grammar', title: 'Грамматика', open: open.grammar, content: <p>—</p> },
          { id: 'examples', title: 'Примеры', open: open.examples, content: <p>—</p> },
        ]}
        kanji={benkyouKanji}
        expandedKanjiId={expandedKanjiId}
        onExpandKanji={(id) => setExpandedKanjiId((cur) => (cur === id ? undefined : id))}
        action={<Button fullWidth>+ Добавить в словарь</Button>}
      />
    );
  },
};

const mainichiKanji: KanjiInWord[] = [
  {
    id: '毎',
    kanji: '毎',
    meaning: 'каждый, всякий',
    readings: 'マイ・－',
    jlpt: 'JLPT N5',
    strokeCount: '6 черт',
    onyomi: { label: 'Оньёми', readings: 'マイ' },
    radical: { char: '毋', gloss: 'мать' },
    action: <Button fullWidth>+ Добавить кандзи в словарь</Button>,
  },
  {
    id: '日',
    kanji: '日',
    meaning: 'день; солнце',
    readings: 'ニチ・ジツ・ひ・か',
    jlpt: 'JLPT N5',
    strokeCount: '4 черты',
    onyomi: { label: 'Оньёми', readings: 'ニチ・ジツ' },
    kunyomi: { label: 'Кунъёми', readings: 'ひ・か' },
    radical: { char: '日', reading: 'ひ', gloss: 'солнце' },
    parts: [{ char: '日', gloss: 'солнце (пиктограмма)' }],
    action: <Button fullWidth>+ Добавить кандзи в словарь</Button>,
  },
];

/** A single-kanji word (毎日 → 毎 · 日) with the second kanji expanded by default. */
export const WithExpandedKanji: Story = {
  render: () => {
    const [open, setOpen] = useState<Record<string, boolean>>({ translation: true });
    const [expandedKanjiId, setExpandedKanjiId] = useState<string | undefined>('日');

    return (
      <WordCard
        word="毎日"
        pos="Существительное"
        reading="Хирагана: まいにち"
        onPlay={() => {}}
        onToggleSection={(id) => setOpen((s) => ({ ...s, [id]: !s[id] }))}
        sections={[
          {
            id: 'translation',
            title: 'Перевод',
            open: open.translation,
            content: (
              <ol>
                <li>каждый день; ежедневно</li>
              </ol>
            ),
          },
          { id: 'grammar', title: 'Грамматика', open: open.grammar, content: <p>—</p> },
          { id: 'examples', title: 'Примеры', open: open.examples, content: <p>—</p> },
        ]}
        kanji={mainichiKanji}
        expandedKanjiId={expandedKanjiId}
        onExpandKanji={(id) => setExpandedKanjiId((cur) => (cur === id ? undefined : id))}
        action={<Button fullWidth>+ Добавить в словарь</Button>}
      />
    );
  },
};
