import { H1, H2, P, Note, Code, ClassRef } from "@/Shared/DocsUI";

export const metadata = { title: "GClass - Toggle & reduced motion" };

export default function Page() {
  return (
    <article>
      <H1>Toggle &amp; reduced motion</H1>
      <P>
        The whole engine can be switched off at runtime. The preference is
        persisted to <code>localStorage</code> and survives reloads.
      </P>
      <Code>{`import { toggleAnimations,
         enableReducedMotion,
         disableReducedMotion } from 'gclass-anims'

toggleAnimations()        // flips on/off, persists + reloads
enableReducedMotion()     // hard override: animations OFF
disableReducedMotion()    // clears the override`}</Code>

      <H2>Precedence</H2>
      <ClassRef
        rows={[
          ["forcedReduced", "enableReducedMotion() wins over everything"],
          ["stored choice", "An explicit toggle always beats the OS setting"],
          ["no choice", "Defaults to ON unless prefers-reduced-motion: reduce"],
        ]}
      />

      <H2>Per-element opt-out</H2>
      <P>
        While the OS requests reduced motion, any element carrying{" "}
        <code>.reduced</code> is left completely un-animated - its spawn, loop,
        click and scroll behaviours all skip. Elements without{" "}
        <code>.reduced</code> keep animating.
      </P>
      <Code>{`<div class="spawn-up">animates even under reduce-motion</div>
<div class="spawn-up reduced">skipped under reduce-motion</div>`}</Code>

      <Note>
        All three toggles reload the page after persisting so the running
        engine tears down cleanly.
      </Note>
    </article>
  );
}
