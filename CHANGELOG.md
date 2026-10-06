# Changelog

All notable changes to `gclass-anims` will be documented in this file.

## [1.0.0-beta.24] - 2026-10-05
### Added
- **`.gc-tween-[...]` escape hatch** - write GSAP vars inline when the menu has no class for it. `class="gc-tween-[y:40,opacity:0]"` plays **from** those values **to** the element's live resting state (read via `getComputedStyle`), so end values follow CSS / dark mode / breakpoints instead of being frozen into the class. Multiple `gc-tween-[...]` classes on one element **merge** (both properties end up on one tween). Modifiers work as usual: `.time-N`, `.ease-*`, `.order`, `.priority-N`, `.delay-N`, `.reduced`, `.preserve`, and `bp:` gating (`m:gc-tween-[...]`). Trigger prefixes mirror the `css-*` grammar: `hover-gc-tween-[...]`, `click-gc-tween-[...]`.
- **`.gc-tl` timeline host + `.gc-<n>-[...]` ordered steps** - `class="gc-tl gc-1-[y:40] gc-2-[opacity:1] gc-3-[scale:0.8]"` builds a `gsap.timeline()` with one tween per step, sorted ascending by the numeric prefix regardless of attribute order. Numbered steps imply a timeline, so `.gc-tl` is optional but expresses intent.
- **Per-step control keys inside the bracket** - `time:` / `dur:` overrides that step's duration (class-level `.time-N` still sets the default for steps that don't), `ease:` overrides the step's ease, and `at:` sets the GSAP **position** parameter (`at:0`, `at:">"`, `at:"+=0.2"`, `at:"<"`) for overlapping steps. These are consumed by the engine and never reach GSAP as properties.
- `.delay-N` is now a real modifier-a plain additive offset applied **after** the `.order` / `.priority-N` delay, so `order delay-2` shifts the stagger and `priority-3 delay-1` composes. `Config.js:23` previously promised `delay` support that no code implemented.
- `registerPlugins()` is exported, so a consumer can register the plugin set explicitly without booting the engine.

### Fixed
- **Consumer-package corruption via `sideEffects: false`.** All GSAP plugin registration moved out of module scope into `initListeners()` (`registerPlugins()` in `Animations.js`, plus the existing `TextPlugin`/`ScrollTrigger`/`SplitText` call). `package.json` declares `sideEffects: false`, which tells a consumer's bundler it may drop a module that only registers plugins on import-silently un-registering `SplitText` / `DrawSVG` / `ScrambleText` and making the matching classes throw at runtime inside someone else's app. Importing the package for helpers is now genuinely side-effect free. This also removes the duplicate `SplitText` / `TextPlugin` registration that existed at both module scope and init time.
- **`gclassDev()` no longer depends on import order.** `GSDevTools` registration moved from `AnimToggle.js` module scope into the body of `gclassDev()`, so it works whether or not `initAnimations()` has run. The docs site and `dev-react-strict` both call `gclassDev()` standalone and were relying on the module-scope registration.
- **Breakpoint tables are no longer frozen at import.** `Listeners.js` computed `bpNames` / `bpMap` / `bpPrefixRE` as module-scope `const`s, so assigning `defaults.breakpoints` after import was silently ignored. They are now derived lazily and memoised on the identity of the `defaults.breakpoints` object (port of the lazy `getBpDataMod()` approach `Animations.js` already used).
- **`css-<prop>-<from>-<to>` now merges instead of first-match-wins.** `parseCssAnim` returned on the first matching class, so an element could carry exactly one `css-*` animation and any further classes were ignored. All matching classes now merge into a single tween; a later class for the same property wins, and the first trigger prefix seen decides spawn/hover/click/loop for the whole element.
- **`.appear` on dynamically inserted `.gc` elements.** `setupGcAnims` is registered in the MutationObserver appear batch as well as the initial load pass, matching `setupCssAnims`.

