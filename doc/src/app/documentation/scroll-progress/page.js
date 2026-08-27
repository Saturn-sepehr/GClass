import { H1, H2, P, Note, Code, ClassRef } from "@/Shared/DocsUI";
import { Demo } from "@/Shared/DocsUI";

export const metadata = { title: "GClass - .scroll-progress" };

export default function Page() {
  return (
    <article>
      <H1>.scroll-progress - scrubbed entrances</H1>
      <P>
        While <code>.scroll</code> plays a one-shot tween on enter,{" "}
        <code>.scroll-progress</code> scrubs the entrance timeline directly
        with the scrollbar: your scroll position IS the playhead. Combine it
        with a spawn class (that&apos;s where the from/to state comes from).
      </P>
      <Code>{`<div class="expand-horizontal scroll-progress"></div>`}</Code>

      <H2>Demo - scroll slowly past these blocks</H2>
      <div className="h-[30vh]" />
      <div className="my-4 space-y-[55vh]">
        <div>
          <p className="mb-2 text-xs opacity-60">
            .expand-horizontal .scroll-progress - width follows the scrollbar
          </p>
          <div className="h-3 overflow-hidden rounded-full bg-slate-800 ring-1 ring-slate-700">
            <div className="expand-horizontal progress-start-20 progress-end-80 scroll-progress h-full w-full rounded-full bg-cyan-300/80" />
          </div>
        </div>
        <Demo className="spawn-fade scroll-progress progress-start-20 ease- progress-end-80 ease-none flex min-h-[180px] items-center justify-center text-sm">
          I fade in proportionally to your scroll
        </Demo>
        <Demo className="spawn-up scroll-progress flex min-h-[180px] flex-col items-start justify-center gap-3 p-6 text-sm">
          <span className="text-lg font-bold">Any spawn works here</span>
          <span className="opacity-70">
            .spawn-up .scroll-progress - position AND opacity track the
            playhead, so scrolling back up rewinds me mid-motion
          </span>
        </Demo>
      </div>

      <H2>Demo - scrubbed counter</H2>
      <P>
        Counters compose with the scrub too: the number below IS the scroll
        progress, tracking your scrollbar exactly in both directions.
      </P>
      <div className="h-[35vh]" />
      <Demo className="flex min-h-[160px] items-center justify-center gap-2 py-10 text-center">
        <span className="count scroll-progress spawn-num-0 text-6xl font-extrabold text-cyan-200">
          100
        </span>
        <span className="text-2xl opacity-70">%</span>
      </Demo>
      <div className="h-[35vh]" />

      <H2>Tunables</H2>
      <ClassRef
        rows={[
          ["progress-start-N", "Scrub starts when top hits (100−N)% of viewport"],
          ["progress-end-N", "Scrub ends at (100−N)% instead of center-center"],
          [".progress-reverse", "Inverts the mapping: revealed → hidden as you scroll"],
        ]}
      />
      <Note>
        Counters have first-class support:{" "}
        <code>&lt;span class=&quot;count scroll-progress spawn-num-0&quot;&gt;100&lt;/span&gt;</code>{" "}
        counts up/down with the scrub instead of fading - see{" "}
        <b>Counters</b> for the full behavior.
      </Note>
    </article>
  );
}
