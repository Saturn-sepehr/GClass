import { H1, H2, P, Note, Code, ClassRef } from "@/Shared/DocsUI";
import { Demo } from "@/Shared/DocsUI";

export const metadata = { title: "GClass — .pin" };

export default function Page() {
  return (
    <article>
      <H1>.pin — sticky sections</H1>
      <P>
        <code>.pin</code> holds an element fixed to the viewport across a
        scroll range using ScrollTrigger pinning (with spacing kept intact).
        The next section starts exactly where the pinned one released.
      </P>

      <H2>Demo — the panel below pins for its range</H2>
      <div className="h-[45vh]" />
      <Demo className="pin flex h-[60vh] items-center justify-center rounded-xl bg-gradient-to-br from-slate-800 to-slate-900 text-center ring-1 ring-slate-600">
        <div>
          <p className="text-lg font-bold">Pinned panel</p>
          <p className="mt-2 text-xs opacity-60">keep scrolling — it releases at bottom-top</p>
        </div>
      </Demo>
      <div className="h-[45vh] pt-6">
        <Demo className="flex items-center justify-center py-6">
          content after the pin — if you see doubled space above, pin cleanup leaked
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
