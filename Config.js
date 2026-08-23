import {
  bounce, expandH, expandV, shake, SpawnH, SpawnV, spawnSpinCCW, spawnSpinCW,
  spinCCW, spinCW, expandA, typewriter, bell, spawnBlur, spawnFade, spawnXDown,
  spawnXUp, spawnYRight, spawnYLeft, pulse, radiate, hover, expandRight,
  expandLeft, expandUp, expandDown, marquee, countUp,
  spawnClipReveal, curtainHorizontal, curtainVertical, stashText,
} from './Animations.js'

// ---------------------------------------------------------------------------
// GClass configuration — THE single place to add / remove / tweak animations.
//
// `animations` is an array of entries. Each entry is a plain object; the engine
// inspects which fields are present and wires up the matching behaviour
// automatically — no engine edits needed:
//
//   sel        - the className you put on elements (e.g. ".spawn-up")
//
//   play       - (el, delay, dur, ease) => tween|timeline. The entrance
//                (load / appear / scroll-enter) animation. When present, the
//                entry is treated as a "spawn" and AUTOMATICALLY gets:
//                  • `.order` / `priority-*` / `reverse` ordering
//                  • `time-*` duration, `ease-*`, `delay` support
//                  • `.scroll` + `.scroll-progress` ScrollTrigger versions
//                  • `.appear` for dynamically-added elements
//                  • `.leave` reverse exit
//                  • a `.spawn-text-<name>` SplitText variant (unless text:false)
//
//   from       - optional. The hidden starting state ({ opacity: 0, ... }).
//                Required if you want leave/scroll reversal to look right.
//
//   typewriter - optional true. Marks the entry as a text typewriter (TextPlugin)
//   typewriterSplit - optional true. Per-part "typed" reveal (see playText)
//
//   build      - (el, ctx) => tween|timeline. A looping animation. When present
//                the entry is ALSO treated as a "loop": it runs `.repeat(-1)` on
//                load and enables `hover-<name>` / `click-<name>` triggers.
//   key        - optional. Storage key on the element (defaults to `sel`).
//
//   loop       - optional boolean. Set false to keep `build` but skip the
//                always-on repeat (hover/click only).
//
//   text       - optional boolean (default true). Set false to skip generating
//                the `.spawn-text-<name>` SplitText variant.
//
//   setup      - optional (el, ctx) => void | teardownFn. A "special abilities"
//                hook called once for every matching element when it's first
//                wired up. Use it for custom behaviour (observers, listeners,
//                timers, DOM state) that doesn't fit the scroll/order machinery.
//                If it RETURNS a function, that function is invoked during
//                engine teardown to clean up side-effects.
//
// Add an entry -> it just works. Remove an entry -> it disappears everywhere.
// ---------------------------------------------------------------------------

export const defaults = {
  orderDivide: 5,
  spawnDelayMultiplier: 0.2,
  spawnOffset: 20,
  clickOffset: 10,
  clickExpandOffset: 15,
  clickDuration: 0.2,
  ease: "back",
  effectDelay: 0.5,
  effectDuration: 1,
  effectOffset: 20,
  progressStart: "top bottom",
  progressEnd: "center center",
  textStagger: 0.03,
  typewriterSplitCharDuration: 0.05,
  minTextPartDuration: 0.3,
}

