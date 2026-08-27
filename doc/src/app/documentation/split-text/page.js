import { H1, H2, P, Note, Code, ClassRef } from "@/Shared/DocsUI";
import Replay from "@/Shared/Replay";
import { Demo } from "@/Shared/DocsUI";

export const metadata = { title: "GClass - Split text" };

export default function Page() {
  return (
    <article>
      <H1>Split text</H1>
      <P>
        Every spawn class automatically gets a{" "}
        <code>.spawn-text-&lt;name&gt;</code> flavour. Applying it splits the
        element&apos;s text with GSAP&apos;s SplitText and animates each part
        with the same <code>from</code> state as its base animation.
      </P>
      <Code>{`<h2 class="appear spawn-text-spawn-up letter">Splits into letters</h2>
<h2 class="scroll spawn-text-spawn-fade">splits into words (default)</h2>`}</Code>

      <H2>Granularity</H2>
      <ClassRef
        rows={[
          ["(none)", "Per word - cheapest, best default"],
          [".letter", "Per character - most granular"],
          [".lines", "Per line - great for multi-line headings"],
        ]}
      />

      <H2>Live demo</H2>
      <Replay>
        <Demo className="appear spawn-text-spawn-up letter min-w-[240px] p-4 text-lg font-extrabold">
          Letters spring up
        </Demo>
        <Demo className="appear spawn-text-spawn-down lines min-w-[240px] p-4 text-lg font-bold">
          Lines drop in
          <br />
          one after another
        </Demo>
      </Replay>

      <H2>Tunables</H2>
      <ClassRef
        rows={[
          ["stagger-N", "Fixed per-part delay; duration is back-solved to fit time-N"],
          ["time-N", "Total reveal time for the whole element"],
          ["no-revert", "Keep the split spans after completion (default: collapse back)"],
        ]}
      />
      <Note>
        The split collapses back into plain text once finished unless{" "}
        <code>.no-revert</code> is present, freeing hundreds of per-letter
        nodes so long pages stay fast. Arabic/Persian text gets a special
        per-letter split that keeps glyph joins intact via zero-width joiners.
      </Note>
    </article>
  );
}
