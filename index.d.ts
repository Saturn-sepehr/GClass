// Type definitions for gclass (GClass)
// A Tailwind-style utility layer on top of GSAP.
// This file describes the public API exported from index.js.

// --- AnimToggle ------------------------------------------------------------

/** Boots the GSAP animation system (idempotent). */
export function initAnimations(): void
/** Toggle animations on/off and reload the page. */
export function toggleAnimations(): void
/** Force animations off (wins over any stored preference) and reload. */
export function enableReducedMotion(): void
/** Clear the forced reduced-motion override and reload. */
export function disableReducedMotion(): void

// --- Listeners -------------------------------------------------------------

/** Type of a function an onComplete hook resolves to. */
export type CompleteHandler = (el: HTMLElement) => void

/**
 * Register a named onComplete handler, referenced from markup via
 * `on-<kind>-complete-<name>` (spawn / loop / click).
 */
export function registerComplete(name: string, fn: CompleteHandler): CompleteHandler

/**
 * Boot the engine directly, bypassing AnimToggle. Returns a teardown function
 * that removes all listeners/observers/tweens created by this run.
 */
export default function initListeners(): () => void

// --- onComplete config -----------------------------------------------------

/** Per-element timing/ease classes bundled for `build`/`setup` handlers. */
export interface LoopCtx {
  edelay: number
  amount: number
  etime: number
  ease: string
  time: number
  mH: number
  mV: number
  radiateZ: number | null
}

/**
 * A declarative animation definition. Add entries to `animations` or push to
 * `customAnims`. The engine inspects which fields are present and wires up the
 * matching behaviour (scroll / order / leave / appear / loop) automatically.
 */
export interface AnimationConfig {
  /** The className you put on elements, e.g. ".spawn-up". */
  sel: string
  /** Optional hidden starting state (enables leave/scroll reversal). */
  from?: Record<string, any>
  /** Entrance (load / appear / scroll-enter) tween. Return a tween or timeline. */
  play?: (el: HTMLElement, delay: number, dur: number, ease: string) => any
  /** Looping animation. Return a tween/timeline; engine applies repeat(-1). */
  build?: (el: HTMLElement, ctx: LoopCtx) => any
  /** Storage key for the loop tween on the element (defaults to `sel`). */
  key?: string
  /** Marks a TextPlugin typewriter entry. */
  typewriter?: boolean
  /** Marks a per-part (SplitText) typewriter entry. */
  typewriterSplit?: boolean
  /** Marks a numeric counter entry (counts from `.spawn-num-N` to the element's number). */
  count?: boolean
  /** Marks a ScrambleText entry (text resolves out of garbage characters). */
  scramble?: boolean
  /** Set false to skip generating a `.spawn-text-<name>` variant. Default true. */
  text?: boolean
  /** Set false to keep `build` but skip the always-on repeat. Default true. */
  loop?: boolean
  /** "Special abilities" hook. If it returns a function, that runs on teardown. */
  setup?: (el: HTMLElement, ctx: LoopCtx) => void | (() => void)
}

/** A spawnConfigs entry (has a `play`). */
export interface SpawnConfig {
  sel: string
  from?: Record<string, any>
  play: (el: HTMLElement, delay: number, dur: number, ease: string) => any
  typewriter?: boolean
  typewriterSplit?: boolean
  count?: boolean
  scramble?: boolean
  text: boolean
}

/** A loopConfigs entry (has a `build`). */
export interface LoopConfig {
  sel: string
  build: (el: HTMLElement, ctx: LoopCtx) => any
  key: string
  loop: boolean
}

/** Result of `normalize()`. */
export interface NormalizedConfig {
  all: AnimationConfig[]
  spawnConfigs: SpawnConfig[]
  loopConfigs: LoopConfig[]
}

// --- Config ----------------------------------------------------------------

export interface Defaults {
  orderDivide: number
  spawnDelayMultiplier: number
  spawnOffset: number
  clickOffset: number
  clickExpandOffset: number
  clickDuration: number
  ease: string
  effectDelay: number
  effectDuration: number
  effectOffset: number
  progressStart: string
  progressEnd: string
  textStagger: number
  typewriterSplitCharDuration: number
  minTextPartDuration: number
  revealDelay: number
  characterlist: string
}

/** Global timing / ease defaults (edit to tweak global behaviour). */
export const defaults: Defaults

/** Built-in animation definitions (add / remove entries here). */
export const animations: AnimationConfig[]

/** Derived spawn/loop views of the config, plus the merged `all` list. */
export function normalize(extra?: AnimationConfig[]): NormalizedConfig

// --- CustomAnims -----------------------------------------------------------

/** User-supplied animations, merged into the engine at init time. */
export const customAnims: AnimationConfig[]

/** Example manual helper (not wired into listeners). */
export function Example(target: any, customVars: object): any

// --- Animations ------------------------------------------------------------

/** A GSAP tweenable target (element / selector / array). */
export type TweenTarget = any

