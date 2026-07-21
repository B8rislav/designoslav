import { useState } from 'react';

import type { Meta, StoryObj } from '@storybook/react-vite';

import { Button } from '../Button';
import { KanjiCard } from './KanjiCard';

const meta: Meta<typeof KanjiCard> = {
  title: 'Components/KanjiCard',
  component: KanjiCard,
  args: {
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
type Story = StoryObj<typeof KanjiCard>;

/** The full kanji detail card, matching jpdict's side panel for 強. */
export const Default: Story = {};

/** A denser kanji with no separate parts breakdown. */
export const Minimal: Story = {
  args: {
    kanji: '水',
    meaning: 'вода',
    readings: 'スイ・みず',
    jlpt: 'JLPT N5',
    strokeCount: '4 черты',
    onyomi: { label: 'Оньёми', readings: 'スイ' },
    kunyomi: { label: 'Кунъёми', readings: 'みず' },
    radical: { char: '水', reading: 'みず', gloss: 'вода' },
    parts: undefined,
    action: <Button fullWidth>+ Добавить кандзи в словарь</Button>,
  },
};

/**
 * Collapsible card — pass `expanded` + `onToggleExpanded` to reveal the chevron. The
 * card is controlled: it owns no state, so the story wires it to `useState`.
 */
export const Collapsible: Story = {
  render: (args) => {
    const [expanded, setExpanded] = useState(true);
    return (
      <KanjiCard {...args} expanded={expanded} onToggleExpanded={() => setExpanded((e) => !e)} />
    );
  },
};
