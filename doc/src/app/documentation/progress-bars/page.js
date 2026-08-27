import { H1, H2, P, Note, Code, ClassRef } from "@/Shared/DocsUI";

export const metadata = { title: "GClass - Progress bars" };

function Track({ label, barClass }) {
  return (
    <div>
      <p className="mb-2 text-xs opacity-60">{label}</p>
      <div className="h-3 overflow-hidden rounded-full bg-slate-800 ring-1 ring-slate-700">
        <div className={`${barClass} h-full w-full rounded-full bg-cyan-300/80`} />
      </div>
    </div>
  );
}

export default function Page() {
  return (
    <article>
      <H1>Progress bars</H1>
      <P>
        <code>.progress-bar</code> / <code>.scroll-fill</code> fill an element
        from 0→100% (<code>scaleX</code>, anchored left) across a scroll range.
        They are scroll-driven extras: no spawn class needed on the element.
      </P>

      <H2>Demo - three ranges side by side</H2>
      <P>
        Scroll down slowly and compare: the early-start bar begins filling as
        soon as it peeks over the bottom edge, the default bar starts at the
        standard range, and the reversed one drains from full to empty. All
        three scrub with your scrollbar - scroll back up and they rewind.
      </P>
      <div className="my-4 space-y-[45vh]">
        <Track
          label=".progress-bar - default range (top bottom → center center)"
          barClass="progress-bar"
        />
        <Track
          label=".progress-bar .progress-start-40 - starts filling while still low in the viewport"
          barClass="progress-bar progress-start-40"
        />
        <Track
          label=".scroll-fill .progress-reverse - full → empty"
          barClass="scroll-fill progress-reverse"
        />
      </div>

      <H2>Tunables</H2>
      <ClassRef
        rows={[
          ["progress-start-N", "Range begins when top hits (100−N)% of viewport"],
          ["progress-end-N", "Range ends at (100−N)% instead of bottom-top"],
          [".progress-reverse", "Runs the fill backwards: full → empty"],
        ]}
      />
      <Code>{`<div class="track">
  <div class="scroll-fill progress-reverse h-full bg-cyan-400"></div>
</div>`}</Code>
      <Note>
        Both names are aliases of one entry; pick whichever reads better in
        your markup. The fill uses <code>transform-origin: left center</code>,
        so it never triggers layout - only compositing.
      </Note>
    </article>
  );
}
