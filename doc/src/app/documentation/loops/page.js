import { H1, H2, P, Note, Code, ClassRef } from "@/Shared/DocsUI";
import Replay from "@/Shared/Replay";
import { Demo } from "@/Shared/DocsUI";

export const metadata = { title: "GClass — Loops" };

const BOX = "flex min-h-[80px] min-w-[140px] items-center justify-center rounded-xl bg-slate-800 ring-1 ring-slate-700 text-xs";

export default function Page() {
  return (
    <article>
      <H1>Loops</H1>
      <P>
        Loop classes run an infinite animation from mount — no trigger needed.
        They are also the pool behind <code>.hover-&lt;name&gt;</code> and{" "}
        <code>.click-&lt;name&gt;</code>.
      </P>

      <H2>The loop pool</H2>
      <div className="flex flex-row gap-10">
        <Demo className={BOX + " shake"}>shake</Demo>
        <Demo className={BOX + " bounce"}>bounce</Demo>
        <Demo className={BOX + " bell"}>bell</Demo>
        <Demo className={BOX + " pulse"}>pulse</Demo>
        <Demo className={BOX + " float"}>float</Demo>
      </div>

      <H2>Radiate</H2>
      <P>
        Clones the element into a fixed overlay and expands the clone outward
        like a radar ping. Position is tracked through scroll and resize.
      </P>

        <Demo className={BOX + " radiate amount-20 etime-2"}>radiate</Demo>
   

      <H2>Marquee</H2>
      <P>
        Infinite tickers in four directions. The content is wrapped into a
        tiling track automatically; give the host a width (horizontal) or
        height (vertical).
      </P>
      <div className="my-3 overflow-hidden">
        <div className="marquee-left time-20 gap-8 py-2 text-sm opacity-80">
                  .marquee-left

        </div>
      </div>

      <H2>Tunables</H2>
      <ClassRef
        rows={[
          ["amount-N", "Effect size: px for shake/bounce, scale×10 for pulse/radiate"],
          ["etime-N", "One cycle duration (seconds)"],
          ["edelay-N", "Pause appended after each cycle"],
          ["ease-NAME", "Ease used by the settle segments"],
          ["time-N", "Marquee travel duration only"],
          ["radiate-z-N", "z-index for the radiate clone"],
        ]}
      />
      <Code>{`<div class="float amount-10 etime-3">…</div>
<div class="marquee-up time-30">…</div>`}</Code>
    </article>
  );
}
