import { H1, H2, P, Note, Code, ClassRef, Demo } from "@/Shared/DocsUI";

export const metadata = { title: "GClass - gc-* escape hatch" };

const BOX = "flex min-h-[80px] min-w-[160px] items-center justify-center bg-slate-800 ring-1 ring-slate-700 text-xs";

export default function Page() {
  return (
    <article>
      <H1>.gc-* - the escape hatch</H1>
      <P>
        Every other GClass class picks from a menu of ready-made animations.
        <code>.gc-*</code> is the way out of the menu: you write the GSAP
        properties inline and the engine builds the tween. Use it when nothing
        on the menu does what you need - then keep going with the normal
        modifiers.
      </P>

      <H2>gc-tween-[...]</H2>
      <P>
        The bracket is the <b>starting</b> state. The animation runs{" "}
        <b>from</b> those values <b>to</b> whatever the element already looks
        like, read live from CSS.
      </P>
      <Code>{`<div class="gc-tween-[y:40,opacity:0]">drops in and lands</div>
<div class="gc-tween-[filter:blur(12px)]">unblurs</div>
<div class="gc-tween-[clip-path:inset(0_0_100%_0)]">unmasks</div>`}</Code>
      <div className="my-4 flex flex-wrap gap-4">
        <Demo className={BOX + " gc-tween-[y:40,opacity:0]"}>y + opacity</Demo>
        <Demo className={BOX + " gc-tween-[filter:blur(10px)]"}>blur</Demo>
        <Demo className={BOX + " gc-tween-[scale:0.6] time-1"}>scale</Demo>
      </div>
      <Note>
        The end value is <b>read from the element</b>, not hardcoded into the
        class. That is the whole point: if your theme, dark mode or a media
        query changes what the resting state should be, the animation still
        ends in the right place. A tween that pinned its own end value would go
        stale the moment the theme changed underneath it.
      </Note>

      <H2>Multiple classes merge</H2>
      <P>
        Spread a longer tween over several classes instead of one long line.
        They combine into a single tween:
      </P>
      <Code>{`<div class="gc-tween-[y:40] gc-tween-[opacity:0] gc-tween-[scale:0.9]">`}</Code>

      <H2>gc-tl + numbered steps</H2>
      <P>
        <code>.gc-tl</code> turns the element into a timeline host. Each{" "}
        <code>.gc-&lt;n&gt;-[...]</code> class adds one step; steps run in
        ascending numeric order no matter how the classes are written in the
        attribute, so you can keep the source readable.
      </P>
      <Code>{`<div class="gc-tl gc-1-[y:40] gc-2-[opacity:0] gc-3-[scale:0.8]">
  three steps, in that order
</div>`}</Code>
      <div className="my-4 flex flex-wrap gap-4">
        <Demo className={BOX + " gc-tl gc-1-[scale:0.5] gc-2-[scale:1.15] gc-3-[scale:1] time-0.4"}>3-step scale</Demo>
        <Demo className={BOX + " gc-tl gc-1-[x:-40] gc-2-[x:40] gc-3-[x:0] time-0.5 ease-power1.inOut"}>slide in / out</Demo>
      </div>
      <P>
        Numbered steps imply a timeline on their own - <code>.gc-tl</code> is
        optional, it just makes the intent obvious when you read the markup
        later.
      </P>

      <H2>Overlapping steps with at:</H2>
      <P>
        By default each step waits for the one before it. The{" "}
        <code>at:</code> key takes GSAP&apos;s position syntax so steps can
        overlap or run at an exact moment:
      </P>
      <ClassRef
        rows={[
          ["at:0", "start at time 0 (the default)"],
          ["at:1.5", "start at 1.5 seconds"],
          ['at:">"', "start with the END of the previous step"],
          ['at:"<"', "start with the START of the previous step"],
          ['at:"+=0.2"', "0.2s after the previous step ends"],
          ['at:"-=0.2"', "0.2s before the previous step ends"],
        ]}
      />
      <Code>{`<div class="gc-tl gc-1-[scale:1.3] gc-2-[scale:1,at:\">-=0.2\"]">
  the second step starts while the first is still running
</div>`}</Code>

      <H2>time: and ease: per step</H2>
      <P>
        <code>time:</code> (or <code>dur:</code>) and <code>ease:</code>{" "}
        override the values for one step. Steps without them inherit the
        element&apos;s <code>.time-N</code> and <code>.ease-*</code> classes, so
        you only spell out the exceptions.
      </P>
      <Code>{`<div class="gc-tl time-1 ease-power2.out
            gc-1-[y:40] gc-2-[opacity:0,time:0.4] gc-3-[scale:1.05,ease:back.out(2)]">`}</Code>

      <H2>Modifiers that work with .gc-*</H2>
      <ClassRef
        rows={[
          [".time-N", "duration in seconds"],
          [".ease-NAME", "any GSAP ease, including steps() and cubic-bezier()"],
          [".order / .priority-N", "stagger position, same as any spawn"],
          [".delay-N", "extra delay on top of order/priority"],
          [".reduced", "skip when the user prefers reduced motion"],
          [".preserve", "leave the finished state alone across re-inits"],
          ["m: / l: / xl:", "responsive, via the normal breakpoint prefix"],
          ["on-spawn-complete-FN", "completion hook, same as any spawn"],
          ["hover- / click-", "trigger prefixes, e.g. hover-gc-tween-[scale:1.08]"],
        ]}
      />
      <div className="my-4 flex flex-wrap gap-4">
        <Demo className={BOX + " hover-gc-tween-[scale:1.1]"}>hover-gc-tween</Demo>
        <Demo className={BOX + " click-gc-tween-[scale:0.92]"}>click-gc-tween</Demo>
      </div>

      <H2>Value rules</H2>
      <ClassRef
        rows={[
          ["pairs", "key:value, comma separated: [y:40,opacity:0]"],
          ["underscores", "_ is read as a space: [clip-path:inset(0_0_100%_0)]"],
          ["commas in functions", "rgba(0,0,0,.5) survives - the split is paren-aware"],
          ["units", "bare numbers on x/y/width/top mean px; on rotate/skew, degrees"],
          ["property names", "kebab or camel both fine: clip-path / clipPath"],
          ["GSAP-only keys", "drawSVG, transformOrigin, attr:, css:, stagger, …"],
        ]}
      />

      <H2>Why the gc- prefix exists</H2>
      <P>
        Tailwind reads square brackets as &quot;arbitrary value&quot; syntax and
        will happily generate real CSS out of them. That is fine and intended -
        for Tailwind. It means a bracket group can be captured on its own, so
        some bracket shapes collide with a Tailwind build.
      </P>
      <ClassRef
        rows={[
          ["gc-tween-[y:40]", "safe - emits nothing"],
          ["gc-tween-[y:40]-[y:0]", "LEAK - Tailwind emits .[y:0] { y: 0 }"],
          ["[y:40] on its own", "LEAK - Tailwind emits .[y:40] { y: 40 }"],
          ["from-[#fff]", "LEAK - Tailwind reads it as a gradient stop"],
        ]}
      />
      <Note>
        The rule: <b>one bracket group per class.</b> The parser only accepts a
        single group, so this cannot happen by accident through GClass. For a
        tween that needs to go between two specific values, use two numbered
        steps, or the older{" "}
        <a href="/documentation/css-classes" className="underline">
          css-&lt;prop&gt;-&lt;from&gt;-&lt;to&gt;
        </a>{" "}
        classes.
      </Note>
    </article>
  );
}