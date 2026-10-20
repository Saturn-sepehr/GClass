import { H1, H2, P, Note, Code, ClassRef } from "@/Shared/DocsUI";

export const metadata = { title: "GClass - SSR and hydration" };

export default function Page() {
  return (
    <article>
      <H1>SSR and hydration</H1>
      <P>
        The design is one call. <code>initAnimations()</code> runs once at your
        app entry, and classes on your markup do the rest. Observers inside the
        engine pick up elements that appear later, so routes, lists and modals
        do not need another call.
      </P>
      <P>
        A server-rendered page hydrates in pieces, and the engine animates by
        mutating the DOM: inline styles, wrapper elements, split text, pin
        spacers. Those changes are safe only for nodes the framework has
        already hydrated. This page covers the timing, not the setup:{" "}
        <code>defer</code>, <code>after</code> and{" "}
        <code>data-gsap-ignore</code> all keep the single call model.
      </P>

      <H2>One call</H2>
      <Code>{`// once, after the DOM is ready
import { initAnimations } from 'gclass-anims'

initAnimations()`}</Code>
      <Note>
        A node inserted after init is wired automatically when it carries{" "}
        <code>.appear</code>. Without <code>.appear</code> a new node is
        ignored by design. If a route introduces interaction-only classes such
        as <code>magnet</code>, <code>click-hover</code> or a loop without{" "}
        <code>.appear</code>, either add <code>.appear</code> to those elements
        or re-call <code>initAnimations()</code> on navigation. Re-calling is
        idempotent: it tears down the previous run first.
      </Note>
      <P>
        Since <code>1.0.0-beta.25</code> the engine keeps its state internally,
        so scanning an element never writes <code>data-gsap-*</code> attributes
        to your markup. That is the fix for the mismatch a layout-level call
        used to cause. You do not mark elements as safe and you do not opt out
        for normal use.
      </P>

      <H2>When to delay the call</H2>
      <P>
        The default is eager, and for most apps it stays that way. Delay the
        same single call only when both are true: a streamed segment contains a
        structural effect (the list at the bottom of this page), and hydration
        may not have reached that segment when your entry code runs.
      </P>

      <H2>defer</H2>
      <P>
        Opt-in. Wiring waits until the document is <code>complete</code>{" "}
        (otherwise the <code>load</code> event), then one animation frame.
      </P>
      <Code>{`// delay the same call until the document has loaded
initAnimations({ defer: true })`}</Code>
      <P>
        This is best-effort. A framework can stream a segment after{" "}
        <code>load</code>, so <code>defer</code> narrows the window, it does
        not close it. It is skipped when a visible <code>.boot-up</code>{" "}
        element exists, because the boot screen already hides the page and
        delaying only makes it flash.
      </P>

      <H2>after</H2>
      <P>
        Opt-in. Wiring waits for any promise-like value, so you can use your
        framework&apos;s hydration signal when it has one. Create the promise
        once at module scope so an early event cannot be missed.
      </P>
      <Code>{`import { initAnimations } from 'gclass-anims'

// resolve this when your app has hydrated
const hydrated = new Promise((resolve) => {
  window.addEventListener('app:hydrated', resolve, { once: true })
})

initAnimations({ after: hydrated })`}</Code>
      <P>
        A rejected <code>after</code> logs a warning and initialises anyway, so
        a failed signal cannot leave the page permanently static. Passing both{" "}
        <code>defer</code> and <code>after</code> waits for both. The newest
        call wins, so a framework that runs the same init twice still
        initialises once. Defaults are unchanged: no options means the original
        eager timing, and <code>gclassOpts()</code> rewiring stays immediate.
      </P>

      <H2>Opting a region out</H2>
      <P>
        Put <code>data-gsap-ignore</code> or <code>no-gclass</code> on the root
        of a region the engine must never enter: a framework portal, a dev
        overlay, a third-party widget. Everything below it is skipped for
        wiring, appear, leave and flip.
      </P>
      <Code>{`<div data-gsap-ignore>
  <!-- engine never touches this subtree -->
</div>

<div class="no-gclass">...</div>`}</Code>
      <Note>
        This is an escape hatch, not part of the happy path. Put an animation
        class on an element and it works, with no per-element opt-in or opt-out.
        Use it for regions that should stay outside the engine entirely, not for
        content you want animated later.
      </Note>

      <H2>What still mutates the DOM</H2>
      <ClassRef
        rows={[
          ["inline styles", "Every animation writes style on the target element"],
          ["wrapper element", "click-hover, hover-*/click-* loops, css-* and gc-* hover/click modes insert a wrapper around the target"],
          ["split-text", "Replaces text with generated spans"],
          ["leave-*", "Clones the element for the exit animation"],
          ["pin", "Inserts a spacer element"],
          [".boot-up", "Sets hidden and display: none on your elements"],
        ]}
      />
      <Note>
        The bookkeeping fix does not remove these. They are the reason the
        timing options exist. If a streamed segment uses a structural class,
        pass <code>after</code> with your hydration signal. If you have no
        signal, keep that content out of the engine with{" "}
        <code>data-gsap-ignore</code> rather than adding a second init site.
        A <code>.boot-up</code> element inside a streamed segment has the same
        requirement: keep boot screens in the initial HTML, and note that{" "}
        <code>defer</code> is ignored while a visible boot screen exists.
      </Note>
    </article>
  );
}
