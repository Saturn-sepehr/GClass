import { H1, H2, P, Note, Code, ClassRef } from "@/Shared/DocsUI";
import { Demo } from "@/Shared/DocsUI";
import Replay from "@/Shared/Replay";

export const metadata = { title: "GClass - Scramble text" };

export default function Page() {
  return (
    <article>
      <H1>Scramble text - garbage-to-content reveals</H1>
      <P>
        <code>.scramble</code> resolves the element&apos;s text through garbage
        characters via GSAP&apos;s ScrambleTextPlugin - no opacity fade, the
        scramble <b>is</b> the reveal. Only the element&apos;s own top-level
        text runs are scrambled (each wrapped in its own <code>span</code>);
        nested elements (<code>a</code>, <code>icons</code>, <code>spans</code>)
        are left untouched. Like any spawn it gets <code>.scroll</code>,{" "}
        <code>.scroll-progress</code>, <code>.appear</code>,{" "}
        <code>.leave</code> and timing tunables for free.
      </P>
      <Code>{`<p class="scramble appear time-2">Hello world</p>

<!-- no empty start - finished string flips to garbage then sweeps back -->
<p class="scramble-all appear time-2">GClass</p>

<!-- modifiers -->
<p class="scramble appear time-2 reveal-delay-1 chars-[01] amount-2">010101</p>
<p class="scramble scramble-rtl appear time-2">right → left</p>`}</Code>

      <H2>.scramble - empty → resolved</H2>
      <P>
        Starts from empty, each top-level text run scrambles through the
        character pool until it locks to its real content. Defaults to a{" "}
        <b>linear</b> ease so <code>time-N</code> is the true total reveal
        time - an explicit <code>ease-*</code> (e.g.{" "}
        <code>ease-power2.out</code>) overrides.
      </P>
      <Replay>
        <Demo className="flex min-h-[72px] items-center justify-center text-center text-sm">
          <span className="scramble appear time-2 text-lg font-bold">Hello world</span>
        </Demo>
        <Demo className="flex min-h-[72px] items-center justify-center text-center text-sm">
          <span className="scramble appear time-2 chars-[*#@%] text-lg font-bold">GClass - GSAP utilities</span>
        </Demo>
      </Replay>

      <H2>.scramble-all - garbage sweep</H2>
      <P>
        No empty start. The already-visible string flips to garbage as a whole
        and sweeps back to itself - the native ScrambleText resolve, not typing.
      </P>
      <Replay>
        <Demo className="flex min-h-[72px] items-center justify-center text-center text-sm">
          <span className="scramble-all appear time-2 text-lg font-bold">GClass</span>
        </Demo>
        <Demo className="flex min-h-[72px] items-center justify-center text-center text-sm">
          <span className="scramble-all appear time-2 chars-[01] text-lg font-mono">110101</span>
        </Demo>
      </Replay>

      <H2>Demo - nested elements preserved</H2>
      <P>
        Only bare text nodes scramble. The link and badge below keep their markup
        while the surrounding words scramble around them.
      </P>
      <Replay>
        <Demo className="flex min-h-[72px] items-center justify-center text-center text-sm">
          <p className="scramble appear time-2">
            Visit <a href="#" className="font-bold text-cyan-200 underline">docs</a> for <span className="rounded bg-cyan-200/20 px-1.5 py-0.5 text-xs">gclass-anims</span> →
          </p>
        </Demo>
      </Replay>

    

      <H2>Tunables</H2>
      <ClassRef
        rows={[
          ["reveal-delay-N", "Seconds of full-garbage hold before chars start locking (default 0)"],
          ["chars-[…]", "Character pool verbatim inside brackets (default AaBb…Zz)"],
          ["amount-N", "Scramble speed - ScrambleTextPlugin speed (default 1)"],
          ["scramble-rtl", "Reveal travels right → left (ScrambleText rightToLeft)"],
          ["scramble-all", "No empty start - whole-string garbage sweep"],
          ["time-N / ease-NAME", "Total reveal time (linear by default) / any GSAP ease"],
        ]}
      />
      <Code>{`<p class="scramble appear time-3 reveal-delay-1 chars-[01]">0101</p>
<p class="scramble-all appear time-2 amount-3 scramble-rtl">RTL sweep</p>
<p class="scramble scroll time-2">replays on scroll enter</p>`}</Code>

      <Note>
        Text is segmented per top-level text node - whitespace-only runs stay
        as bare text so spacing is preserved, and each run&apos;s trimmed core
        is wrapped in a <code>span</code> to avoid ScrambleText&apos;s trim
        swallowing edge spaces. Segments are cached per element (
        <code>_gcScrambleSegs</code>) so engine re-inits and <code>.appear</code>{" "}
        replays reuse spans. Keep scrambled text short - each segment is a
        ScrambleText tween.
      </Note>
    </article>
  );
}
