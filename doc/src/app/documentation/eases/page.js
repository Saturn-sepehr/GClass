import { H1, H2, P, Note, Code, ClassRef } from "@/Shared/DocsUI";
import Replay from "@/Shared/Replay";

export const metadata = { title: "GClass - Eases" };

const BOX = "flex min-h-[80px] min-w-[150px] flex-col items-center justify-center rounded-xl bg-slate-800 ring-1 ring-slate-700 text-xs";
const LABEL = "font-bold text-cyan-200";

export default function Page() {
  return (
    <article>
      <H1>Eases - .ease-NAME</H1>
      <P>
        Every tween the engine builds takes its curve from a single GSAP
        ease string, and <code>.ease-NAME</code> is how you hand it over on any
        element.
      </P>

      <H2>Syntax</H2>
      <P>
        Everything after the first hyphen is forwarded verbatim to GSAP&apos;s{" "}
        <code>ease</code> property - so write ease names with their native dot
        notation:
      </P>
      <Code>{`<div class="appear spawn-up time-1.6 ease-power3.out">…</div>
<div class="appear expand-all time-1 ease-back.out(2)">overshoots, then settles</div>`}</Code>
      <Note>
        <b>No hyphens allowed after <code>ease-</code>.</b>{" "}
        <code>ease-power4-inOut</code> would be read as just{" "}
        <code>power4</code> - use <code>ease-power4.inOut</code>. Dots,
        parentheses and commas are all fine:{" "}
        <code>ease-steps(12)</code>, <code>ease-elastic.out(1,0.4)</code>. If
        several <code>ease-*</code> classes are present, only the first one
        counts.
      </Note>
      <P>
        Omit the class entirely and every element falls back to{" "}
        <code>defaults.ease</code> (<code>&quot;back&quot;</code> - a slight,
        tasteful overshoot).
      </P>

      <H2>The flavor suffix</H2>
      <P>
        Most families come in three flavors: <code>.in</code> starts slow and
        accelerates away, <code>.out</code> launches fast and decelerates to a
        soft landing, and <code>.inOut</code> does both around a midpoint. A
        bare name behaves like <code>.out</code> - which is why the default{" "}
        <code>ease-back</code> overshoots on arrival rather than on departure.
      </P>
      <P>
        Same animation, four flavors - watch how each box spends its two
        seconds:
      </P>
      <Replay>
        {[["none"], ["power2.in"], ["power2.out"], ["power2.inOut"]].map(([e]) => (
          <div key={e} className={`${BOX} appear expand-all time-2 ease-${e}`}>
            <span className={LABEL}>{e}</span>
          </div>
        ))}
      </Replay>

      <H2>Character eases</H2>
      <P>
        Some families don&apos;t just interpolate - they perform.{" "}
        <code>back</code> overshoots past the target and swings back,{" "}
        <code>elastic</code> oscillates like a spring, <code>bounce</code>{" "}
        lands like a dropped ball, and <code>steps()</code> jumps between
        discrete values instead of gliding:
      </P>
      <Replay>
        {[
          ["back.out(1.7)"],
          ["elastic.out(1,0.4)"],
          ["bounce.out"],
          ["steps(9)"],
        ].map(([e]) => (
          <div key={e} className={`${BOX} appear expand-all time-2 ease-${e}`}>
            <span className={LABEL}>{e}</span>
          </div>
        ))}
      </Replay>

      <H2>Built-in families</H2>
      <ClassRef
        rows={[
          ["none", "Constant velocity - no acceleration at all"],
          ["power0 … power4", "Five steepness grades: linear, quad, cubic, quart, quint"],
          ["sine", "Gentle sinusoidal curve - soft, natural drift"],
          ["expo", "Exponential - explosive start or dramatic deceleration"],
          ["circ", "Circular - lazy start that snaps hard at the end (.in)"],
          ["back", "Overshoots past the target before settling back"],
          ["elastic", "Springy overshoot that wobbles around the end value"],
          ["bounce", "Bounces into its final position like gravity took over"],
          ["steps(N)", "N discrete jumps per second-equivalent - no interpolation"],
          ["slow / slow.mo", "Cinematic slow-in/slow-out; .mo stretches it further"],
        ]}
      />
      <P>
        Every family (except <code>none</code> and <code>steps</code>) combines
        with the <code>.in</code> / <code>.out</code> / <code>.inOut</code>{" "}
        suffix, and parameterized forms accept parentheses:{" "}
        <code>ease-back.inOut(3)</code>.
      </P>

      <H2>Where it applies</H2>
      <P>
        The engine reads one ease per element and feeds it to everything wired
        to it:
      </P>
      <ul className="my-3 list-inside list-disc space-y-1 text-sm leading-relaxed opacity-80">
        <li className="order typewriter-split letter spawn-left">All entrance tweens - spawns, expands, clip reveals, curtains</li>
        <li className="order typewriter-split letter spawn-left"><code>.scroll</code> entrances and scrubbed <code>.scroll-progress</code></li>
        <li className="order typewriter-split letter spawn-left"><code>.spawn-text-*</code> SplitText parts (each part shares the ease)</li>
        <li className="order typewriter-split letter spawn-left">Loop settle segments - <code>.shake</code>, <code>.bounce</code>, <code>.bell</code>, <code>.pulse</code></li>
        <li className="order typewriter-split letter spawn-left"><code>hover-</code>/<code>click-</code> interactions and their mouseleave reset</li>
        <li className="order typewriter-split letter spawn-left"><code>.magnet</code> / <code>.magnet3d</code> cursor tracking</li>
        <li className="order typewriter-split letter spawn-left"><code>css-*</code> arbitrary-property tweens and <code>.flip</code> morphs</li>
      </ul>
      <Note>
        Two deliberate exceptions: <b>typewriters</b> default to{" "}
        <code>ease-none</code> (constant typing rate looks right - add an
        explicit <code>ease-*</code> to change it), and <b>marquees</b> always
        run linear because easing would stutter at the loop seam. Loop classes
        also keep their hand-tuned impact curves internally; your ease drives
        the final settle.
      </Note>

      <H2>Changing the global default</H2>
      <Code>{`import { defaults } from 'gclass-anims'

defaults.ease = 'power3.out'   // set BEFORE initAnimations()`}</Code>

      <H2>Full catalogue</H2>
      <P>
        Since <code>.ease-NAME</code> forwards straight into GSAP, everything in
        the official reference works here - including plugin-based custom
        curves like <code>CustomEase</code> and <code>CustomBounce</code> once
        registered:
      </P>
      <P>
        <a
          href="https://gsap.com/docs/v3/Eases/"
          target="_blank"
          rel="noreferrer"
          className="font-extrabold underline text-green-500"
        >
          GSAP Eases documentation →
        </a>
      </P>
    </article>
  );
}
