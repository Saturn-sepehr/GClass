import { H1, H2, P, Note, Code, ClassRef } from "@/Shared/DocsUI";
import { Demo } from "@/Shared/DocsUI";

export const metadata = { title: "GClass — Progress bars" };

export default function Page() {
  return (
    <article>
      <H1>Progress bars</H1>
      <P>
        <code>.progress-bar</code> / <code>.scroll-fill</code> fill an element
        from 0→100% (<code>scaleX</code>, anchored left) across a scroll range.
        They are scroll-driven extras: no spawn class needed on the element.
      </P>

      <H2>Demo — fills as you scroll past</H2>
      <div className="my-4 space-y-[45vh]">
        {[1, 2].map((i) => (
          <div key={i}>
            <p className="mb-2 text-xs opacity-60">scroll-fill bar {i} — fills across the whole viewport traversal</p>
            <div className="h-3 overflow-hidden rounded-full bg-slate-800 ring-1 ring-slate-700">
              <div className="progress-bar h-full w-full rounded-full bg-cyan-300/80" />
            </div>
          </div>
        ))}
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
        so it never triggers layout — only compositing.
      </Note>
    </article>
  );
}
