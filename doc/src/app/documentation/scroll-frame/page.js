import { H1, H2, P, Note, Code } from "@/Shared/DocsUI";
import { Demo } from "@/Shared/DocsUI";

export const metadata = { title: "GClass — .scroll-frame" };

export default function Page() {
  return (
    <article>
      <H1>.scroll-frame — scoped scroll container</H1>
      <P>
        <code>.scroll</code> and <code>.scroll-progress</code> normally track
        the window. Wrap a scrollable box with <code>.scroll-frame</code> and
        any trigger inside it binds to <b>that box</b> instead — so the
        entrance or scrub is driven by the container&apos;s scrollbar, not the
        page. The innermost <code>.scroll-frame</code> ancestor wins (
        <code>closest</code> walk); elements with no frame ancestor keep the
        default window scroller.
      </P>
      <Code>{`<div class="scroll-frame h-64 overflow-y-auto">
  <div class="spawn-up scroll">slides in when scrolled inside the box</div>
  <div class="spawn-fade scroll-progress">scrubbed by the box scrollbar</div>
</div>

<!-- Requirements: .scroll-frame must be a real scroller — fixed height + overflow-auto/scroll — or its triggers never fire -->`}</Code>

      <H2>Demo — .scroll contained to the box</H2>
      <P>
        The box below is a 280px tall <code>.scroll-frame</code> with its own
        scrollbar. Scroll <b>inside it</b> — the cards slide in and rewind per
        card, completely independent of the page scroll.
      </P>
      <div className="scroll-frame my-4 h-[280px] overflow-y-auto rounded-xl bg-slate-950/50 p-4 ring-1 ring-slate-700">
        <div className="space-y-6 py-2">
          <Demo className="scroll spawn-up time-1 flex min-h-[90px] items-center justify-center">
            .scroll .spawn-up
          </Demo>
          <Demo className="scroll spawn-right time-1 flex min-h-[90px] items-center justify-center">
            .scroll .spawn-right
          </Demo>
          <Demo className="scroll spawn-blur time-1 flex min-h-[90px] items-center justify-center">
            .scroll .spawn-blur
          </Demo>
          <Demo className="scroll spawn-fade time-1 flex min-h-[90px] items-center justify-center">
            .scroll .spawn-fade
          </Demo>
          <div className="py-2 text-center text-xs opacity-40">— end of frame —</div>
        </div>
      </div>
      <P className="text-xs opacity-60">
        Try scrolling the page itself: these four cards ignore window scroll
        entirely.
      </P>

      <H2>Demo — .scroll-progress scrubbed by the box</H2>
      <P>
        Same container, scrubbed mode: your scroll position <b>inside the
        frame</b> is the playhead. The bar and fades below are tied to the box
        scrollbar — scroll the frame up and down to scrub in both directions.
      </P>
      <div className="scroll-frame my-4 h-[320px] overflow-y-auto rounded-xl bg-slate-950/50 p-4 ring-1 ring-slate-700">
        <div className="space-y-[28vh] py-2">
          <div>
            <p className="mb-2 text-xs opacity-60">
              .expand-horizontal .scroll-progress — width follows the frame
            </p>
            <div className="h-3 overflow-hidden rounded-full bg-slate-800 ring-1 ring-slate-700">
              <div className="expand-horizontal scroll-progress progress-start-20 progress-end-80 h-full w-full rounded-full bg-cyan-300/80" />
            </div>
          </div>
          <Demo className="spawn-fade scroll-progress progress-start-20 progress-end-80 flex min-h-[140px] items-center justify-center text-sm">
            fades with the frame scrollbar
          </Demo>
          <Demo className="spawn-up scroll-progress progress-start-20 progress-end-80 flex min-h-[140px] items-center justify-center text-sm">
            slides with the frame scrollbar
          </Demo>
          <Demo className="flex min-h-[140px] items-center justify-center gap-2 py-8 text-center">
            <span className="count scroll-progress progress-start-20 progress-end-80 spawn-num-0 text-5xl font-extrabold text-cyan-200">
              100
            </span>
            <span className="text-xl opacity-70">%</span>
          </Demo>
          <div className="py-2 text-center text-xs opacity-40">— end of frame —</div>
        </div>
      </div>

      <H2>Demo — nested frames</H2>
      <P>
        When frames are nested, <code>closest(&quot;.scroll-frame&quot;)</code>{" "}
        wins: the inner box drives its own children, the outer box drives
        everything else. No frame ancestor falls back to the window.
      </P>
      <Code>{`<div class="scroll-frame outer h-80 overflow-y-auto">
  <div class="spawn-up scroll">uses outer frame</div>
  <div class="scroll-frame inner h-48 overflow-y-auto">
    <div class="spawn-up scroll">uses inner frame — not outer</div>
  </div>
</div>`}</Code>

      <Note>
        <code>.scroll-frame</code> must have a real scrollable geometry (
        <code>height</code> / <code>max-height</code> +{" "}
        <code>overflow: auto</code> or <code>scroll</code>) or ScrollTrigger
        has no range to scrub — the trigger will never fire. It pairs with all
        spawn tunables (<code>progress-start-N</code>,{" "}
        <code>progress-end-N</code>, <code>.progress-reverse</code>) and with
        loops/counters/scramble exactly like window-bound triggers.
      </Note>
    </article>
  );
}