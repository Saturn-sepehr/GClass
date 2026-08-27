import { H1, H2, P, Note, Code } from "@/Shared/DocsUI";
import Replay from "@/Shared/Replay";
import { EntranceDemo, Demo } from "@/Shared/DocsUI";

export const metadata = { title: "GClass - Clip & curtains" };

const BOX = "flex min-h-[90px] w-full items-center justify-center rounded-xl bg-gradient-to-br from-slate-700 to-slate-800 ring-1 ring-slate-600 text-xs";

export default function Page() {
  return (
    <article>
      <H1>Clip-path reveals &amp; curtains</H1>
      <P>
        Pure <code>clip-path</code> wipes: the element&apos;s box is unclipped
        from a chosen edge. No opacity is involved, making them ideal for
        media and containers that must stay fully opaque while revealing.
      </P>

      <H2>Edge reveals</H2>
      <Replay>
        <EntranceDemo cls="appear scroll clip-reveal-up" ><div className={BOX}>clip-reveal-up</div></EntranceDemo>
        <EntranceDemo cls="appear scroll clip-reveal-down"><div className={BOX}>clip-reveal-down</div></EntranceDemo>
        <EntranceDemo cls="appear scroll clip-reveal-left"><div className={BOX}>clip-reveal-left</div></EntranceDemo>
        <EntranceDemo cls="appear scroll clip-reveal-right"><div className={BOX}>clip-reveal-right</div></EntranceDemo>
      </Replay>
      <P className="text-xs opacity-60">
        The bare <code>.clip-reveal</code> class is a legacy alias for{" "}
        <code>.clip-reveal-up</code>.
      </P>

      <H2>Curtains</H2>
      <P>
        Open outward from the centre - a slit widens until the whole box is
        shown.
      </P>
      <Replay>
        <EntranceDemo cls="appear scroll curtain-horizontal"><div className={BOX}>curtain-horizontal</div></EntranceDemo>
        <EntranceDemo cls="appear scroll curtain-vertical"><div className={BOX}>curtain-vertical</div></EntranceDemo>
      </Replay>

      <Note>
        These entries are registered with <code>text: false</code>, so no{" "}
        <code>.spawn-text-*</code> SplitText variant is generated for them -
        splitting media boxes would be pointless.
      </Note>
      <Code>{`<img class="scroll clip-reveal-up time-2" src="…">
<div class="appear curtain-vertical">…</div>`}</Code>
    </article>
  );
}
