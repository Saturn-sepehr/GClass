import { H1, H2, P, Note } from "@/Shared/DocsUI";
import Replay from "@/Shared/Replay";
import { EntranceDemo } from "@/Shared/DocsUI";

export const metadata = { title: "GClass - Expand" };

const BOX = "flex min-h-[90px] w-full items-center justify-center rounded-xl bg-slate-700 ring-1 ring-slate-600 text-xs";

export default function Page() {
  return (
    <article>
      <H1>Expand - scale reveals</H1>
      <P>
        Expand classes grow an element from a collapsed scale. Directional
        variants anchor the transform-origin to the correct edge so the element
        appears to unfold from where it is anchored in your layout.
      </P>

      <H2>Axis expands (centre origin)</H2>
      <Replay>
        <EntranceDemo cls="appear scroll expand-vertical"><div className={BOX}>expand-vertical</div></EntranceDemo>
        <EntranceDemo cls="appear scroll expand-horizontal"><div className={BOX}>expand-horizontal</div></EntranceDemo>
        <EntranceDemo cls="appear scroll expand-all"><div className={BOX}>expand-all</div></EntranceDemo>
      </Replay>

      <H2>Directional (edge origin)</H2>
      <Replay>
        <EntranceDemo cls="appear scroll expand-up"><div className={BOX}>expand-up</div></EntranceDemo>
        <EntranceDemo cls="appear scroll expand-down"><div className={BOX}>expand-down</div></EntranceDemo>
        <EntranceDemo cls="appear scroll expand-left"><div className={BOX}>expand-left</div></EntranceDemo>
        <EntranceDemo cls="appear scroll expand-right"><div className={BOX}>expand-right</div></EntranceDemo>
      </Replay>

      <Note>
        Directional expands set their own <code>transformOrigin</code> via a
        timeline <code>set()</code> before the tween - that&apos;s what makes{" "}
        <code>.expand-right</code> grow left→right rather than from the centre.
        These play at full opacity; combine with a spawn class if you also want
        a fade.
      </Note>
    </article>
  );
}
