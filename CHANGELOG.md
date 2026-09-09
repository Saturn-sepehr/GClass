# Changelog

All notable changes to `gclass-anims` will be documented in this file.

## [1.0.0-beta.23] - 2026-09-09
- Added `gclassDev()` helper — `AnimToggle.js:185` `gclassDev(cssOrOpts)` wraps `GSDevTools.create()` with doc-styled defaults (`slate-900` `rgba(15,23,42,0.96)`, `slate-700` border, `rounded-xl`, `backdrop-blur`). Accepts `gclassDev()` (defaults), `gclassDev("width:50%; bottom:30px")` (CSS string), `gclassDev({width:"50%"})` (style object shorthand), or `gclassDev({css, animation, minimal, ...})` (full `GSDevTools` opts). Registers `GSDevTools` via `gsap.registerPlugin(GSDevTools)` (`AnimToggle.js:4`), re-exported from `index.js:1` and typed in `index.d.ts:35`.

## [1.0.0-beta.22.2] - 2026-09-06
- Fixed `m:order` (and any `bp:order` / `bp:priority-*` / `bp:ease-*` / `bp:time-*`) disabling the entire `scroll` animation on smaller screens — `Listeners.js:1200,1232,1262` previously wrapped `setupScroll` / `playText` scroll variants in generic `runWithBreakpoint(el, ...)` which gated on *any* `bp:*` class on the element (so `m:order` gated `scroll`). Now uses per-animation `qAllAllVariants` + `runWithBreakpointForSel` (`".scroll"`, `".scroll-progress"`, `tSel`) so only a true `m:scroll` / `m:spawn-*` gates its own animation; unrelated modifiers like `m:order` only affect `hasGClass("order")` / `readTiming` (stagger) and `spawn-*` + `scroll` still play on all sizes (without stagger on <m). Keeps live `gsap.matchMedia` handling for true breakpoint-gated scroll. Reverts `HowWorkSection.jsx` workaround from `m:order` back to plain `order` for the default staggered landing.

## [1.0.0-beta.22.1] - 2026-09-06
- Fixed `.order` stagger grouping bug — `Listeners.js:76` `wrapQAll` now preserves DOM order via `body *` filter + `elementMatchesSel` (was `Set([...spawn-up], [...spawn-down])` grouping by type, now top-to-bottom as `qAll` does). Fixes `doc` `spawn` and landing `order` appearing all over.
- No API change from `beta.22`.

## [1.0.0-beta.22] - 2026-09-06
- Added responsive breakpoints — `Config.js:75` `defaults.breakpoints {xs:475,s:640,m:768,l:1024,xl:1280}` (single-letter `s/m/l` avoids Tailwind `sm/md/lg` collision). Usage `m:spawn-up`, `l:float`, `xs:spawn-up`. Gating is live via `gsap.matchMedia` (`Listeners.js:26,202`).
- Added breakpoint-aware modifiers — `m:amount-20`, `m:time-2`, `m:ease-bounce`, `m:priority-3`, `m:chars-[...]`, `m:spawn-num-10` etc. Mobile-first largest active wins (`Listeners.js:237` `getActivePrefixedClass`, `Animations.js:13` lazy helpers). Covers `amount-`, `time-`, `priority-`, `edelay-`, `etime-`, `stagger-`, `fill-time-`, `reveal-delay-`, `spawn-num-`, `progress-start-`, etc.
- Fixed runtime `customAnims` re-normalization — `Listeners.js:190` now calls `normalize(customAnims)` inside `initListeners()` so `customAnims.push()` before next `init` is picked up.
- Added ESM + CJS dual build — `vite.lib.config.js` (Vite lib) builds `dist/gclass.esm.js` + `dist/gclass.cjs` (`gsap` external); `package.json:4` bumped to `beta.22`, `main/module` point to `dist/`, `exports: {import, require}`, `sideEffects:false`, `prepublishOnly: build`.
- Fixed CJS `gsap` interop — `Animations.js:2`/`Listeners.js:1`/`AnimToggle.js:3`/`CustomAnims.js:1` now `import {gsap} from 'gsap'` (named import) for correct `require('gsap').gsap` interop.
- Added `dev-react-strict` test harness — `vitest` + `jsdom` + `src/__tests__/breakpoints.test.jsx` (14 tests: gating, modifiers, Tailwind coexistence, StrictMode) + `BreakpointHarness.jsx` visual; `vite.config.js` test config.
- Documented breakpoints — `doc/src/app/documentation/responsive-design/page.js` (was duplicate `optimization`).

