import { H1, H2, P, Note, Code, ClassRef } from "@/Shared/DocsUI";
import { Demo } from "@/Shared/DocsUI";

export const metadata = { title: "GClass — .scroll-progress" };

export default function Page() {
  return (
    <article>
      <H1>.scroll-progress — scrubbed entrances</H1>
      <P>
        While <code>.scroll</code> plays a one-shot tween on enter,{" "}
        <code>.scroll-progress</code> scrubs the entrance timeline directly
        with the scrollbar: your scroll position IS the playhead. Combine it
        with a spawn class (that&apos;s where the from/to state comes from).
      </P>
      <Code>{`<div class="expand-horizontal scroll-progress"></div>`}</Code>

      <H2>Demo — scroll slowly past this block</H2>
      <div className="h-[35vh]" />
      <div className="my-4 space-y-[55vh]">
        <div className="h-3 overflow-hidden rounded-full bg-slate-800 ring-1 ring-slate-700">
          <div className="expand-horizontal scroll-progress h-full w-full bg-cyan-300/80" />
        </div>
        <Demo className="spawn-fade scroll-progress flex min-h-[180px] items-center justify-center text-sm">
          I fade in proportionally to your scroll
        </Demo>
      </div>

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
        counts up/down with the scrub instead of fading.
      </Note>
    </article>
  );
}
