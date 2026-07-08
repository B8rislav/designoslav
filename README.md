# Designoslav

The Kotoba Lab design system. Theme: **Celadon Zen** — soft warm neutrals, one deep
green accent (celadon), one warm accent (terracotta). Built to replace Gravity UI in
the jpdict frontend.

Standalone React 19 + TypeScript component library, documented in Storybook.
Styling is CSS Modules + `--do-*` design tokens; components are presentational only.

Consumed by the **jpdict frontend** — https://github.com/B8rislav/jpdict — which it
exists to move off Gravity UI. It ships **as source** (no build step): consumers import
straight from `src` via the `exports` map in `package.json`.

## Docs

- [CONTRIBUTING.md](CONTRIBUTING.md) — setup and conventions for contributors.
- [CLAUDE.md](CLAUDE.md) — condensed guidance for AI agents working in this repo.

## Commands

| Command | What it does |
|---------|--------------|
| `npm run storybook` | Storybook dev server — http://localhost:6006 |
| `npm run build:storybook` | Static Storybook build to `storybook-static/` |
| `npm run typecheck` | `tsc --noEmit` |
| `npm run format` | Prettier write over `src/**` |

Node version is pinned in `.nvmrc` — run `nvm use` first, then `npm install`.

## Structure

```
src/
  tokens/
    colors.css          raw palette + semantic color tokens (the source of truth)
    tokens.css          type / spacing / radius / shadow / motion — @imports colors.css
    Colors.stories.tsx  living swatch gallery (renders straight from the CSS vars)
  Button/
    Button.tsx
    Button.module.css
    Button.stories.tsx
  index.ts              public entry
```

## Tokens

Import the stylesheet once, then reference variables in CSS:

```ts
import 'designoslav/tokens.css';
```

```css
.myThing {
  color: var(--do-color-text);
  background: var(--do-color-surface);
  border-radius: var(--do-radius-md);
}
```

Two layers: a fixed **palette** (`--do-celadon-500`, `--do-neutral-100`, …) and
role-based **semantic** tokens (`--do-color-primary`, `--do-color-surface`, …).
Components read only the semantic tokens.

The five anchors: Фон `#EFF1EC` · Карта `#FAFBF8` · Уголь `#23282A` ·
Селадон `#2F6E63` · Терракота `#B06E3D`.

## Using a component

```tsx
import { Button } from 'designoslav';
import 'designoslav/tokens.css';

<Button variant="primary" size="xl" fullWidth>
  Начать повторение
</Button>;
```
