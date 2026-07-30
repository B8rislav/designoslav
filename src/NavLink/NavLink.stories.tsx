import type { Meta, StoryObj } from '@storybook/react-vite';

import { NavLink } from './NavLink';

const meta: Meta<typeof NavLink> = {
  title: 'Components/NavLink',
  component: NavLink,
  args: {
    children: 'Разбор',
    href: '#',
    active: false,
  },
};

export default meta;
type Story = StoryObj<typeof NavLink>;

export const Default: Story = {};

export const Active: Story = {
  args: { active: true },
};

/** The header's set, as it reads in the app bar. */
export const NavRow: Story = {
  render: (args) => (
    <nav style={{ display: 'flex', gap: 28, alignItems: 'center' }}>
      <NavLink {...args} active>
        Разбор
      </NavLink>
      <NavLink {...args}>Словарь</NavLink>
      <NavLink {...args}>Учить</NavLink>
    </nav>
  ),
};

/**
 * Rendered as something other than an anchor — jpdict passes its router's link so
 * navigation stays client-side.
 */
export const AsCustomElement: Story = {
  args: { as: 'button', href: undefined, children: 'Словарь' },
};
