import { H1, H2, P, Note, Code, ClassRef } from "@/Shared/DocsUI";
import { Demo } from "@/Shared/DocsUI";

export const metadata = { title: "GClass - .pin" };

export default function Page() {
  return (
    <article>
      <H1>.pin - sticky sections</H1>
      <P>
        <code>.pin</code> holds an element fixed to the viewport across a
        scroll range using ScrollTrigger pinning (with spacing kept intact).
        The next section starts exactly where the pinned one released.
      </P>

      <H2>Demo - back-to-back pins</H2>
      <P>
        Two pinned panels in a row: watch panel 1 lock to the viewport while
        you scroll through its range, release, and panel 2 engage at exactly
        that scroll position - no gap, no jump.
      </P>
      <div className="h-[30vh]" />
      <Demo className="pin flex h-[60vh] items-center justify-center rounded-xl bg-gradient-to-br from-slate-800 to-slate-900 text-center ring-1 ring-slate-600">
        <div>
          <p className="text-lg font-bold">Pinned panel 1</p>
          <p className="mt-2 text-xs opacity-60">
            locked - keep scrolling until it releases
          </p>
        </div>
      </Demo>
      <Demo className="pin mt-0 flex h-[60vh] items-center justify-center rounded-xl bg-gradient-to-br from-cyan-900/40 to-slate-900 text-center ring-1 ring-cyan-700/50">
        <div>
          <p className="text-lg font-bold">Pinned panel 2</p>
          <p className="mt-2 text-xs opacity-60">
            engaged exactly where panel 1 released
          </p>
        </div>
      </Demo>
      <div className="h-[45vh] pt-6">
        <Demo className="flex items-center justify-center py-6">
          content after the pins - if you see doubled space above, pin cleanup
          leaked
        </Demo>
      </div>

      <H2>Demo - early release with .progress-end-25</H2>
      <P>
        Tunables move the engage/release points. This panel releases 25%
        before its range would normally end - it lets go noticeably earlier
        than the two above did. Scroll back and forth across both demos to
        feel the difference.
      </P>
      <div className="h-[30vh]" />
      <Demo className="pin progress-end-25 flex h-[55vh] items-center justify-center rounded-xl bg-slate-800/60 text-center ring-1 ring-amber-500/40">
        <div>
          <p className="text-lg font-bold">.pin .progress-end-25</p>
          <p className="mt-2 text-xs opacity-60">releases 25% early</p>
        </div>
      </Demo>
      <div className="h-[45vh] pt-6">
        <Demo className="flex items-center justify-center py-6">
          normal flow resumes here
        </Demo>
      </div>

      <H2>Tunables</H2>
      <ClassRef
        rows={[
          ["progress-start-N", "Pin engages N% before the top reaches viewport top"],
          ["progress-end-N", "Releases N% earlier than full range"],
        ]}
      />
      <Code>{`<section class="pin progress-start-10" style="height:60vh">…</section>`}</Code>

      <Note>
        Pins are created before every other trigger measures layout, and their
        teardown uses <code>kill(true)</code> so spacers never leak between
        engine restarts.
      </Note>
    </article>
  );
}
