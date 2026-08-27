import { H1, H2, P, Note, Code } from "@/Shared/DocsUI";
import Replay from "@/Shared/Replay";
import { EntranceDemo } from "@/Shared/DocsUI";

export const metadata = { title: "GClass - Typewriter" };

const BOX = "flex min-h-[72px] w-full items-center rounded-xl bg-slate-800 px-5 ring-1 ring-slate-700 text-sm";

export default function Page() {
  return (
    <article>
      <H1>Typewriter</H1>
      <P>
        Types the element&apos;s existing content out character by character,
        powered by GSAP&apos;s TextPlugin. The text you write in the HTML is
        the text that gets typed - no duplication needed.
      </P>

      <H2>Single stream</H2>
      <P>
        A plain <code>.typewriter</code> types everything as one string. Pair
        it with <code>.ease-none</code> so characters appear at a constant
        rate instead of easing in.
      </P>
      <Replay>
        <EntranceDemo cls="">
          <p className={`${BOX} appear scroll typewriter ease-none time-3`}>Types itself when scrolled into view…</p>
        </EntranceDemo>
      </Replay>

      <H2>Split typewriter</H2>
      <P>
        <code>.typewriter-split</code> reveals per-part instead of per-string:
        each word (or letter) fades in sequence, which reads like typing but
        keeps already-typed words individually animatable.
      </P>
      <Replay>
        <div className="appear scroll typewriter-split letter time-3 w-full rounded-xl bg-slate-800 px-6 py-7 text-base leading-relaxed ring-1 ring-slate-700">
          Letter by letter, like a terminal boot log.
        </div>
        <div className="appear scroll typewriter-split time-3 w-full rounded-xl bg-slate-900 px-6 py-7 text-base leading-relaxed text-cyan-200/90 ring-1 ring-slate-700/70">
          Word by word - cheaper for long paragraphs.
        </div>
      </Replay>

      <Note>
        The typed value is captured once per element and refreshed only from
        settled DOM, so React re-renders and engine restarts can never leave
        the element stuck on an empty string.
      </Note>
      <Code>{`<h2 class="typewriter ease-none order">Hello world</h2>
<p class="scroll typewriter-split letter time-4">Long intro copy…</p>`}</Code>
    </article>
  );
}
