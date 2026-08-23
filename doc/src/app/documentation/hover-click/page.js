import { H1, H2, P, Note, Code, ClassRef } from "@/Shared/DocsUI";
import { Demo } from "@/Shared/DocsUI";

export const metadata = { title: "GClass — hover-* / click-*" };

const BOX = "flex min-h-[80px] min-w-[150px] cursor-pointer items-center justify-center rounded-xl bg-slate-800 ring-1 ring-slate-700 text-xs";

export default function Page() {
  return (
    <article>
      <H1>hover-* / click-* — loop triggers</H1>
      <P>
        Prefix any loop name to bind it to the pointer:{" "}
        <code>.hover-shake</code> runs while hovered,{" "}
        <code>.click-bell</code> plays one cycle per press. The engine kills
        and rebuilds the tween on each trigger so nothing queues up.
      </P>

      <H2>Demo</H2>
      <div className="my-4 flex flex-wrap gap-4">
        <Demo className={BOX + " hover-shake"}>hover-shake</Demo>
        <Demo className={BOX + " hover-pulse"}>hover-pulse</Demo>
        <Demo className={BOX + " click-bounce"}>click-bounce</Demo>
        <Demo className={BOX + " click-spin-cw"}>click-spin-cw</Demo>
      </div>

      <H2>Built-in button behaviours</H2>
      <ClassRef
        rows={[
          [".click-hover", "Lifts on hover, dips on press (translateY)"],
          [".click-expand", "Scales up on hover, pops on press"],
          ["ctime-N", "Press/hover tween duration"],
          ["amount-N", "Lift px / expand scale×10"],
        ]}
      />
      <div className="my-4 flex flex-wrap gap-4">
        <Demo className={BOX + " click-hover amount-6"}>click-hover</Demo>
        <Demo className={BOX + " compatibility click-expand amount-13 bounce"}>
          compatibility + click-expand + idle bounce
        </Demo>
      </div>

      <H2>Hit areas & coexistence</H2>
      <P>
        <code>.wrapdiv</code> wraps the element in a stable parent that owns
        pointer events, so animating scale never shifts the hit area under the
        cursor. <code>.compatibility</code> pauses an always-on loop while a
        hover/click interaction is active, resuming it afterwards — both write
        to the same transforms.
      </P>
      <Code>{`<button class="hover-shake wrapdiv">…</button>
<button class="compatibility pulse hover-jump">…</button>`}</Code>
    </article>
  );
}
