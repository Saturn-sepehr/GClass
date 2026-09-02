import { H1, H2, P, Note, Code } from "@/Shared/DocsUI";
import Replay from "@/Shared/Replay";
import { Demo } from "@/Shared/DocsUI";
import DynamicDemo from "@/Shared/DynamicDemo";
import LeaveDemo from "@/Shared/LeaveDemo";
import FlipDemo from "@/Shared/FlipDemo";

export const metadata = { title: "GClass - Dynamic elements" };

export default function Page() {
  return (
    <article>
      <H1>Dynamic elements - .appear</H1>
      <P>
        A MutationObserver watches the document for insertions. Any added
        element carrying <code>.appear</code> plays its entrance immediately -
        pagination rows rendered after a fetch, modals, list items, everything.
      </P>

      <H2>Demo - real insertions</H2>
      <Demo>
        <DynamicDemo />
      </Demo>

      <H2>Replay works the same way</H2>
      <P>
        The replay wrapper below removes its child and re-inserts it. To the
        engine that is indistinguishable from app code mounting new content:
      </P>
      <Replay>
        <div className="appear spawn-blur rounded-xl bg-slate-800 px-5 py-4 text-sm ring-1 ring-slate-700">
          re-mounted on every replay
        </div>
      </Replay>

      <Note>
        Rules of thumb: without <code>.appear</code>, inserted elements are
        ignored (no surprise animations). Non-text elements carrying{" "}
        <code>.scroll</code> are owned by their ScrollTrigger instead and{" "}
        <code>.appear</code> yields to it. Each element animates once per mount
        - re-inserting the same node replays it, since the guard is per engine
        run.
      </Note>
      <Code>{`const row = document.createElement('li')
row.className = 'appear spawn-left'
list.appendChild(row)   // entrance plays automatically`}</Code>

      <H2>.leave - animated exits</H2>
      <P>
        Adding <code>.leave</code> to an element teaches the engine its exit:
        on insertion the element (and its spawn&apos;s <code>from</code>{" "}
        state) is captured; when it&apos;s later removed, a ghost replays the
        entrance in reverse while a spacer holds the layout steady - so
        surrounding content never jumps.
      </P>
      <Demo>
        <LeaveDemo />
      </Demo>
      <Code>{`row.className = 'appear leave spawn-left'
list.appendChild(row)
// later:
row.remove()   // slides back out, layout held by a spacer`}</Code>
      <Note>
        Combine with any spawn class - the leave animation is simply that
        spawn played in reverse from the element&apos;s captured state.
      </Note>

      <H2>.flip - FLIP layout morph</H2>
      <P>
        <code>.flip</code> is Vanilla FLIP: on insertion the engine captures the element&apos;s document-relative bounds (<code>flipPos</code>), then on the next layout change each <code>.flip</code> under the mutated scope slides from its old to new position (<code>gsap.fromTo x/y</code>). Great for reorders, filters, or masonry shuffles - no manual <code>Flip</code> plugin call needed.
      </P>
      <Demo>
        <FlipDemo />
      </Demo>
      <Code>{`<div id="list" class="flex gap-3">
  <div class="flip spawn-up">A</div>
  <div class="flip spawn-up">B</div>
  <div class="flip spawn-up">C</div>
</div>

<script>
  // any DOM reorder triggers FLIP - MutationObserver in Listeners.js:272 handles it
  list.appendChild(list.firstElementChild) // A → end, B and C slide to fill
</script>`}</Code>
      <Note>
        Add <code>.flip</code> alongside any spawn (<code>flip spawn-up</code>). The engine guards re-entrancy (<code>flipping</code> WeakSet) and kills in-flight tweens so rapid shuffles don&apos;t compound.
      </Note>
    </article>
  );
}