### Changed
- `dist/` is now minified with source maps (`minify: true`, `sourcemap: true` in `vite.lib.config.js`). ESM 95.7 kB → 74.7 kB (gzip 19.6 kB), CJS 97.7 kB → 57.7 kB (gzip 17.5 kB). Source maps keep stack traces resolvable to the original `Listeners.js` / `Animations.js` lines. Note: `minify: 'esbuild'` fails on a clean install here because this repo has no direct `esbuild` dependency (Vite 8 delegates to rolldown)-`minify: true` is the portable form.
- **Removed `defaults.textStagger`.** Declared in `Config.js`, typed in `index.d.ts`, and documented on the defaults page, but read by nothing-stagger is derived arithmetically in `playText`. Deleted from all three rather than wired up, because making it the default would silently change the timing of every existing text animation.
- `index.d.ts` drift fixed: `initListeners` was declared as a **default** export while `index.js` re-exports it **named**, so `import initListeners from 'gclass-anims'` type-checked and then returned `undefined` at runtime; `Example` was typed but never exported (`index.js` omits it) and is now removed; `Defaults` now declares `breakpoints`, without which `defaults.breakpoints = {...}` was a type error and the whole `m:` system was unconfigurable in TypeScript; `finalOpacity`, `stashText`, `spawnClipReveal`, `curtainHorizontal`, `curtainVertical` and `scrambleSegments` now have declarations (all six ship in the bundle).

### Notes for consumers
- **One bracket group per `.gc` class.** Tailwind re-lexes bracket contents as standalone candidates, so a second bracket group leaks real CSS into your stylesheet: `gc-tween-[y:40]` emits nothing, but `gc-tween-[y:40]-[y:0]` makes Tailwind emit `.[y:0] { y: 0 }`. The parser only ever accepts one group, and `dev-react-strict/src/__tests__/gc-tween.test.jsx` asserts this against real Tailwind (with a control case proving the harness can detect a leak at all). For a two-value tween use two numbered steps, or the existing `css-<prop>-<from>-<to>`.
- `.randomize-*` does not reach `.gc` tweens-it is injected by monkey-patching `gsap.fromTo` inside `play()`-built tweens only.
- `demo/` is legacy: those static pages predate the docs site and are not wired into anything. Their `gclass-bundle.js` is a stale prebuilt bundle (dated 2026-08-27) and nothing in the repo regenerates it, so treat that directory as historical rather than a live example. `dist/` is the current build.

## [1.0.0-beta.23] - 2026-09-09
- Added `gclassDev()` helper-`AnimToggle.js:185` `gclassDev(cssOrOpts)` wraps `GSDevTools.create()` with doc-styled defaults (`slate-900` `rgba(15,23,42,0.96)`, `slate-700` border, `rounded-xl`, `backdrop-blur`). Accepts `gclassDev()` (defaults), `gclassDev("width:50%; bottom:30px")` (CSS string), `gclassDev({width:"50%"})` (style object shorthand), or `gclassDev({css, animation, minimal, ...})` (full `GSDevTools` opts). Registers `GSDevTools` via `gsap.registerPlugin(GSDevTools)` (`AnimToggle.js:4`), re-exported from `index.js:1` and typed in `index.d.ts:35`.

## [1.0.0-beta.22.2] - 2026-09-06
- Fixed `m:order` (and any `bp:order` / `bp:priority-*` / `bp:ease-*` / `bp:time-*`) disabling the entire `scroll` animation on smaller screens-`Listeners.js:1200,1232,1262` previously wrapped `setupScroll` / `playText` scroll variants in generic `runWithBreakpoint(el, ...)` which gated on *any* `bp:*` class on the element (so `m:order` gated `scroll`). Now uses per-animation `qAllAllVariants` + `runWithBreakpointForSel` (`".scroll"`, `".scroll-progress"`, `tSel`) so only a true `m:scroll` / `m:spawn-*` gates its own animation; unrelated modifiers like `m:order` only affect `hasGClass("order")` / `readTiming` (stagger) and `spawn-*` + `scroll` still play on all sizes (without stagger on <m). Keeps live `gsap.matchMedia` handling for true breakpoint-gated scroll. Reverts `HowWorkSection.jsx` workaround from `m:order` back to plain `order` for the default staggered landing.

## [1.0.0-beta.22.1] - 2026-09-06
- Fixed `.order` stagger grouping bug-`Listeners.js:76` `wrapQAll` now preserves DOM order via `body *` filter + `elementMatchesSel` (was `Set([...spawn-up], [...spawn-down])` grouping by type, now top-to-bottom as `qAll` does). Fixes `doc` `spawn` and landing `order` appearing all over.
- No API change from `beta.22`.

