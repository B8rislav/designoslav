# Contributing to Designoslav

Thanks for working on the Kotoba Lab design system. This guide covers local setup and
the conventions every component follows. For a condensed, agent-oriented version see
[CLAUDE.md](CLAUDE.md); for the project overview see the [README](README.md).

## The one-line context

Designoslav is a standalone React 19 + TypeScript component library on the **Celadon
Zen** theme, documented in Storybook and consumed by the **jpdict frontend**
(https://github.com/B8rislav/jpdict), which it exists to move off Gravity UI. It ships
**as source** — no build step, no `dist/`. Consumers import directly from `src` through
the `exports` map in `package.json`, so the public surface is whatever `src/index.ts`
and `src/tokens/tokens.css` expose.

Because jpdict is a live consumer, treat any change to an exported component's props,
exported names, or a token name as a **breaking change** and flag it in your PR.

## Setup

Node is pinned in [.nvmrc](.nvmrc):

```bash
nvm use          # switches to the pinned Node version
npm install
npm run storybook # http://localhost:6006
```

## Everyday commands

| Command | What it does |
|---------|--------------|
| `npm run storybook` | Storybook dev server |
| `npm run build:storybook` | Static build to `storybook-static/` |
| `npm run typecheck` | `tsc --noEmit` |
| `npm run lint` / `lint:fix` | ESLint (with optional autofix) |
| `npm run format` / `format:check` | Prettier write / check |

There are no unit tests — **Storybook is the verification surface**. Before opening a PR,
make sure `typecheck`, `lint`, and `format:check` all pass and the affected stories
render correctly (including the Storybook a11y panel).

## Project layout

```
src/
  tokens/       colors.css (palette + semantic colors, source of truth),
                tokens.css (type/spacing/radius/shadow/motion), Colors.stories.tsx
  Button/       Button.tsx · Button.module.css · Button.stories.tsx · index.ts
  SegmentedControl/   same four-file shape
  index.ts      public entry — re-exports each component barrel
.storybook/     config; preview.tsx loads tokens.css for every story
.github/workflows/deploy-storybook.yml   builds + deploys Storybook to GitHub Pages
```

## Design tokens

Everything visual comes from `--do-*` CSS custom properties. There are two layers:

- **Palette** — fixed scales like `--do-celadon-500`, `--do-neutral-100`,
  `--do-terracotta-400`.
- **Semantic** — role-based tokens like `--do-color-primary`, `--do-color-surface`,
  `--do-color-text`, `--do-radius-md`, `--do-space-4`, `--do-shadow-sm`,
  `--do-duration-fast`.

**Components read the semantic layer only.** Never hardcode a hex/px value and never
reference a palette token inside a component's CSS — if you need something new, add a
semantic token in `colors.css` / `tokens.css` first.

The five anchors: Фон `#EFF1EC` · Карта `#FAFBF8` · Уголь `#23282A` · Селадон `#2F6E63` ·
Терракота `#B06E3D`.

Consume the tokens in an app with a single import:

```ts
import 'designoslav/tokens.css';
```

## Component conventions

Every component follows the same shape — copy an existing one (`Button` for simple,
`SegmentedControl` for interactive/accessible) rather than starting from scratch.

- **Four files per folder**: `Component.tsx`, `Component.module.css`,
  `Component.stories.tsx`, `index.ts`.
- **Presentational only**: thin wrappers over native elements. No data fetching, global
  state, or side effects. Interactive controls are **controlled** (`value` + `onChange`).
- **Styling**: CSS Modules + `var(--do-*)` semantic tokens exclusively.
- **Class composition**: `[styles.a, cond ? styles.b : '', className ?? ''].filter(Boolean).join(' ')`,
  merging any caller `className` last.
- **Props & refs**: forward refs where callers might focus/measure the element; spread
  `...rest` to the underlying element; default props inline in the signature.
- **Accessibility**: implement the correct WAI-ARIA pattern and keyboard support; require
  an `aria-label` prop when there's no visible label.
- **TypeScript**: strict; export a `*Props` interface plus any union types; use inline
  type imports (`import { type X } from '...'`) — ESLint enforces this.
- **Public API**: re-export the component and its types from the folder `index.ts`, then
  add that barrel to `src/index.ts`. Nothing is public until it's in `src/index.ts`.

## Stories

- `title: 'Components/<Name>'`.
- A `meta` with sensible `args` and `argTypes` (use `inline-radio` for small unions).
- One story per variant, plus composite `Variants` / `Sizes` render stories.
- Use jpdict-flavored copy (Russian / Japanese), matching existing stories.
- Doc comments (`/** … */`) above a story render as its Storybook description.

## Adding a component — checklist

1. Create the four files under `src/<Name>/`.
2. Style with semantic tokens only; get the a11y pattern right.
3. Write stories under `Components/<Name>` with real jpdict copy.
4. Export from `src/<Name>/index.ts`, then from `src/index.ts`.
5. `npm run typecheck && npm run lint && npm run format`.
6. Check the story (and its a11y panel) in Storybook.

## Formatting & lint

Prettier and ESLint are the source of truth (`.prettierrc.json`, `eslint.config.mjs`,
`.editorconfig`): single quotes, semicolons, trailing commas, 100-column width, 2-space
indent. Run `npm run format` and `npm run lint:fix` before committing.

## Pull requests

- Branch off `main`; **don't push directly to `main`** — a push there deploys Storybook
  to GitHub Pages via the workflow.
- Keep PRs focused on one component or concern.
- In the description, note any change that affects the public API or a token name, since
  jpdict depends on them.
