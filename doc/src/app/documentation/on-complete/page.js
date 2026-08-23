import { H1, H2, P, Note, Code, ClassRef } from "@/Shared/DocsUI";
import CompleteDemo from "@/Shared/CompleteDemo";

export const metadata = { title: "GClass — on-*-complete-*" };

export default function Page() {
  return (
    <article>
      <H1>on-*-complete-*</H1>
      <P>
        Attach behaviour to the moment an animation finishes. The class names a
        handler registered via <code>registerComplete</code> (or a{" "}
        <code>window</code> function), optionally pointing at another
        animation instead.
      </P>

      <H2>Syntax</H2>
      <ClassRef
        rows={[
          ["on-spawn-complete-<fn>", "fn(el) when a spawn finishes"],
          ["on-loop-complete-<fn>", "each cycle of a loop / its completion"],
          ["on-click-complete-<fn>", "when a click animation finishes"],
          ["…complete-anim-<name>", "plays animation `<name>` once instead of calling fn"],
          ["complete-time-N", "duration override for the triggered anim"],
          ["complete-delay-N", "delay override for the triggered anim"],
        ]}
      />
      <Code>{`<div class="appear spawn-fade time-1 on-spawn-complete-docsPing">…</div>
<div class="appear spawn-up on-spawn-complete-anim-shake complete-time-1">…</div>`}</Code>

      <H2>Live demo</H2>
      <P className="text-sm">
        Both boxes register their completion through the shared{" "}
        <code>docsPing</code> handler. Re-mount them and watch the stamps.
      </P>
      <div className="my-4 rounded-xl border border-slate-700 bg-slate-800/30 p-5">
        <CompleteDemo />
      </div>

      <Note>
        Infinite loops can never &quot;complete&quot;, so loop handlers fire on{" "}
        <code>onRepeat</code> — every cycle — while finite animations use their
        real <code>onComplete</code>.
      </Note>
    </article>
  );
}
