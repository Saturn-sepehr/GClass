import { H1, H2, P, Note, Code, ClassRef } from "@/Shared/DocsUI";
import Replay from "@/Shared/Replay";
import { EntranceDemo } from "@/Shared/DocsUI";

export const metadata = { title: "GClass — Spawn" };

const BOX = "flex min-h-[72px] min-w-[150px] items-center justify-center rounded-xl bg-slate-800 ring-1 ring-slate-700 text-xs";

export default function Page() {
  return (
    <article>
      <H1>Spawn — entrance animations</H1>
      <P>
        Spawn classes animate an element <i>in</i>: they apply a hidden{" "}
        <code>from</code> state, then tween to its natural one. Every spawn
        automatically gains ordering (<code>.order</code> /{" "}
        <code>.priority-N</code> / <code>.reverse</code>), timing tunables,
        scroll &amp; appear variants, a leave-reverse and a split-text flavour.
      </P>

      <H2>Directional</H2>
      <Replay>
        <EntranceDemo cls="appear scroll spawn-up"><div className={BOX}>spawn-up</div></EntranceDemo>
        <EntranceDemo cls="appear scroll spawn-down"><div className={BOX}>spawn-down</div></EntranceDemo>
        <EntranceDemo cls="appear scroll spawn-left"><div className={BOX}>spawn-left</div></EntranceDemo>
        <EntranceDemo cls="appear scroll spawn-right"><div className={BOX}>spawn-right</div></EntranceDemo>
      </Replay>

      <H2>Fade / blur / spin</H2>
      <Replay>
        <EntranceDemo cls="appear scroll spawn-fade"><div className={BOX}>spawn-fade</div></EntranceDemo>
        <EntranceDemo cls="appear scroll spawn-blur"><div className={BOX}>spawn-blur</div></EntranceDemo>
        <EntranceDemo cls="appear scroll spawn-cw"><div className={BOX}>spawn-cw</div></EntranceDemo>
        <EntranceDemo cls="appear scroll spawn-ccw"><div className={BOX}>spawn-ccw</div></EntranceDemo>
      </Replay>

      <H2>3D flips</H2>
      <P>
        Full 360° flips around the X or Y axis with a depth scale — card-like
        unfolds.
      </P>
      <Replay>
        <EntranceDemo cls="appear scroll spawn-x-up"><div className={BOX}>spawn-x-up</div></EntranceDemo>
        <EntranceDemo cls="appear scroll spawn-x-down"><div className={BOX}>spawn-x-down</div></EntranceDemo>
        <EntranceDemo cls="appear scroll spawn-y-right"><div className={BOX}>spawn-y-right</div></EntranceDemo>
        <EntranceDemo cls="appear scroll spawn-y-left"><div className={BOX}>spawn-y-left</div></EntranceDemo>
      </Replay>

      <H2>Tunables</H2>
      <ClassRef
        rows={[
          ["time-N", "Duration in seconds (.time-1 default)"],
          ["ease-NAME", "Any GSAP ease name: back, expo, power2.out…"],
          ["priority-N", "Stagger offset when combined with .order"],
          ["order", "Sequences all .order elements by DOM position"],
          ["reverse", "Flips the .order sequence"],
          ["delay", "Alias for priority-based delay without .order"],
        ]}
      />
      <Code>{`<div class="appear scroll spawn-up time-2 ease-back order">…</div>
<div class="appear scroll spawn-fade priority-3">…</div>`}</Code>

      <Note>
        Spawns respect the CSS-defined opacity of their target: a{" "}
        <code>disabled:opacity-50</code>-style resting value is restored at the
        end of the tween instead of being forced to 1.
      </Note>
    </article>
  );
}
