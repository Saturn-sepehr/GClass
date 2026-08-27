  import { H1, H2, P, Note, Code, ClassRef } from "@/Shared/DocsUI";
import { Demo } from "@/Shared/DocsUI";

export const metadata = { title: "GClass - Parallax" };

export default function Page() {
  return (
    <article>
      <H1>.parallax-N - scroll drift</H1>
      <P>
        Elements with <code>.parallax-N</code> drift vertically relative to
        scroll. N is a speed factor: <b>1</b> is static (with the page),{" "}
        <b>&lt;1</b> trails behind, <b>&gt;1</b> races ahead - the classic
        depth illusion.
      </P>
      <Code>{`<div class="parallax-0.6">background layer</div>
<div class="parallax-1.4">foreground layer</div>`}</Code>

      <H2>Demo - layered depth scene</H2>
      <P>
        Three cards stacked like a fanned deck: the back layer crawls (0.4),
        the middle moves with the page, the front races ahead (1.6). Scroll
        slowly and watch them slide across each other - that relative motion
        is the entire effect.
      </P>
      <div className="relative my-6 h-[170vh]">
        <div className="parallax-0.4 absolute left-[6%] top-24 flex h-56 w-3/5 -rotate-3 flex-col justify-center rounded-xl border border-slate-800 bg-slate-900 p-6 shadow-lg shadow-black/30 bg-[repeating-linear-gradient(45deg,rgba(148,163,184,0.09)_0_14px,transparent_14px_28px)]">
          <p className="text-xs font-bold tracking-wider opacity-50">BACK · .parallax-0.4</p>
          <p className="mt-2 text-sm opacity-80">trails behind the page</p>
        </div>
        <div className="absolute left-[13%] top-44 flex h-56 w-3/5 flex-col justify-center rounded-xl border border-slate-600 bg-slate-700/30 p-6 shadow-lg shadow-black/40 bg-[repeating-linear-gradient(-45deg,rgba(148,163,184,0.14)_0_16px,transparent_16px_32px)]">
          <p className="text-xs font-bold tracking-wider opacity-50">MID · no class</p>
          <p className="mt-2 text-sm opacity-80">moves with the page - neutral reference</p>
        </div>
        <div className="parallax-1.6 absolute left-[20%] top-64 flex h-56 w-3/5 rotate-3 flex-col justify-center rounded-xl border border-cyan-300/40 bg-slate-900 p-6 shadow-xl shadow-black/50 bg-[repeating-linear-gradient(45deg,rgba(34,211,238,0.14)_0_14px,transparent_14px_28px)]">
          <p className="text-xs font-bold tracking-wider text-cyan-200/70">FRONT · .parallax-1.6</p>
          <p className="mt-2 text-sm opacity-90">races ahead of the page</p>
        </div>
      </div>

      <H2>Demo - isolated comparison</H2>
      <P>
        The same speeds one per row, so you can check each drift against the
        page edges without overlap.
      </P>
      <div className="my-4 mb-[30vh] space-y-[26vh]">
        <Demo className="parallax-0.5 flex min-h-[140px] items-center justify-center py-14 text-sm">
          .parallax-0.5 · lags behind
        </Demo>
        <Demo className="flex min-h-[140px] items-center justify-center py-14 text-sm opacity-50">
          no class · neutral reference
        </Demo>
        <Demo className="parallax-1.5 flex min-h-[140px] items-center justify-center py-14 text-sm">
          .parallax-1.5 · moves ahead
        </Demo>
      </div>

      <H2>Tunables</H2>
      <ClassRef
        rows={[
          ["parallax-N", "Speed factor - 0.5 trails, 1 is neutral, 1.5 races ahead"],
        ]}
      />
      <Note>
        Implemented as a scrubbed yPercent tween from{" "}
        <code>-(N-1)*25%</code> to <code>+(N-1)*25%</code> across the
        element&apos;s full viewport traversal, so the drift is perfectly
        symmetric around its resting spot.
      </Note>
    </article>
  );
}
