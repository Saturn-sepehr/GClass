import { H1, H2, P, Note, Code, ClassRef } from "@/Shared/DocsUI";

export const metadata = { title: "GClass - defaults" };

export default function Page() {
  return (
    <article>
      <H1>defaults</H1>
      <P>
        Every tunable has a fallback in the exported <code>defaults</code>{" "}
        object - the single source of truth for engine-wide numbers:
      </P>
      <Code>{`import { defaults } from 'gclass-anims'

{
  orderDivide: 5,              // .order sequence: index / 5 → seconds
  spawnDelayMultiplier: 0.2,   // priority-N → N × 0.2s delay
  spawnOffset: 20,             // px travelled by directional spawns
  clickOffset: 10,             // click-hover lift (px)
  clickExpandOffset: 15,       // click-expand scale×10
  clickDuration: 0.2,
  ease: "back",                // default ease-* when absent
  effectDelay: 0.5,            // loop edelay
  effectDuration: 1,           // loop etime
  effectOffset: 20,            // loop amount
  progressStart: "top bottom", // scroll-progress range start
  progressEnd: "center center",
  textStagger: 0.03,
  typewriterSplitCharDuration: 0.05,
  minTextPartDuration: 0.3,    // floor for back-solved split durations
}`}</Code>

      <H2>Reading vs mutating</H2>
      <P>
        The engine reads this object at wiring time, so overriding entries{" "}
        <b>before</b> <code>initAnimations()</code> changes engine-wide
        behaviour without touching a single class.
      </P>
      <Note>
        Per-element classes always win over defaults -{" "}
        <code>.time-2</code> beats <code>effectDuration</code>,{" "}
        <code>.ease-expo</code> beats <code>ease</code>.
      </Note>
    </article>
  );
}
