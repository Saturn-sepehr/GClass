import { H1, H2, P, Note, Code, ClassRef } from "@/Shared/DocsUI";
import Replay from "@/Shared/Replay";
import { Demo } from "@/Shared/DocsUI";

export const metadata = { title: "GClass - Loops" };

const BOX = "flex min-h-[80px] min-w-[140px] items-center justify-center rounded-xl bg-slate-800 ring-1 ring-slate-700 text-xs";

export default function Page() {
  return (
    <article>
      <H1>Loops</H1>
      <P>
        Loop classes run an infinite animation from mount - no trigger needed.
        They are also the pool behind <code>.hover-&lt;name&gt;</code> and{" "}
        <code>.click-&lt;name&gt;</code>.
      </P>

      <H2>The loop pool</H2>
      <div className="flex flex-row flex-wrap gap-4">
        <Demo className={BOX + " shake"}>shake</Demo>
        <Demo className={BOX + " bounce"}>bounce</Demo>
        <Demo className={BOX + " bell"}>bell</Demo>
        <Demo className={BOX + " pulse"}>pulse</Demo>
        <Demo className={BOX + " float"}>float</Demo>
        <Demo className={BOX + " spin-cw"}>spin-cw</Demo>
        <Demo className={BOX + " spin-ccw"}>spin-ccw</Demo>
      </div>

      <H2>Radiate</H2>
      <P>
        Clones the element into a fixed overlay and expands the clone outward
        like a radar ping. Position is tracked through scroll and resize.
      </P>

        <Demo className={BOX + " radiate amount-20 etime-2"}>radiate</Demo>
   

      <H2>Tunables</H2>
      <ClassRef
        rows={[
          ["amount-N", "Effect size: px for shake/bounce, scale×10 for pulse/radiate"],
          ["etime-N", "One cycle duration (seconds)"],
          ["edelay-N", "Pause appended after each cycle"],
          ["ease-NAME", "Ease used by the settle segments"],
          ["radiate-z-N", "z-index for the radiate clone"],
        ]}
      />
      <Code>{`<div class="float amount-10 etime-3">…</div>
<div class="pulse etime-2 amount-5">…</div>`}</Code>
    </article>
  );
}
