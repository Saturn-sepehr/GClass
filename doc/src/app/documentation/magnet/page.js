import { H1, H2, P, Note, Code, ClassRef } from "@/Shared/DocsUI";
import { Demo } from "@/Shared/DocsUI";

export const metadata = { title: "GClass — Magnet" };

const BOX = "flex min-h-[100px] min-w-[200px] items-center justify-center rounded-xl bg-slate-800 ring-1 ring-slate-700 text-xs";

export default function Page() {
  return (
    <article>
      <H1>.magnet / .magnet3d</H1>
      <P>
        Magnetic elements are attracted to the cursor: they translate toward
        the pointer while slightly growing, then spring back on leave. The 3D
        variant additionally tilts to face the cursor.
      </P>

      <H2>Demo — move your cursor across these</H2>
      <div className="my-4 flex flex-wrap gap-6">
        <Demo className={BOX + " magnet amount-30 mgrow-1.1"}>
          .magnet
        </Demo>
        <Demo className={BOX + " magnet3d mtilt-16"}>
          .magnet3d
        </Demo>
      </div>

      <H2>Tunables</H2>
      <ClassRef
        rows={[
          ["amount-N", "Attraction strength (fraction of cursor offset)"],
          ["mgrow-N", "Scale while attracted (default 1.1)"],
          ["mtime-N", "Tween duration per mousemove (default 0.4s)"],
          ["mtilt-N", "Max tilt degrees for magnet3d (default 12)"],
        ]}
      />
      <Code>{`<button class="magnet amount-40">pull me</button>
<div class="magnet3d mtilt-18 mgrow-1.05">card</div>`}</Code>

      <Note>
        Magnets disable themselves automatically on touch devices via a{" "}
        <code>hover: none</code> media query, and rebind if that changes at
        runtime.
      </Note>
    </article>
  );
}
