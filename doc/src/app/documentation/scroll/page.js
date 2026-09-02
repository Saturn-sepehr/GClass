import { H1, H2, P, Note, Code } from "@/Shared/DocsUI";
import { Demo } from "@/Shared/DocsUI";

export const metadata = { title: "GClass - .scroll" };

export default function Page() {
  return (
    <article>
      <H1>.scroll - play on scroll enter</H1>
      <P>
        Adding <code>.scroll</code> to any spawn hands control to a
        ScrollTrigger: the entrance plays when the element enters the viewport,
        and reverses back to its hidden state when it leaves - so scrolling
        back replays it every time.
      </P>
      <Code>{`<div class="scroll spawn-up time-1">enters → slides up</div>

<!-- scroll + appear on the same non-text element is redundant:
     .scroll owns the element completely -->
<div class="appear scroll spawn-fade">appear is ignored here</div>`}</Code>

      <H2>Demo - scroll down, then back up</H2>
      <P>
        Every box below carries <code>.scroll</code> with a different spawn.
        Each one slides in as it crosses the bottom edge and rewinds when you
        scroll it back out - try both directions.
      </P>
      <div className="my-4 space-y-[35vh]">
        <Demo className="scroll spawn-up time-1 mr-auto flex min-h-[130px] w-full max-w-md items-center justify-center py-10">
          .scroll .spawn-up
        </Demo>
        <Demo className="scroll spawn-right time-1 ml-auto flex min-h-[130px] w-full max-w-md items-center justify-center py-10">
          .scroll .spawn-right
        </Demo>
        <Demo className="scroll spawn-blur time-1 mr-auto flex min-h-[130px] w-full max-w-md items-center justify-center py-10">
          .scroll .spawn-blur
        </Demo>
        <Demo className="scroll spawn-x-up time-1 ml-auto flex min-h-[130px] w-full max-w-md items-center justify-center py-10">
          .scroll .spawn-x-up - 360° flip
        </Demo>
      </div>

      <H2>Demo - triggers fire independently</H2>
      <P>
        Side-by-side elements get their own trigger each: they enter at
        different scroll offsets even though they sit on the same row.
      </P>
      <div className="my-4 mb-[35vh] flex flex-wrap gap-4">
        <Demo className="scroll spawn-left time-1 flex min-h-[120px] min-w-[180px] flex-1 items-center justify-center py-10">
          enters first
        </Demo>
        <Demo className="scroll spawn-left time-1 mt-16 flex min-h-[120px] min-w-[180px] flex-1 items-center justify-center py-10">
          enters later
        </Demo>
      </div>

      <H2>Demo - .scroll-fade-bg - background scrubs</H2>
      <P>
        <code>.scroll-fade-bg</code> lerps <code>background-position</code> from <code>0% 0%</code> → <code>100% 100%</code> while the element traverses the viewport (<code>scrub: true</code>). Give it a background larger than the box to see the drift.
      </P>
      <div className="scroll-fade-bg flex min-h-[180px] items-center justify-center rounded-xl border border-slate-700" style={{ backgroundImage: "radial-gradient(circle at 0% 0%, rgba(34,211,238,0.5), transparent 55%), linear-gradient(135deg, #0f172a, #1e293b)", backgroundSize: "200% 200%" }}>
        .scroll-fade-bg - scroll this into view
      </div>
      <Code>{`<div class="scroll-fade-bg" style="background: radial-gradient(circle, cyan, transparent) 0% 0% / 200% 200%">…</div>`}</Code>

      <H2>Demo - .scroll-horizontal - pinned pan</H2>
      <P>
        <code>.scroll-horizontal</code> pins its section and pans the inner <code>.scroll-track</code> left as you scroll. The track must be wider than the viewport - <code>pin: true</code> + <code>scrub: 1</code> does the rest (<code>Listeners.js:851</code>).
      </P>
      <div className="scroll-horizontal my-6 h-[60vh] overflow-hidden rounded-xl border border-slate-700 bg-slate-900">
        <div className="scroll-track flex h-full items-center gap-4 p-6" style={{ width: "200%" }}>
          <Demo className="min-w-[45%] flex h-4/5 items-center justify-center bg-slate-800">panel 1 - scroll to pan →</Demo>
          <Demo className="min-w-[45%] flex h-4/5 items-center justify-center bg-cyan-900/40">panel 2 - pinned while scrubbing</Demo>
          <Demo className="min-w-[45%] flex h-4/5 items-center justify-center bg-slate-800">panel 3 - end of track</Demo>
        </div>
      </div>
      <Code>{`<section class="scroll-horizontal" style="height:60vh; overflow:hidden">
  <div class="scroll-track" style="display:flex; width:200%">
    <div>panel 1</div><div>panel 2</div><div>panel 3</div>
  </div>
</section>`}</Code>

      <Note>
        Text elements are the exception: their scroll triggers are wired at
        init, so a re-inserted <code>.appear</code> text element animates via
        the appear path instead of double-firing a trigger.
      </Note>
    </article>
  );
}