/** Spawn an element vertically by `dir` px. */
export function SpawnV(target: TweenTarget, delay: number, dir: number, dur: number, ease: string): any
/** Spawn an element horizontally by `dir` px. */
export function SpawnH(target: TweenTarget, delay: number, dir: number, dur: number, ease: string): any
export function expandV(target: TweenTarget, delay: number, dur: number, ease: string): any
export function expandH(target: TweenTarget, delay: number, dur: number, ease: string): any
export function expandA(target: TweenTarget, delay: number, dur: number, ease: string): any
export function typewriter(target: TweenTarget, text: string, dur: number, delay: number, ease: string): any
export function spawnSpinCCW(target: TweenTarget, delay: number, dur: number, ease: string): any
export function spawnSpinCW(target: TweenTarget, delay: number, dur: number, ease: string): any
export function spawnFade(target: TweenTarget, delay: number, dur: number, ease: string): any
export function spawnBlur(target: TweenTarget, delay: number, dur: number, ease: string): any
export function spawnXUp(target: TweenTarget, delay: number, dur: number, ease: string): any
export function spawnXDown(target: TweenTarget, delay: number, dur: number, ease: string): any
export function spawnYRight(target: TweenTarget, delay: number, dur: number, ease: string): any
export function spawnYLeft(target: TweenTarget, delay: number, dur: number, ease: string): any
export function expandRight(target: TweenTarget, delay: number, dur: number, ease: string): any
export function expandLeft(target: TweenTarget, delay: number, dur: number, ease: string): any
export function expandUp(target: TweenTarget, delay: number, dur: number, ease: string): any
export function expandDown(target: TweenTarget, delay: number, dur: number, ease: string): any
export function countUp(target: TweenTarget, delay: number, dur: number, ease: string): any
/** Reads a count element's start (`.spawn-num-N`, else 0), target number, and decimals. */
export function countTargetVars(target: TweenTarget): { start: number; end: number; decimals: number }
/**
 * Reads a scramble element's modifiers against the package defaults:
 * `.amount-N` -> speed (default 1), `.reveal-delay-N` -> revealDelay
 * (default `defaults.revealDelay`), `.chars-[...]` -> character pool verbatim
 * (default `defaults.characterlist`). Also segments the element: only
 * top-level text runs are scrambled (each wrapped in its own span); nested
 * elements are preserved untouched.
 */
export function scrambleVars(target: TweenTarget): {
  segs: { t: any; text: string }[]
  chars: string
  speed: number
  revealDelay: number
  rtl: boolean
}
/**
 * Scramble spawn: the text starts empty and resolves into its real content
 * through garbage characters (ScrambleTextPlugin). No opacity change; nested
 * elements are preserved. Defaults to a linear ease so `.time-N` is the true
 * total reveal time - an explicit `.ease-*` class overrides. Modifiers read
 * from the element: .reveal-delay-N, .chars-[...], .amount-N, .scramble-all
 * (whole-string scramble-and-sweep, no empty-start typing), .scramble-rtl.
 */
export function scramble(target: TweenTarget, delay: number, dur: number, ease: string): any
/** Progressively draws the target's SVG stroke from 0% to 100% (strokes only). */
export function drawsvg(target: TweenTarget, delay: number, dur: number, ease: string): any
/**
 * Splits multi-segment `<path>` elements (multiple "M" commands) into one
 * single-segment `<path>` per segment. Destructive: source paths are replaced.
 * Results are cached on the original element for engine re-inits.
 */
export function splitPaths(paths: any): any[]
/** DrawSVG variant that splits multi-segment paths first, then draws each segment sequentially at constant speed. Returns a timeline. */
export function drawsvgSplit(target: TweenTarget, delay: number, dur: number, ease: string): any
export function verticalmove(target: TweenTarget, amount: number, dur: number, ease: string): any
export function expandmove(target: TweenTarget, amount: number, dur: number, ease: string): any
export function magnet(target: TweenTarget, x: number, y: number, scale: number, dur: number, ease: string): any
export function magnet3d(target: TweenTarget, x: number, y: number, scale: number, rotX: number, rotY: number, dur: number, ease: string): any
export function reset(target: TweenTarget, dur: number, ease: string): any
export function spinCW(target: TweenTarget, delay: number, dur: number, ease: string): any
export function spinCCW(target: TweenTarget, delay: number, dur: number, ease: string): any
export function bounce(delay: number, target: TweenTarget, amount: number, dur: number, ease: string): any
export function shake(delay: number, target: TweenTarget, amount: number, dur: number, ease: string): any
export function bell(delay: number, target: TweenTarget, amount: number, dur: number, ease: string): any
export function pulse(delay: number, target: TweenTarget, amount: number, dur: number, ease: string): any
export function radiate(delay: number, target: TweenTarget, amount: number, dur: number, ease: string, zIndex: any): any
export function hover(delay: number, target: TweenTarget, amount: number, dur: number, ease: string): any
export function marquee(target: TweenTarget, dir: string, duration: number, xOffset?: number, yOffset?: number, noRepeat?: boolean): any
export function flip(state: any, ease: string, dur: number): any
export function animatecss(target: TweenTarget, dur: number, delay: number, ease: string, propertyS: any, propertySValue: any, propertyE: any, propertyEValue: any): any