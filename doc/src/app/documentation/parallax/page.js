import { H1, H2, P, Note, Code, ClassRef } from "@/Shared/DocsUI";
import { Demo } from "@/Shared/DocsUI";

export const metadata = { title: "GClass — Parallax" };

export default function Page() {
  return (
    <article>
      <H1>.parallax-N — scroll drift</H1>
      <P>
        Elements with <code>.parallax-N</code> drift vertically relative to
        scroll. N is a speed factor: <b>1</b> is static (with the page),{" "}
        <b>&lt;1</b> trails behind, <b>&gt;1</b> races ahead — the classic
        depth illusion.
      </P>
      <Code>{`<div class="parallax-0.6">background layer</div>
<div class="parallax-1.4">foreground layer</div>`}</Code>

      <H2>Demo — scroll past these boxes</H2>
      <div className="my-4 space-y-[30vh]">
        <Demo className="parallax-0.5 flex min-h-[160px] items-center justify-center py-14 text-sm">
          parallax-0.5 · lags behind
        </Demo>
        <Demo className="flex min-h-[160px] items-center justify-center py-14 text-sm opacity-50">
          parallax-1 · neutral reference
        </Demo>
        <Demo className="parallax-1.5 flex min-h-[160px] items-center justify-center py-14 text-sm">
          parallax-1.5 · moves ahead
        </Demo>
      </div>

      <Note>
        Implemented as a scrubbed yPercent tween from{" "}
        <code>-(N-1)*25%</code> to <code>+(N-1)*25%</code> across the
        element&apos;s full viewport traversal, so the drift is perfectly
        symmetric around its resting spot.
      </Note>
    </article>
  );
}
