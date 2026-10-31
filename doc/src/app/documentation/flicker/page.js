import { H1, H2, P, Note, Code, ClassRef } from "@/Shared/DocsUI";
import Replay from "@/Shared/Replay";
import { Demo } from "@/Shared/DocsUI";

export const metadata = { title: "GClass - .flicker" };

const BOX = "flex min-h-[90px] min-w-[160px] items-center justify-center bg-slate-800 ring-1 ring-slate-700 text-xs";

export default function Page() {
  return (
    <article>
      <H1>.flicker</H1>
      <P>
        Flashes an element between visible and hidden. It is a{" "}
        <b>modifier</b> when the element already has a spawn class, and a{" "}
        <b>standalone animation</b> when it does not - same class, two modes.
      </P>

      <H2>How the rate follows the ease</H2>
      <P>
        A tween cannot interpolate a frequency, so <code>.flicker</code> tweens
        a <i>phase counter</i> instead and derives the opacity from{" "}
        <code>floor(phase)</code>. Every time the counter crosses an integer the
        element flips. The counter still follows the element&apos;s{" "}
        <code>.ease-*</code>, so the gap between flips changes with the curve:
      </P>
      <ClassRef
        rows={[
          ["ease-none", "Flips evenly spaced - constant rate"],
          ["ease-power2.in", "Long hold, then rapid flapping - accelerating"],
          ["ease-power2.out", "Rapid flapping, then settles - decelerating"],
          ["ease-power2.inOut", "Slow, fast, slow - the rate follows the midpoint"],
          ["ease-elastic.out", "Overshoots the phase counter; the step is clamped monotonic so it cannot re-flash on the way out"],
        ]}
      />

      <H2>Demo - same flash, four eases</H2>
      <P>
        All four boxes below share <code>.flicker time-1.6</code> and differ only
        in the ease. Watch the <i>spacing</i> of the flashes change, not the
        number of them.
      </P>
      <Replay>
        <div className="flex flex-wrap gap-3">
          {["none", "power2.in", "power2.out", "power2.inOut"].map((e) => (
            <Demo key={e} className={`${BOX} appear flicker time-1.6 ease-${e}`}>
              {e}
            </Demo>
          ))}
        </div>
      </Replay>

      <H2>Demo - as a modifier</H2>
      <P>
        With a spawn class the element keeps its entrance motion - here the
        slide and the flash run together, and the flicker owns opacity while the
        spawn owns the transform.
      </P>
      <Replay>
        <div className="flex flex-wrap gap-3">
          <Demo className={`${BOX} appear spawn-up flicker time-1.4 ease-power2.in`}>
            spawn-up + flicker
          </Demo>
          <Demo className={`${BOX} appear expand-all flicker time-1.4 ease-power3.out`}>
            expand-all + flicker
          </Demo>
        </div>
      </Replay>

      <H2>Modifiers</H2>
      <ClassRef
        rows={[
          ["flicker-N", "Flips per SECOND (default defaults.flickerRate = 10). This is a rate, not a total count: time-4 flashes just as fast as time-1 and only lasts longer"],
          ["flicker-min-N", "The \u201coff\u201d opacity x100, 0-100 (default 0 = fully hidden). flicker-min-40 dips to 0.4 instead of black"],
          ["time-N", "How long it flashes. Standalone defaults to 1s"],
          ["delay-N", "Hold the first frame before flashing starts"],
          ["ease-*", "Redistributes the flips inside the window - see the table above"],
        ]}
      />

      <H2>Standalone</H2>
      <Code>{`<div class="flicker time-2 ease-power2.in">flashes in place, then settles</div>
<div class="appear flicker">flashes when it enters / is added</div>

<!-- as a modifier -->
<div class="appear spawn-up flicker time-1.5 ease-power3.in">slides AND flashes</div>
<div class="appear spawn-up flicker-20 flicker-min-30">20 flips/sec, dims to 0.3</div>`}</Code>

      <Note>
        <b>Reduced motion.</b> Flashing is a photosensitivity hazard rather than
        a comfort preference, so <code>.flicker</code> is suppressed entirely
        whenever the OS requests reduced motion - it does <i>not</i> need the
        per-element <code>.reduced</code> opt-in that other animations use. The
        spawn still runs; only the flashing is skipped.
      </Note>

      <Note>
        <b>Ends visible.</b> The flip count is kept even, so the element always
        settles on its resting opacity. Under an overshooting ease (
        <code>back</code>, <code>elastic</code>) the phase counter passes the
        end and comes back; the step is forced monotonic so that overshoot reads
        as a pause instead of a stray re-flash.
      </Note>

      <Note>
        <b>Not supported:</b> <code>.scroll-progress</code> is driven by the
        scrollbar, not by time, so a time-based flicker would race the scrub -
        it is skipped there. With <code>.spawn-text-*</code> the whole element
        flashes as one; per-character flashing is a different feature.
      </Note>
    </article>
  );
}
