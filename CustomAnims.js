import gsap from "gsap";

// A custom animation is just an entry with the SAME shape as one in
// Listeners.js' `spawnConfigs`. Give it:
//
//   sel  - the className you'll put on elements (e.g. ".whirl")
//   from - the hidden starting state (opacity/scale/x/y/filter/...). This is
//          required if you want `.leave` reverse + `.scroll` / `scroll-progress`
//          to work automatically. Skip it for a one-shot timeline.
//   play - (el, delay, dur, ease) => a GSAP tween OR timeline to run.
//
// Because Listeners.js reuses its existing machinery, anything you add here
// gets the full feature set (scroll, leave, order, delays, ease-*, time-*, ...)
// with zero extra code.

export const customAnims = [
  // --------------------------------------------------------------------------
  // 1. A simple custom tween. `from` + `computeTo` give you leave/scroll reverse.
  //    Works just like `.spawn-up` but with a custom transform.
  // --------------------------------------------------------------------------
  {
    sel: ".whirl",
    from: { opacity: 0, rotation: 90, scale: 0.7 },
    play: (el, delay, dur, ease) =>
      gsap.fromTo(
        el,
        { opacity: 0, rotation: 90, scale: 0.7 },
        { ease, duration: dur, delay, rotation: 0, scale: 1, opacity: 1, transformOrigin: "center" }
      ),
  },

  // --------------------------------------------------------------------------
  // 2. A timeline-based custom animation. Build a gsap.timeline and return it.
  //    Add a `from` too if you want leave/scroll reversal to look right.
  // --------------------------------------------------------------------------
  {
    sel: ".bounce-in",
    from: { opacity: 0, scale: 0 },
    play: (el, delay, dur, ease) => {
      const tl = gsap.timeline({
        delay,
        defaults: { ease, duration: dur / 3 },
      });
      tl.fromTo(el, { scale: 0, opacity: 0 }, { scale: 1.1, opacity: 1 })
        .to(el, { scale: 0.95 })
        .to(el, { scale: 1 });
      return tl;
    },
  },
];

// Example: how one would expose a manual helper (no listener integration,
// call it directly from your own code).
export function Example(target, customVars) {
  return gsap.to(target, customVars);
}