## [1.0.0-beta.21] - 2026-9-3
- Added a `gclassOpts()` function that controls the animation fps and observer throttling

## [1.0.0-beta.20] - 2026-9-2
- Fix ESM strict import: `AnimToggle.js` and `Listeners.js` now use `.js` extensions (`Remix`/`Qwik` Node ESM `Cannot find module` fix)
- Fix `Lit` shadow DOM `works.txt` `no` → light DOM default (`createRenderRoot(){return this}`) + `initListeners(shadowRoot)` docs
- Fix `SvelteKit` `ERESOLVE` (`@sveltejs/vite-plugin-svelte 4` → `5.1` for `vite@6`) + missing `src/app.html`
- Fix `Qwik` `entry.ssr not found` → add `src/root.tsx`+`entry.ssr.tsx`+`tsconfig.json`
- Fix `SolidStart` Vinxi `503` → simplified to `vite-plugin-solid` SPA (same fine-grained model)
- Reverted license `LGPL-3.0-only` → `MIT` (anywhere GSAP is usable)

## [1.0.0-beta.19] - 2026-9-1
- Fixed the SplitText animations formatting and removed Boot.js

## [1.0.0-beta.18] - 2026-9-1
- Hopefully finally fixed `.boot-up` properly skipping on path changes

## [1.0.0-beta.17] - 2026-9-1
- Fixed the `.boot-up` class firing on every path change

## [1.0.0-beta.16] - 2026-09-1
- Added a new `.boot-up` class for boot up animations
- Fixed text animations not taking formatting into account


## [1.0.0-beta.13] - 2026-08-27
- Added a new `.fill-svg` modifier for the `.draw` and `.draw-split` classes that fills the SVG after it has been drawn.

## [1.0.0-beta.12] - 2026-08-26

- Fixed `scramble` with `scroll-progress` throwing `can't convert undefined to object` - `computeTo` (`Listeners.js:424`) and scrub `to` builder (`Listeners.js:867`) now guard `from` (`scramble` has no `from`).

## [1.0.0-beta.11] - 2026-08-26

- Fixed `.draw-split` infinite loop when paired with `.appear` - `splitPaths` (`Animations.js:244`) now strips `appear`/`scroll`/`scroll-progress`/`draw`/`draw-split`/`data-gsap-*` from cloned segments, marks children with `data-gsap-split` + `contain:paint`/`will-change:transform` isolation, and prevents `appearObserver` (`Listeners.js:1559`) re-triggering. Also isolated `draw-split` demos in docs.

## [1.0.0-beta.10] - 2026-08-26

- Added `.randomize-<prop>-[min]-[max]` - randomize spawn start values per element (e.g. `randomize-rotation-[-90]-[90]`, `randomize-x-[-40]-[40]`). Re-rolls on every replay (`.scroll` re-enter, `.appear`).
- Added `.draw` - stroke-draw reveal for SVG paths using DrawSVGPlugin (`drawSVG: 0% → 100%`).
- Added `.draw-split` - draws multi-segment SVG paths sequentially at constant pen speed (splits paths with multiple `M` commands into individual strokes).
- Added `.scramble` - text resolves from empty through scrambled characters into real content (ScrambleTextPlugin). Supports `.reveal-delay-N`, `.chars-[...]`, `.amount-N`, `.scramble-rtl`.
- Added `.scramble-all` - variant of scramble with no empty start; the finished string flips to garbage as a whole then sweeps back.
- Added `.scroll-frame` - use a scrollable container as the ScrollTrigger scroller for nested `.scroll` / `.scroll-progress` elements (innermost `.scroll-frame` ancestor wins).
- Fixed `spawn-text-*` (SplitText) not working correctly on flex containers - text runs are now wrapped in block containers before splitting to preserve flex layout, spacing, and line grouping.

## [1.0.0-beta.9] - Previous release

- See git history for earlier changes.