## [1.0.0-beta.22] - 2026-09-06
- Added responsive breakpoints-`Config.js:75` `defaults.breakpoints {xs:475,s:640,m:768,l:1024,xl:1280}` (single-letter `s/m/l` avoids Tailwind `sm/md/lg` collision). Usage `m:spawn-up`, `l:float`, `xs:spawn-up`. Gating is live via `gsap.matchMedia` (`Listeners.js:26,202`).
- Added breakpoint-aware modifiers-`m:amount-20`, `m:time-2`, `m:ease-bounce`, `m:priority-3`, `m:chars-[...]`, `m:spawn-num-10` etc. Mobile-first largest active wins (`Listeners.js:237` `getActivePrefixedClass`, `Animations.js:13` lazy helpers). Covers `amount-`, `time-`, `priority-`, `edelay-`, `etime-`, `stagger-`, `fill-time-`, `reveal-delay-`, `spawn-num-`, `progress-start-`, etc.
- Fixed runtime `customAnims` re-normalization-`Listeners.js:190` now calls `normalize(customAnims)` inside `initListeners()` so `customAnims.push()` before next `init` is picked up.
- Added ESM + CJS dual build-`vite.lib.config.js` (Vite lib) builds `dist/gclass.esm.js` + `dist/gclass.cjs` (`gsap` external); `package.json:4` bumped to `beta.22`, `main/module` point to `dist/`, `exports: {import, require}`, `sideEffects:false`, `prepublishOnly: build`.
- Fixed CJS `gsap` interop-`Animations.js:2`/`Listeners.js:1`/`AnimToggle.js:3`/`CustomAnims.js:1` now `import {gsap} from 'gsap'` (named import) for correct `require('gsap').gsap` interop.
- Added `dev-react-strict` test harness-`vitest` + `jsdom` + `src/__tests__/breakpoints.test.jsx` (14 tests: gating, modifiers, Tailwind coexistence, StrictMode) + `BreakpointHarness.jsx` visual; `vite.config.js` test config.
- Documented breakpoints-`doc/src/app/documentation/responsive-design/page.js` (was duplicate `optimization`).

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

- Fixed `scramble` with `scroll-progress` throwing `can't convert undefined to object`-`computeTo` (`Listeners.js:424`) and scrub `to` builder (`Listeners.js:867`) now guard `from` (`scramble` has no `from`).

## [1.0.0-beta.11] - 2026-08-26

- Fixed `.draw-split` infinite loop when paired with `.appear`-`splitPaths` (`Animations.js:244`) now strips `appear`/`scroll`/`scroll-progress`/`draw`/`draw-split`/`data-gsap-*` from cloned segments, marks children with `data-gsap-split` + `contain:paint`/`will-change:transform` isolation, and prevents `appearObserver` (`Listeners.js:1559`) re-triggering. Also isolated `draw-split` demos in docs.

## [1.0.0-beta.10] - 2026-08-26

- Added `.randomize-<prop>-[min]-[max]`-randomize spawn start values per element (e.g. `randomize-rotation-[-90]-[90]`, `randomize-x-[-40]-[40]`). Re-rolls on every replay (`.scroll` re-enter, `.appear`).
- Added `.draw`-stroke-draw reveal for SVG paths using DrawSVGPlugin (`drawSVG: 0% → 100%`).
- Added `.draw-split`-draws multi-segment SVG paths sequentially at constant pen speed (splits paths with multiple `M` commands into individual strokes).
- Added `.scramble`-text resolves from empty through scrambled characters into real content (ScrambleTextPlugin). Supports `.reveal-delay-N`, `.chars-[...]`, `.amount-N`, `.scramble-rtl`.
- Added `.scramble-all`-variant of scramble with no empty start; the finished string flips to garbage as a whole then sweeps back.
- Added `.scroll-frame`-use a scrollable container as the ScrollTrigger scroller for nested `.scroll` / `.scroll-progress` elements (innermost `.scroll-frame` ancestor wins).
- Fixed `spawn-text-*` (SplitText) not working correctly on flex containers-text runs are now wrapped in block containers before splitting to preserve flex layout, spacing, and line grouping.

## [1.0.0-beta.9]-Previous release

- See git history for earlier changes.
