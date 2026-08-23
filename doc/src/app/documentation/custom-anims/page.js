import { H1, H2, P, Note, Code } from "@/Shared/DocsUI";
import Replay from "@/Shared/Replay";
import { Demo } from "@/Shared/DocsUI";

export const metadata = { title: "GClass — customAnims" };

export default function Page() {
  return (
    <article>
      <H1>customAnims</H1>
      <P>
        Your own animations plug into the same registry as the built-ins. Push
        an entry with a selector, an optional hidden <code>from</code> state,
        and a <code>play(el, delay, dur, ease)</code> callback returning a GSAP
        tween or timeline.
      </P>
      <Code>{`import { customAnims } from 'gclass-anims'
import gsap from 'gsap'

customAnims.push({
  sel: '.whirl',
  from: { opacity: 0, rotation: 90, scale: 0.7 },
  play: (el, delay, dur, ease) =>
    gsap.fromTo(el,
      { opacity: 0, rotation: 90, scale: 0.7 },
      { rotation: 0, scale: 1, opacity: 1, duration: dur, delay, ease }),
})`}</Code>

      <H2>What you get for free</H2>
      <P>
        Because the entry lives in the same registry, <code>.whirl</code>{" "}
        instantly supports <code>.time-N</code>, <code>.ease-*</code>,{" "}
        <code>.order</code>/<code>.priority-N</code>, <code>.scroll</code>,{" "}
        <code>.appear</code>, <code>.leave</code> reversal and a{" "}
        <code>.spawn-text-whirl</code> variant. Both examples below ship inside
        the package as reference implementations.
      </P>

      <H2>Live demo</H2>
      <Replay>
        <Demo className="appear whirl flex min-h-[80px] min-w-[160px] items-center justify-center rounded-xl bg-slate-800 ring-1 ring-slate-700 text-xs">
          .whirl
        </Demo>
        <Demo className="appear bounce-in flex min-h-[80px] min-w-[160px] items-center justify-center rounded-xl bg-slate-800 ring-1 ring-slate-700 text-xs">
          .bounce-in (timeline)
        </Demo>
      </Replay>

      <Note>
        Provide <code>from</code> if you want leave-reversal and scroll
        reversal to look right — it is the state the engine returns the element
        to. Loop-style entries use a <code>build(el, ctx)</code> callback plus a{" "}
        storage <code>key</code> instead of <code>play</code>.
      </Note>
    </article>
  );
}
