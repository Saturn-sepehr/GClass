import { H1, H2, P, Note, Code, ClassRef } from "@/Shared/DocsUI";
import Replay from "@/Shared/Replay";
import { Demo, EntranceDemo } from "@/Shared/DocsUI";

export const metadata = { title: "GClass - Responsive" };

export default function Page() {
  return (
    <article>
      <H1>Responsive - breakpoints</H1>
      <P>
        Every animation and every modifier can be gated by viewport width. Breakpoints are min-width, mobile-first, and use single letters <code>xs/s/m/l/xl</code> so they never collide with Tailwind&apos;s <code>sm/md/lg</code> or Bootstrap&apos;s dash syntax.
      </P>

      <ClassRef
        rows={[
          ["xs", "475px - phones (custom, not in Tailwind)"],
          ["s", "640px - Tailwind sm"],
          ["m", "768px - Tailwind md"],
          ["l", "1024px - Tailwind lg"],
          ["xl", "1280px - Tailwind xl"],
        ]}
      />
      <Note>
        Config lives in <code>Config.js:75</code> <code>defaults.breakpoints {'{'}xs:475,s:640,m:768,l:1024,xl:1280{'}'}</code>. Override before <code>initAnimations()</code>: <code>defaults.breakpoints.l = 992</code> to match Bootstrap.
      </Note>

      <H2>Syntax - gating animations</H2>
      <P>
        Prefix any animation with <code>bp:</code>. No animation if the breakpoint is inactive.
      </P>
      <Code>{`<div class="spawn-up"> always - no prefix </div>
<div class="m:spawn-up"> from 768 up - inert below m </div>
<div class="l:float"> from 1024 up </div>
<div class="s:spawn-text-spawn-up"> SplitText variant also gates - s:spawn-text-spawn-up </div>
<div class="m:pin"> pin only on tablet+ </div>`}</Code>
      <Replay>
        <EntranceDemo cls="appear spawn-up"><div className="flex h-20 w-32 items-center justify-center rounded bg-indigo-600 text-xs">spawn-up</div></EntranceDemo>
        <div className="flex flex-col gap-1 text-xs opacity-60"><span>resize to &lt;768 - m:spawn-up stays static</span><span>resize to &gt;=768 - spawns via gsap.matchMedia</span></div>
      </Replay>
      <Note>
        Gating is <b>live</b> - <code>Listeners.js:26,202</code> registers <code>gsap.matchMedia("(min-width: 768px)")</code> via <code>runWithBreakpointForSel</code>. Resizing across the threshold auto creates/kills the tween and its <code>ScrollTrigger</code> without re-calling <code>initAnimations()</code>.
      </Note>

      <H2>Syntax - breakpoint modifiers</H2>
      <P>
        Any numeric or string modifier also accepts <code>bp:</code>. Largest active wins (mobile-first).
      </P>
      <Code>{`<!-- time: base 1s, 3s from m, 0.5s from l -->
<div class="appear spawn-up time-1 m:time-3 l:time-0.5">…</div>

<!-- amount: 10 base, 40 from m -->
<div class="shake amount-10 m:amount-40">…</div>

<!-- ease and priority also -->
<div class="spawn-up ease-power2.out m:ease-bounce.out">…</div>
<div class="spawn-up order priority-1 m:priority-5">…</div>

<!-- other modifiers work the same -->
<div class="scramble m:amount-9 m:reveal-delay-0.3 m:chars-[XYZ]">…</div>
<div class="count m:spawn-num-10">…</div>
<div class="draw m:fill-time-0.8">…</div>
<div class="parallax-0.5 m:parallax-0.8">…</div>`}</Code>
      <P>
        Resolution order at width 1100 with <code>class="amount-10 s:amount-30 m:amount-50 l:amount-80"</code> → <code>80</code> (l wins). At 500 → <code>10</code> (no bp active, fallback to base). At 700 → <code>30</code> (s). If only <code>m:time-2</code> exists and width is 500, it falls back to default <code>time-1</code>.
      </P>
      <Note>
        Modifiers are read at <b>wiring time</b> (<code>Listeners.js:237</code> <code>getActivePrefixedClass</code>, <code>Animations.js:13</code> lazy helpers). Gating is live, but a <b>modifier value change</b> (e.g. <code>time-1 → m:time-3</code>) needs a re-wire to rebuild the tween with the new duration. The visual harness in <code>dev-react-strict</code> does this with a key remount; in production either re-call <code>initAnimations()</code> on resize (debounced) or use separate elements per breakpoint.
      </Note>

      <H2>Combining gating + modifiers</H2>
      <Code>{`<!-- anim only from m, and when it does, its modifiers also switch at l -->
<div class="m:spawn-up time-1 m:time-2 l:time-0.4 m:amount-20 l:amount-50">…</div>

<!-- different anims per breakpoint: small screens fade, large screens slide -->
<div class="spawn-fade m:spawn-up l:spawn-right">…</div> <!-- not recommended - pick one anim + bp modifiers instead -->

<!-- loop amount that grows with viewport -->
<div class="float amount-10 s:amount-30 m:amount-60 l:amount-100">…</div>`}</Code>

      <H2>Tailwind / Bootstrap coexistence</H2>
      <P>
        GClass uses <code>s/m/l</code> not <code>sm/md/lg</code>, so <code>m:spawn-up</code> never matches Tailwind&apos;s <code>md:spawn-up</code> (which Tailwind would ignore anyway as unknown). Layout and animation can share the same element:
      </P>
      <Code>{`<div class="grid grid-cols-1 s:grid-cols-2 m:spawn-up time-1 m:time-2 p-4">
  Tailwind: 1 col → 2 cols at s (640)
  GClass: spawn-up base, duration 2s from m (768)
</div>`}</Code>
      <Note>
        Tailwind ignores unknown <code>s:spawn-up</code> and GClass ignores <code>s:grid-cols-2</code>. No <code>@custom-variant</code> or <code>safelist</code> needed. Bootstrap&apos;s <code>col-md-*</code> dash syntax also never collides.
      </Note>

      <H2>Config</H2>
      <Code>{`import { defaults } from 'gclass-anims'

// match your Tailwind config or Bootstrap
defaults.breakpoints = { xs: 475, s: 640, m: 768, l: 1024, xl: 1280 }
// or
defaults.breakpoints.l = 992 // only change l

import { initAnimations } from 'gclass-anims'
initAnimations() // reads breakpoints at init`}</Code>

      <H2>Edge cases</H2>
      <ClassRef
        rows={[
          ["Only bp variant, no base - m:spawn-up", "Inert below m, no fallback. Add a base if you want a default."],
          ["No xp: prefix", "Always runs - same as before."],
          ["Unknown bp - xl2:spawn-up", "Ignored (not in defaults.breakpoints)."],
          ["Multiple same modifier - amount-10 m:amount-20 m:amount-30", "Last largest active wins (mobile-first)."],
        ]}
      />
    </article>
  );
}