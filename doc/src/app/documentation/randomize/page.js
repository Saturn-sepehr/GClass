import { H1, H2, P, Note, Code, ClassRef } from "@/Shared/DocsUI";
import Replay from "@/Shared/Replay";
import { Demo } from "@/Shared/DocsUI";

export const metadata = { title: "GClass - .randomize" };

const BOX = "flex min-h-[90px] min-w-[160px] items-center justify-center rounded-xl bg-slate-800 ring-1 ring-slate-700 text-xs";

export default function Page() {
  return (
    <article>
      <H1>.randomize-{"<prop>"}-[min]-[max]</H1>
      <P>
        Adds function-based jitter to the <i>hidden</i> state of any spawn: each element rolls its own start pose. Because the engine kills and rebuilds the spawn tween on every replay (<code>.scroll</code> re-enter, <code>.appear</code> re-mount), every replay re-rolls automatically.
      </P>

      <H2>Demo - same spawn, different roll every Replay</H2>
      <P>Press Replay - the three cards below share <code>.spawn-up</code> but each has a different <code>.randomize-rotation-[-30]-[30]</code> and <code>.randomize-x-[-40]-[40]</code> roll, so their entry pose is never identical.</P>
      <Replay>
        <div className="flex gap-3">
          <Demo className={BOX + " appear spawn-up randomize-rotation-[-30]-[30] randomize-x-[-40]-[40]"}>roll A</Demo>
          <Demo className={BOX + " appear spawn-up randomize-rotation-[-30]-[30] randomize-x-[-40]-[40]"}>roll B</Demo>
          <Demo className={BOX + " appear spawn-up randomize-rotation-[-30]-[30] randomize-x-[-40]-[40]"}>roll C</Demo>
        </div>
      </Replay>

      <H2>Demo - overrides base spawn value</H2>
      <P><code>.randomize-rotation</code> on <code>.spawn-cw</code> replaces the spin - the rolled value is the start, and the engine derives a resting end (<code>scale*→1</code>, <code>opacity→1</code>, transforms→<code>0</code>, <code>filter→blur(0px)</code>, <code>clipPath→inset(0%…)</code>) unless the spawn already animates that prop.</P>
      <Replay>
        <Demo className={BOX + " appear spawn-cw randomize-rotation-[-90]-[90] randomize-scale-[0.7]-[1.3]"}>cw + random scale/rot</Demo>
      </Replay>

      <H2>ClassRef</H2>
      <ClassRef
        rows={[
          ["randomize-<prop>-[min]-[max]", "Function value for prop: e.g. randomize-rotation-[-90]-[90], randomize-x-[-40]-[40], randomize-scale-[0.8]-[1.2]"],
          ["notes", "Only the hidden start is randomized (scrub end stays deterministic); timeline builders (count/scramble/draw-split) are not patched - irrelevant as their props aren't randomize targets"],
        ]}
      />
      <Code>{`<div class="appear spawn-up randomize-rotation-[-25]-[25] randomize-y-[-20]-[20] time-1">…</div>
<div class="appear spawn-blur randomize-filter-[blur(10px)]-[blur(30px)]">…</div>`}</Code>

      <Note>
        Has no effect without a spawn class - it is a modifier that injects into the spawn&apos;s <code>from</code> via a scoped <code>gsap.fromTo</code> patch (<code>Listeners.js:81 invokePlay</code>). Combine with <code>.scroll</code> or <code>.appear</code> as usual.
      </Note>
    </article>
  );
}
