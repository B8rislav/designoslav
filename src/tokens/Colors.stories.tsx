import type { Meta, StoryObj } from '@storybook/react-vite';

/**
 * Living documentation of the color tokens. Every swatch paints itself with the
 * actual CSS custom property (`background: var(--do-*)`), so this gallery can
 * never drift from colors.css — there are no hardcoded hex values here.
 */

const Swatch = ({ token, label }: { token: string; label?: string }) => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
    <div
      style={{
        height: 56,
        borderRadius: 'var(--do-radius-md)',
        background: `var(${token})`,
        border: '1px solid var(--do-color-border)',
      }}
    />
    <code style={{ fontSize: 12, color: 'var(--do-color-text)' }}>{token}</code>
    {label && <span style={{ fontSize: 11, color: 'var(--do-color-text-muted)' }}>{label}</span>}
  </div>
);

const Row = ({ title, children }: { title: string; children: React.ReactNode }) => (
  <section style={{ marginBottom: 32 }}>
    <h3
      style={{
        fontSize: 13,
        letterSpacing: '0.08em',
        textTransform: 'uppercase',
        color: 'var(--do-color-text-muted)',
        margin: '0 0 12px',
      }}
    >
      {title}
    </h3>
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(120px, 1fr))',
        gap: 12,
      }}
    >
      {children}
    </div>
  </section>
);

const scale = (hue: string) =>
  ['50', '100', '200', '300', '400', '500', '600', '700', '800', '900'].map((step) => (
    <Swatch key={step} token={`--do-${hue}-${step}`} />
  ));

const Palette = () => (
  <div style={{ maxWidth: 960 }}>
    <Row title="Neutral · warm grey-green">
      {['0', '50', '100', '200', '300', '400', '500', '600', '700', '800', '900', '950'].map(
        (step) => (
          <Swatch key={step} token={`--do-neutral-${step}`} />
        ),
      )}
    </Row>
    <Row title="Celadon · primary">{scale('celadon')}</Row>
    <Row title="Terracotta · accent">{scale('terracotta')}</Row>

    <Row title="Semantic · surfaces & text">
      <Swatch token="--do-color-bg" label="canvas (Фон)" />
      <Swatch token="--do-color-surface" label="card (Карта)" />
      <Swatch token="--do-color-border" label="border" />
      <Swatch token="--do-color-text" label="ink (Уголь)" />
      <Swatch token="--do-color-text-muted" label="muted" />
    </Row>
    <Row title="Semantic · primary (celadon)">
      <Swatch token="--do-color-primary" label="Селадон" />
      <Swatch token="--do-color-primary-hover" label="hover" />
      <Swatch token="--do-color-primary-active" label="active" />
      <Swatch token="--do-color-primary-subtle" label="subtle" />
    </Row>
    <Row title="Semantic · accent (terracotta)">
      <Swatch token="--do-color-accent" label="Терракота" />
      <Swatch token="--do-color-accent-hover" label="hover" />
      <Swatch token="--do-color-accent-active" label="active" />
      <Swatch token="--do-color-accent-subtle" label="subtle" />
    </Row>
    <Row title="Parts of speech · единый строй">
      <Swatch token="--do-pos-noun" label="Сущ." />
      <Swatch token="--do-pos-verb" label="Глагол" />
      <Swatch token="--do-pos-particle" label="Частица" />
      <Swatch token="--do-pos-pronoun" label="Местоим." />
    </Row>
  </div>
);

const meta: Meta<typeof Palette> = {
  title: 'Tokens/Colors',
  component: Palette,
  parameters: { layout: 'fullscreen' },
};

export default meta;
type Story = StoryObj<typeof Palette>;

export const Celadon_Zen: Story = {};
