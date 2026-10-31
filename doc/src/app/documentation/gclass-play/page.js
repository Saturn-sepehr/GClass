import { H1, H2, P, Note, Code, ClassRef } from "@/Shared/DocsUI";

export const metadata = { title: "GClass - gclassPlay" };

export default function Page() {
  return (
    <article>
      <H1>gclassPlay</H1>
      <P>
        Imperative one-shot player that resolves class names against the engine's
        config and invokes matching <code>play()</code> or <code>build()</code> tweens
        without booting the engine. Defined in <code>gclassPlay.js</code> and
        re-exported from <code>index.js:1</code>.
      </P>
      <Code>{`import { gclassPlay } from 'gclass-anims'

// on an existing element
const tween = gclassPlay(document.querySelector('.spawn-up'), 'spawn-up')

// with multiple classes
const tweens = gclassPlay(el, 'spawn-up', 'float')

// with a CSS selector string
const tween = gclassPlay('.spawn-up', 'spawn-up')`}</Code>

      <H2>Target resolution</H2>
      <ClassRef
        rows={[
          ["Element", "HTMLElement"],
          ["Ref", "{ current } (React-style)"],
          ["CSS selector", "'.spawn-up' or '#my-id'"],
          ["Raw id", "without the # prefix"],
          ["Array or NodeList", "of elements"],
        ]}
      />
      <Note>
        Defined in <code>gclassPlay.js gclassPlay(target, ...classes)</code>.
        Accepts space- or comma-separated strings, multiple variadic args, or an
        array of class names. Returns the <code>tween</code> or{" "}
        <code>timeline</code>, or an array when multiple tweens are created. If
        no matching classes are found, <code>null</code> is returned and a
        warning is logged. Elements carrying <code>.reduced</code> are left
        un-animated when the OS has "reduce motion" enabled.
      </Note>

      <H2>When to use</H2>
      <P>
        Use for one-shot imperative playback when you already have an element and
        a class name. Does not require <code>initAnimations()</code>, does not
        boot the engine, add observers, or mutate the element's class list
        permanently. For full animation workflows use <code>initAnimations()</code>.
      </P>
    </article>
  );
}