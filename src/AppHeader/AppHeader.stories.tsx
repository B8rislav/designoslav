import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';

import { Brand } from '../Brand';
import { Button } from '../Button';
import { NavLink } from '../NavLink';
import { SegmentedControl } from '../SegmentedControl';
import { AppHeader } from './AppHeader';

const meta: Meta<typeof AppHeader> = {
  title: 'Components/AppHeader',
  component: AppHeader,
  parameters: { layout: 'fullscreen' },
  args: {
    sticky: false,
    navLabel: 'Основная навигация',
  },
};

export default meta;
type Story = StoryObj<typeof AppHeader>;

const GearIcon = () => (
  <svg width="18" height="18" viewBox="0 0 20 20" fill="none" aria-hidden="true">
    <circle cx="10" cy="10" r="2.6" stroke="currentColor" strokeWidth="1.5" />
    <path
      d="M10 2.5v2M10 15.5v2M17.5 10h-2M4.5 10h-2M15.3 4.7l-1.4 1.4M6.1 13.9l-1.4 1.4M15.3 15.3l-1.4-1.4M6.1 6.1L4.7 4.7"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
    />
  </svg>
);

/** The signed-in header, as drawn in the Kotoba Lab mock. */
export const SignedIn: Story = {
  render: (args) => {
    const [language, setLanguage] = useState('ja');
    return (
      <AppHeader
        {...args}
        brand={<Brand mark="語" wordmark="言葉ラボ" subtitle="KOTOBA LAB" as="a" href="#" />}
        center={
          <SegmentedControl
            aria-label="Язык изучения"
            options={[
              { value: 'ja', label: '日本語' },
              { value: 'zh', label: '中文' },
            ]}
            value={language}
            onChange={setLanguage}
          />
        }
        nav={
          <>
            <NavLink href="#" active>
              Разбор
            </NavLink>
            <NavLink href="#">Словарь</NavLink>
            <NavLink href="#">Учить</NavLink>
          </>
        }
        actions={
          <>
            <Button variant="ghost" size="m" aria-label="Настройки">
              <GearIcon />
            </Button>
            <Button variant="secondary" size="m">
              Выйти
            </Button>
          </>
        }
      />
    );
  },
};

/** Signed out: the auth-gated destinations are absent, not disabled. */
export const SignedOut: Story = {
  render: (args) => {
    const [language, setLanguage] = useState('ja');
    return (
      <AppHeader
        {...args}
        brand={<Brand mark="語" wordmark="言葉ラボ" subtitle="KOTOBA LAB" as="a" href="#" />}
        center={
          <SegmentedControl
            aria-label="Язык изучения"
            options={[
              { value: 'ja', label: '日本語' },
              { value: 'zh', label: '中文' },
            ]}
            value={language}
            onChange={setLanguage}
          />
        }
        nav={
          <NavLink href="#" active>
            Разбор
          </NavLink>
        }
        actions={
          <Button variant="primary" size="m">
            Войти
          </Button>
        }
      />
    );
  },
};

/** Pinned, with content scrolling beneath it. */
export const Sticky: Story = {
  render: (args) => (
    <div style={{ height: 400, overflow: 'auto' }}>
      <AppHeader
        {...args}
        sticky
        brand={<Brand mark="語" wordmark="言葉ラボ" subtitle="KOTOBA LAB" />}
        nav={
          <NavLink href="#" active>
            Разбор
          </NavLink>
        }
      />
      <div style={{ padding: 32, display: 'flex', flexDirection: 'column', gap: 16 }}>
        {Array.from({ length: 14 }, (_, index) => (
          <p key={index} style={{ margin: 0, fontFamily: 'var(--do-font-sans)' }}>
            Строка {index + 1} — прокрутите, чтобы увидеть закреплённую шапку.
          </p>
        ))}
      </div>
    </div>
  ),
};

/** Brand only — the minimum the shell needs to look intentional. */
export const BrandOnly: Story = {
  render: (args) => <AppHeader {...args} brand={<Brand mark="語" wordmark="言葉ラボ" />} />,
};
