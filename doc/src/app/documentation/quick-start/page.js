import { H1, H2, P, Note, Code } from "@/Shared/DocsUI";
import Replay from "@/Shared/Replay";

export const metadata = { title: "GClass — Quick start" };

export default function Page() {
  return (
    <article>
      <H1>Quick start</H1>
      <P>
        Import <code>initAnimations</code> once your DOM is ready. From then on,
        everything is class-driven: add a utility class to an element and it
        animates — no per-element JS, no config files.
      </P>
      <Code>{`import { initAnimations } from 'gclass-anims'

// vanilla / after DOM ready:
initAnimations()

// React (root layout or app shell):
useEffect(() => { initAnimations() }, [pathname])`}</Code>

      <H2>Your first animation</H2>
      <P>
        Press Replay to remove and re-insert the box below — the engine watches
        the DOM for <code>.appear</code> elements and plays their entrance each
        time they mount.
      </P>
      <Replay>
        <div className="appear scroll spawn-up flex min-h-[72px] min-w-[220px] items-center justify-center rounded-xl bg-slate-800 p-5 ring-1 ring-slate-700">
          .appear.scroll.spawn-up
        </div>
      </Replay>

      <Note>
        Class anatomy: <b>behaviour</b> (<code>.spawn-up</code>) +{" "}
        <b>trigger</b> (<code>.scroll</code>, <code>.appear</code>) +{" "}
        <b>tunables</b> (<code>.time-1</code>, <code>.ease-back</code>,{" "}
        <code>.priority-2</code>). Combine freely — order in{" "}
        <code>class</code> does not matter.
      </Note>
    </article>
  );
}