export const animations = [
  // --- Spawn / entrance (from + play) --------------------------------------
  { sel: ".spawn-down", from: { opacity: 0, y: -defaults.spawnOffset }, play: (el, delay, dur, ease) => SpawnV(el, delay, -defaults.spawnOffset, dur, ease) },
  { sel: ".spawn-up", from: { opacity: 0, y: defaults.spawnOffset }, play: (el, delay, dur, ease) => SpawnV(el, delay, defaults.spawnOffset, dur, ease) },
  { sel: ".spawn-left", from: { opacity: 0, x: -defaults.spawnOffset }, play: (el, delay, dur, ease) => SpawnH(el, delay, -defaults.spawnOffset, dur, ease) },
  { sel: ".spawn-right", from: { opacity: 0, x: defaults.spawnOffset }, play: (el, delay, dur, ease) => SpawnH(el, delay, defaults.spawnOffset, dur, ease) },
  { sel: ".spawn-cw", from: { scale: 0, rotation: -360 }, play: (el, delay, dur, ease) => spawnSpinCW(el, delay, dur, ease) },
  { sel: ".spawn-ccw", from: { scale: 0, rotation: 360 }, play: (el, delay, dur, ease) => spawnSpinCCW(el, delay, dur, ease) },
  { sel: ".spawn-fade", from: { opacity: 0 }, play: (el, delay, dur, ease) => spawnFade(el, delay, dur, ease) },
  { sel: ".spawn-blur", from: { opacity: 0, filter: "blur(20px)" }, play: (el, delay, dur, ease) => spawnBlur(el, delay, dur, ease) },
  { sel: ".spawn-x-down", from: { scale: 0, rotationX: -360 }, play: (el, delay, dur, ease) => spawnXDown(el, delay, dur, ease) },
  { sel: ".spawn-x-up", from: { scale: 0, rotationX: 360 }, play: (el, delay, dur, ease) => spawnXUp(el, delay, dur, ease) },
  { sel: ".spawn-y-right", from: { scale: 0, rotationY: -360 }, play: (el, delay, dur, ease) => spawnYRight(el, delay, dur, ease) },
  { sel: ".spawn-y-left", from: { scale: 0, rotationY: 360 }, play: (el, delay, dur, ease) => spawnYLeft(el, delay, dur, ease) },
  { sel: ".expand-vertical", from: { opacity: 0, scaleY: 0 }, play: (el, delay, dur, ease) => expandV(el, delay, dur, ease) },
  { sel: ".expand-horizontal", from: { opacity: 0, scaleX: 0 }, play: (el, delay, dur, ease) => expandH(el, delay, dur, ease) },
  { sel: ".expand-right", from: { opacity: 0, scaleX: 0 }, play: (el, delay, dur, ease) => expandRight(el, delay, dur, ease) },
  { sel: ".expand-left", from: { opacity: 0, scaleX: 0 }, play: (el, delay, dur, ease) => expandLeft(el, delay, dur, ease) },
  { sel: ".expand-up", from: { opacity: 0, scaleY: 0 }, play: (el, delay, dur, ease) => expandUp(el, delay, dur, ease) },
  { sel: ".expand-down", from: { opacity: 0, scaleY: 0 }, play: (el, delay, dur, ease) => expandDown(el, delay, dur, ease) },
  { sel: ".expand-all", from: { opacity: 0, scale: 0 }, play: (el, delay, dur, ease) => expandA(el, delay, dur, ease) },
  { sel: ".typewriter", typewriter: true, from: { text: "" }, play: (el, delay, dur, ease) => typewriter(el, stashText(el), dur, delay, ease) },
  { sel: ".typewriter-split", typewriter: true, typewriterSplit: true, from: { opacity: 0 }, play: (el, delay, dur, ease) => null },

  // Custom-function animation: counts from the `.spawn-num-N` value (N = the
  // starting number) up to whatever number is in the element (falling back to 0
  // when no `.spawn-num-N` class is present). `play` just wraps a helper from
  // Animations.js — nothing else is special, so it still gets
  // order/scroll/leave/appear automatically.
  { sel: ".count", count: true, text: false, from: { opacity: 0 }, play: (el, delay, dur, ease) => countUp(el, delay, dur, ease) },

  // Pure clip-path reveals. `text:false` so the SplitText per-char variant is
  // skipped (these are meant for media/containers). The `from` inset is mirrored
  // in each helper so scroll/scroll-progress/appear/leave all know the hidden state.
  { sel: ".clip-reveal-up", text: false, from: { clipPath: "inset(0% 0% 100% 0%)" }, play: (el, delay, dur, ease) => spawnClipReveal(el, delay, dur, ease, "up") },
  { sel: ".clip-reveal-down", text: false, from: { clipPath: "inset(100% 0% 0% 0%)" }, play: (el, delay, dur, ease) => spawnClipReveal(el, delay, dur, ease, "down") },
  { sel: ".clip-reveal-left", text: false, from: { clipPath: "inset(0% 0% 0% 100%)" }, play: (el, delay, dur, ease) => spawnClipReveal(el, delay, dur, ease, "left") },
  { sel: ".clip-reveal-right", text: false, from: { clipPath: "inset(0% 100% 0% 0%)" }, play: (el, delay, dur, ease) => spawnClipReveal(el, delay, dur, ease, "right") },
  // Backwards-compatible alias for the original class: reveals from the bottom
  // edge upward (same as `.clip-reveal-up`).
  { sel: ".clip-reveal", text: false, from: { clipPath: "inset(0% 0% 100% 0%)" }, play: (el, delay, dur, ease) => spawnClipReveal(el, delay, dur, ease, "up") },
  { sel: ".curtain-horizontal", text: false, from: { clipPath: "inset(0% 50% 0% 50%)" }, play: (el, delay, dur, ease) => curtainHorizontal(el, delay, dur, ease) },
  { sel: ".curtain-vertical", text: false, from: { clipPath: "inset(50% 0% 50% 0%)" }, play: (el, delay, dur, ease) => curtainVertical(el, delay, dur, ease) },

  
  // --- Loops (build + key). Also usable via hover-<name>/click-<name> ---------
  { sel: ".shake", build: (el, { edelay, amount, etime, ease }) => shake(edelay, el, amount, etime, ease), key: "shakeanim" },
  { sel: ".spin-cw", build: (el, { edelay, etime, ease }) => spinCW(el, edelay, etime, ease), key: "spinCW" },
  { sel: ".spin-ccw", build: (el, { edelay, etime, ease }) => spinCCW(el, edelay, etime, ease), key: "spinCW" },
  { sel: ".bounce", build: (el, { edelay, amount, etime, ease }) => bounce(edelay, el, amount, etime, ease), key: "bounce" },
  { sel: ".bell", build: (el, { edelay, amount, etime, ease }) => bell(edelay, el, amount, etime, ease), key: "bell" },
  { sel: ".pulse", build: (el, { edelay, amount, etime, ease }) => pulse(edelay, el, amount, etime, ease), key: "pulse" },
  { sel: ".radiate", build: (el, { edelay, amount, etime, ease, radiateZ }) => radiate(edelay, el, amount, etime, ease, radiateZ), key: "radiate" },
  { sel: ".float", build: (el, { edelay, amount, etime, ease }) => hover(edelay, el, amount, etime, ease), key: "float" },
  { sel: ".marquee-left", build: (el, ctx) => marquee(el, "left", ctx.time, ctx.mH, ctx.mV, el.classList.contains("marquee-no-repeat")), key: "marquee" },
  { sel: ".marquee-right", build: (el, ctx) => marquee(el, "right", ctx.time, ctx.mH, ctx.mV, el.classList.contains("marquee-no-repeat")), key: "marquee" },
  { sel: ".marquee-up", build: (el, ctx) => marquee(el, "up", ctx.time, ctx.mH, ctx.mV, el.classList.contains("marquee-no-repeat")), key: "marquee" },
  { sel: ".marquee-down", build: (el, ctx) => marquee(el, "down", ctx.time, ctx.mH, ctx.mV, el.classList.contains("marquee-no-repeat")), key: "marquee" },
]

// The engine needs a couple of derived views of the config. Rather than
// hardcode two parallel arrays, it normalises once here:
//   spawnConfigs - entries with a `play` (entrance/spawn machinery)
//   loopConfigs  - entries with a `build` (loop machinery)
// `extra` is any user-supplied array merged in (see CustomAnims.js).
export function normalize(extra = []) {
  const all = animations.concat(extra)
  const spawnConfigs = all
    .filter((a) => a.play)
    .map((a) => ({
      sel: a.sel,
      from: a.from,
      play: a.play,
      typewriter: a.typewriter,
      typewriterSplit: a.typewriterSplit,
      text: a.text !== false,
      count: a.count,
    }))
  const loopConfigs = all
    .filter((a) => a.build)
    .map((a) => ({
      sel: a.sel,
      build: a.build,
      key: a.key || a.sel.slice(1),
      loop: a.loop !== false,
    }))
  return { all, spawnConfigs, loopConfigs }
}