import { H1, H2, P, Note, Code, ClassRef } from "@/Shared/DocsUI";

export const metadata = { title: "GClass - Marquees" };

const TILE = "rounded-lg px-6 py-3 text-xs font-bold";

export default function Page() {
  return (
    <article>
      <H1>Marquees</H1>
      <P>
        Infinite tickers that tile their own content. The engine wraps children
        into an absolute track, repeats the unit until it covers the viewport,
        then scrolls the track forever. Give the host a width (horizontal) or
        height (vertical) and <code>overflow-hidden</code>.
      </P>
      <Note>
        Marquees are loops - they build via <code>Config.js:163</code> and use the
        same <code>time-N</code> duration system as other loops, not spawns.
        They also support <code>hover-*</code> / <code>click-*</code> triggers
        like any loop.
      </Note>

      <H2>Horizontal - left / right</H2>
      <P>
        <code>.marquee-left</code> scrolls toward the left,{" "}
        <code>.marquee-right</code> toward the right. The track is a row.
      </P>
      <div className="my-3 flex flex-col order spawn-down gap-3">
        <div className="marquee-left time-20 overflow-hidden rounded-xl bg-slate-800 ring-1 ring-slate-700">
          <span className={`mx-3 ${TILE} bg-cyan-900`}>marquee-left</span>
        </div>
        <div className="marquee-right time-20 overflow-hidden rounded-xl bg-slate-800 ring-1 ring-slate-700">
          <span className={`mx-3 ${TILE} bg-cyan-900`}>marquee-right</span>

        </div>
      </div>
      <Code>{`<div class="marquee-left time-20 overflow-hidden">
  <span>marquee-left</span><span>marquee-left</span>
</div>

<div class="marquee-right time-20 overflow-hidden">
  <span>marquee-right</span><span>marquee-right</span>
</div>`}</Code>

      <H2>Vertical - up / down</H2>
      <P>
        <code>.marquee-up</code> and <code>.marquee-down</code> use a column
        track. Give the host a fixed height so the tiling has a viewport to
        fill.
      </P>
      <div className="my-3 grid spawn-down order grid-cols-2 gap-3">
        <div className="marquee-up time-10 h-32 overflow-hidden rounded-xl bg-slate-800 ring-1 ring-slate-700">
          <span className={`my-2 block ${TILE} bg-cyan-900 text-center`}>marquee-up</span>
        </div>
        <div className="marquee-down time-10 h-32 overflow-hidden rounded-xl bg-slate-800 ring-1 ring-slate-700">
          <span className={`my-2 block ${TILE} bg-cyan-900 text-center`}>marquee-down</span>

        </div>
      </div>
      <Code>{`<div class="marquee-up time-10 h-24 overflow-hidden">
  <span>marquee-up</span><span>marquee-up</span>
</div>

<div class="marquee-down time-10 h-24 overflow-hidden">
  <span>marquee-down</span><span>marquee-down</span>
</div>`}</Code>

      <H2>Tunables</H2>
      <ClassRef
        rows={[
          ["time-N", "Travel duration in seconds for one unit length (default 1)"],
          [".marquee-no-repeat", "Only 2 copies, single seam - minimal tiling"],
          ["marquee-horizontal-offset-N", "Track left offset in px (horizontal marquees)"],
          ["marquee-vertical-offset-N", "Track top offset in px (vertical marquees)"],
        ]}
      />
      <Code>{`<div class="marquee-left time-30 marquee-no-repeat overflow-hidden">…</div>
<div class="marquee-left marquee-horizontal-offset-12 overflow-hidden">…</div>
<div class="marquee-up marquee-vertical-offset-12 h-24 overflow-hidden">…</div>`}</Code>

      <H2>Fixed background usage</H2>
      <P>
        For a decorative backdrop like the docs <code>Display.jsx:37</code>{" "}
        marquee, use a <code>fixed</code> host with{" "}
        <code>pointer-events-none -z-10</code> and keep{" "}
        <code>marquee-left</code> on the inner tiling element so scroll and DOM
        mutations do not affect it.
      </P>
      <Code>{`<div class="pointer-events-none fixed inset-0 -z-10 overflow-hidden flex items-center opacity-10">
  <div class="marquee-left whitespace-nowrap text-[25vw] font-black">
    <p>GCLASS GCLASS GCLASS GCLASS</p>
  </div>
</div>`}</Code>

      <Note>
        Host must have content to tile - empty hosts return an inert tween
        (<code>Animations.js:673</code>). Horizontal hosts need a width, vertical
        hosts need a height, otherwise the engine sets one from the track.
      </Note>
    </article>
  );
}
