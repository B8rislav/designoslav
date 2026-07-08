# CLAUDE.md

Guidance for AI agents (Claude Code and others) working in this repository. Read this
before making changes. For the human-facing contributor guide see
[CONTRIBUTING.md](CONTRIBUTING.md).

## What this repo is

**Designoslav** is the **Kotoba Lab design system** — a standalone React 19 +
TypeScript component library, documented in Storybook. Theme is **Celadon Zen**: soft
warm neutrals, one deep green accent (celadon), one warm accent (terracotta).

It is **published as source** (no build step / no `dist/`). Consumers import straight
from `src` via the `exports` map in [package.json](package.json):

```jsonc
"exports": {
  ".": "./src/index.ts",
  "./tokens.css": "./src/tokens/tokens.css",
  "./tokens": "./src/tokens/index.ts"
}
```

### Who consumes it

The **jpdict frontend** — https://github.com/B8rislav/jpdict — is the primary (and
current sole) consumer. Designoslav exists to **replace Gravity UI** in that app. Keep
this in mind:

- Sample copy in stories is deliberately Russian / Japanese (`Найти`, `日本語`,
  `Начать повторение`) because that is jpdict's UI language. Match this when adding
  stories.
- Component API shape should serve jpdict's real needs. If a prop only makes sense for
  a hypothetical consumer, leave it out.
- Breaking a component's public API (`ButtonProps`, `SegmentedControlProps`, exported
  names, token names) is a **breaking change for jpdict**. Call it out explicitly in
  your summary and don't do it silently.

## Commands

Node is pinned in [.nvmrc](.nvmrc) (v25.8.1) — assume `nvm use` then `npm install`.

| Command | What it does |
|---------|--------------|
| `npm run storybook` | Storybook dev server — http://localhost:6006 |
| `npm run build:storybook` | Static build to `storybook-static/` |
| `npm run typecheck` | `tsc --noEmit` — **run after any `.ts`/`.tsx` change** |
| `npm run lint` | ESLint over the repo |
| `npm run lint:fix` | ESLint with `--fix` |
| `npm run format` | Prettier write over `src/**` |
| `npm run format:check` | Prettier check (CI-style) |

There is **no test runner** and **no unit tests** — Storybook stories are the
verification surface. Before finishing a change, run `npm run typecheck` and
`npm run lint`, and confirm the affected story still renders (`npm run storybook`).

## Layout

```
src/
  tokens/
    colors.css          raw palette + semantic color tokens — the source of truth
    tokens.css          type / spacing / radius / shadow / motion — @imports colors.css
    index.ts            intentionally empty (no duplicated JS color values)
    Colors.stories.tsx  living swatch gallery
  Button/
    Button.tsx          component
    Button.module.css   styles (CSS Module)
    Button.stories.tsx  stories
    index.ts            barrel: re-exports component + its types
  SegmentedControl/     same four-file shape
  css-modules.d.ts      `*.module.css` typing shim
  index.ts              public entry — re-exports every component barrel
.storybook/             Storybook config; preview.tsx loads tokens.css globally
.github/workflows/      deploy-storybook.yml → GitHub Pages on push to main
```

## Conventions (follow these exactly)

**Component anatomy.** One folder per component holding `Component.tsx`,
`Component.module.css`, `Component.stories.tsx`, and `index.ts`. The `index.ts` barrel
re-exports the component *and* its public types; then add that barrel to
[src/index.ts](src/index.ts). Nothing is public until it is exported from `src/index.ts`.

**Presentational only.** Components are thin wrappers over native elements styled from
tokens — no data fetching, no global state, no side effects. Stateful controls are
**controlled** (`value` + `onChange`), never internally stateful. See
[SegmentedControl.tsx](src/SegmentedControl/SegmentedControl.tsx).

**Styling = CSS Modules + tokens.** Never hardcode a color, radius, spacing, shadow, or
duration. Reference `var(--do-*)` semantic tokens only (`--do-color-primary`,
`--do-color-surface`, `--do-radius-md`, …). Do **not** reach for raw palette tokens
(`--do-celadon-500`) inside a component — those are the palette layer; components read
the semantic layer. If you need a token that doesn't exist, add a semantic token in
`colors.css`/`tokens.css` rather than hardcoding.

**Class composition.** Combine module classes with the
`[styles.a, cond ? styles.b : '', className ?? ''].filter(Boolean).join(' ')` pattern
used across existing components; always merge a caller-supplied `className` last.

**Refs & props.** Forward refs where a caller would reasonably focus/measure the element
(`Button` uses `forwardRef`). Spread `...rest` onto the underlying element so native
attributes pass through. Default props inline in the signature.

**Accessibility is not optional.** Implement the correct WAI-ARIA pattern and keyboard
behavior (SegmentedControl implements `radiogroup` with arrow/Home/End keys). Require an
`aria-label` via the prop type when a control has no visible label. The a11y addon is
enabled in Storybook — check the Accessibility panel.

**TypeScript.** Strict mode, `noUnusedLocals`/`noUnusedParameters` on. Use **inline
type imports** (`import { forwardRef, type ButtonHTMLAttributes } from 'react'`) — ESLint
enforces `consistent-type-imports`. Export a named `*Props` interface plus any union
types (`ButtonVariant`, `SegmentedControlSize`). Prefix intentionally-unused vars with
`_`.

**Stories.** `title: 'Components/<Name>'`, a `meta` with `args`/`argTypes`, one story
per variant, plus composite `Variants`/`Sizes` render stories. Use jpdict-flavored copy.
Doc comments on stories become Storybook descriptions.

**Formatting.** Prettier: single quotes, semicolons, trailing commas, 100-col width,
2-space indent (see [.prettierrc.json](.prettierrc.json) / [.editorconfig](.editorconfig)).
Run `npm run format` before finishing.

## Adding a component (checklist)

1. `src/<Name>/<Name>.tsx` — presentational, tokens-only styling, a11y correct.
2. `src/<Name>/<Name>.module.css` — `var(--do-*)` only.
3. `src/<Name>/<Name>.stories.tsx` — `Components/<Name>`, jpdict copy.
4. `src/<Name>/index.ts` — barrel (component + types).
5. Add the barrel export to `src/index.ts`.
6. `npm run typecheck && npm run lint && npm run format`.
7. Verify the story renders in Storybook.

## Git / PRs

- Default branch is `main`. Pushing to `main` triggers the Storybook Pages deploy
  ([deploy-storybook.yml](.github/workflows/deploy-storybook.yml)) — don't push there
  unless asked; branch first.
- Commit or push only when the user asks.
- Do not commit `node_modules/` or `storybook-static/` (both gitignored).
