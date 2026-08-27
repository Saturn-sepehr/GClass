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

      <Note>
        Text elements are the exception: their scroll triggers are wired at
        init, so a re-inserted <code>.appear</code> text element animates via
        the appear path instead of double-firing a trigger.
      </Note>
    </article>
  );
}
