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
| `npm run test` | Runs every story in headless Chromium; `play` functions are the assertions |
| `npm run test:watch` | Same, in watch mode |
| `npm run typecheck` | `tsc --noEmit` — **run after any `.ts`/`.tsx` change** |
| `npm run lint` | ESLint over the repo |
| `npm run lint:fix` | ESLint with `--fix` |
| `npm run format` | Prettier write over `src/**` |
| `npm run format:check` | Prettier check (CI-style) |

There are **no separate unit tests** — Storybook stories are the verification surface, and
`npm run test` runs them for real via [vitest.config.ts](vitest.config.ts)
(`@storybook/addon-vitest` + Playwright). A story with a `play` function is a test; one
without still asserts that the component renders without throwing. Requires a Chromium
download once (`npx playwright install chromium`).

Before finishing a change, run `npm run typecheck`, `npm run lint`, and `npm run test`, and
confirm the affected story still renders (`npm run storybook`).

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
  Badge/ CardGrid/ CardTile/ DailyGoal/ DashboardCard/ DeckCard/ EntryCard/
  EntryList/ KanjiCard/ SearchField/ SearchOption/ SearchOptionList/
  SectionHeading/ SegmentedControl/ SentenceView/ StatTile/ StreakBadge/
  ToggleGroup/ VocabList/ VocabRow/ WordCard/
                        same four-file shape
  shared/
    useRadioGroupKeys.ts  radiogroup arrow/Home/End behavior (selection follows focus)
    listbox.ts            option DOM ids shared by a combobox and its listbox
  css-modules.d.ts      `*.module.css` typing shim
  index.ts              public entry — re-exports every component barrel
.storybook/             Storybook config; preview.tsx loads tokens.css globally
vitest.config.ts        runs every story in a real browser; play functions are the tests
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
[SegmentedControl.tsx](src/SegmentedControl/SegmentedControl.tsx). The one sanctioned
side effect is keeping the element the user is on visible — see
[KanjiCard.tsx](src/KanjiCard/KanjiCard.tsx) and
[SearchOptionList.tsx](src/SearchOptionList/SearchOptionList.tsx).

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
enabled in Storybook — check the Accessibility panel. See **Interaction contracts** below
for the rules that panel cannot check for you.

**Formatting.** Prettier: single quotes, semicolons, trailing commas, 100-col width,
2-space indent (see [.prettierrc.json](.prettierrc.json) / [.editorconfig](.editorconfig)).
Run `npm run format` before finishing.

## Interaction contracts (non-negotiable)

These four rules exist because each was violated by a component that *looked* finished.
A component that advertises a behavior — in its docs, its props, or its UI — and does not
implement it is a bug, not an omission.

**1. Selection follows focus only when committing is free.** A `radiogroup` (a cheap
filter like SegmentedControl or ToggleGroup) may fuse them: arrow keys move focus *and*
change the value, via [useRadioGroupKeys.ts](src/shared/useRadioGroupKeys.ts). Anything
where committing does real work — a fetch, a parse, a navigation — must be
**browse-then-commit**: arrows move a highlight only, Enter commits, and the highlight is
a separate prop from the committed value. Never wire arrow keys straight into an
`onSelect` that triggers work.

**2. When focus must stay put, use `aria-activedescendant`, not roving focus.** A popover
list hanging off a text input cannot take focus, or the user stops being able to type.
The input keeps focus and owns the keys; the list is presentation. See
[SearchField.tsx](src/SearchField/SearchField.tsx) driving
[SearchOptionList.tsx](src/SearchOptionList/SearchOptionList.tsx). When focus *can* move
into the widget, prefer roving `tabIndex`.

**3. Overlays are bounded; in-flow lists are free; virtualized collections are the
exception.** Any list rendered as an overlay gets
`max-height: var(--do-size-overlay-list-max-height)` + `overflow-y: auto`, and must scroll
its active item into view (`scrollIntoView({ block: 'nearest' })`) or the highlight can
vanish off-screen. Lists that flow in the page (EntryList) stay unbounded — a nested
scrollport is worse than letting the page scroll. Both stay overridable via `className`.

The one sanctioned exception is **virtualization**. `VocabList` and `CardGrid` render only
what fits, which is impossible without a known viewport, so they take a required `height`
and own a scroll container. Take that exception only when the collection is genuinely
unbounded (a user's entire saved vocabulary); for anything that fits on a page, use
`EntryList` and let the window scroll. A component that owns a scrollport must say so in
its doc comment, as those two do — jpdict's own "the window is the only scroll surface"
rule has a matching carve-out, and neither should drift from the other.

**4. Wrap primary content, clamp secondary.** Primary content — the headword, the Japanese
text, anything the user is deciding *about* — wraps and never truncates. Secondary lines
(hints, glosses) clamp to one line with ellipsis so rows stay predictable. Every flex or
grid child holding caller-supplied text needs `min-width: 0`, and such text needs
`overflow-wrap: anywhere` so one unbroken token cannot blow out the layout.

**Verification.** Every interactive component ships a `play` function asserting its
keyboard contract — see the `KeyboardContract`, `EscapeDismisses`, and `EnterCommits`
stories in
[SearchOptionList.stories.tsx](src/SearchOptionList/SearchOptionList.stories.tsx).
`npm run test` runs every story in headless Chromium; the a11y addon cannot catch a
listbox whose arrow keys do nothing, so prose and axe are not enough.

## Conventions, continued

**TypeScript.** Strict mode, `noUnusedLocals`/`noUnusedParameters` on. Use **inline
type imports** (`import { forwardRef, type ButtonHTMLAttributes } from 'react'`) — ESLint
enforces `consistent-type-imports`. Export a named `*Props` interface plus any union
types (`ButtonVariant`, `SegmentedControlSize`). Prefix intentionally-unused vars with
`_`.

**Stories.** `title: 'Components/<Name>'`, a `meta` with `args`/`argTypes`, one story
per variant, plus composite `Variants`/`Sizes` render stories. Use jpdict-flavored copy.
Doc comments on stories become Storybook descriptions. Interactive components additionally
get a `play` function per rule 4 above.

## Adding a component (checklist)

1. `src/<Name>/<Name>.tsx` — presentational, tokens-only styling, a11y correct.
2. `src/<Name>/<Name>.module.css` — `var(--do-*)` only.
3. `src/<Name>/<Name>.stories.tsx` — `Components/<Name>`, jpdict copy.
4. `src/<Name>/index.ts` — barrel (component + types).
5. Add the barrel export to `src/index.ts`.
6. **Interaction contracts** — pick the keyboard model (contract 1) and the focus model
   (contract 2), bound it if it's an overlay (contract 3), decide what long text does
   (contract 4). If the component claims a WAI-ARIA pattern, implement all of it.
7. **A `play` function** asserting that keyboard contract, plus a story showing the
   component under content it cannot fit.
8. `npm run typecheck && npm run lint && npm run test && npm run format`.
9. Verify the story renders in Storybook.

## Git / PRs

- Default branch is `main`. Pushing to `main` triggers the Storybook Pages deploy
  ([deploy-storybook.yml](.github/workflows/deploy-storybook.yml)) — don't push there
  unless asked; branch first.
- Commit or push only when the user asks.
- Do not commit `node_modules/` or `storybook-static/` (both gitignored).
