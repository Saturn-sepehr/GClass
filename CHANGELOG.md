# Changelog

All notable changes to `gclass-anims` will be documented in this file.

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
