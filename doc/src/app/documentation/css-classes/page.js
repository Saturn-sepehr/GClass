import { H1, H2, P, Note, Code, ClassRef } from "@/Shared/DocsUI";
import { Demo } from "@/Shared/DocsUI";

export const metadata = { title: "GClass - css-* classes" };

const BOX = "flex min-h-[80px] min-w-[160px] items-center justify-center rounded-xl bg-slate-800 ring-1 ring-slate-700 text-xs";

export default function Page() {
  return (
    <article>
      <H1>css-* - arbitrary property animations</H1>
      <P>
        Animate any numeric GSAP property straight from the class name - no
        config entry required:
      </P>
      <Code>{`css-<prop>-<from>-<to>          ping-pong loop
spawn-css-<prop>-<from>-<to>    plays once on load/appear
hover-css-<prop>-<from>-<to>    ping-pongs while hovered
click-css-<prop>-<from>-<to>    one out-and-back per press

hover-css-<prop>-<to>           hold value while hovered
click-css-<prop>-<to>           go to value while pressed`}</Code>

      <H2>Demo</H2>
      <div className="my-4 flex flex-wrap gap-4">
        <Demo className={BOX + " css-y-0-25 time-1"}>css-y-0-25 (loop)</Demo>
        <Demo className={BOX + " hover-css-scale-1-1.25"}>hover-css-scale</Demo>
        <Demo className={BOX + " click-css-rotation-0-45"}>click-css-rotation</Demo>
        <Demo className={BOX + " hover-css-opacity-30-100"}>hover-css-opacity</Demo>
      </div>

      <H2>Value rules</H2>
      <ClassRef
        rows={[
          ["numbers", "Integers or decimals, negatives allowed: css-x--20-20"],
          ["hex colors", "#RGB / #RRGGBB / #RRGGBBAA: css-background-color-#1e293b-#0ea5e9"],
          ["rest state", "For loops/hovers, `from` should equal the resting value"],
        ]}
      />
      <Note>
        Property names are single GSAP/CSS words (<code>y</code>,{" "}
        <code>x</code>, <code>scale</code>, <code>opacity</code>,{" "}
        <code>rotation</code>, …). Hover/click variants wrap the element in a
        stable hit area like <code>.wrapdiv</code> does.
      </Note>
    </article>
  );
}
