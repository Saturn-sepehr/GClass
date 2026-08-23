import { H1, H2, P, Note, Code } from "@/Shared/DocsUI";
import { Demo } from "@/Shared/DocsUI";

export const metadata = { title: "GClass — .scroll" };

export default function Page() {
  return (
    <article>
      <H1>.scroll — play on scroll enter</H1>
      <P>
        Adding <code>.scroll</code> to any spawn hands control to a
        ScrollTrigger: the entrance plays when the element enters the viewport,
        and reverses back to its hidden state when it leaves — so scrolling
        back replays it every time.
      </P>
      <Code>{`<div class="scroll spawn-up time-1">enters → slides up</div>

<!-- scroll + appear on the same non-text element is redundant:
     .scroll owns the element completely -->
<div class="appear scroll spawn-fade">appear is ignored here</div>`}</Code>

      <H2>Demo — scroll down and back up</H2>
      <div className="my-4 space-y-[38vh]">
        {[1, 2, 3, 4].map((i) => (
          <Demo key={i} className="scroll spawn-left time-1 flex min-h-[140px] items-center justify-center py-10">
            box {i} — scroll-triggered spawn-left
          </Demo>
        ))}
      </div>

      <Note>
        Text elements are the exception: their scroll triggers are wired at
        init, so a re-inserted <code>.appear</code> text element animates via
        the appear path instead of double-firing a trigger.
      </Note>
    </article>
  );
}
