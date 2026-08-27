import { H1, H2, P, Note, Code } from "@/Shared/DocsUI";

export const metadata = { title: "GClass - registerComplete" };

export default function Page() {
  return (
    <article>
      <H1>registerComplete</H1>
      <P>
        The <code>on-…-complete-*</code> classes resolve their value to a
        function. <code>registerComplete</code> is the clean way to publish
        those functions without polluting the global scope.
      </P>
      <Code>{`import { registerComplete, initAnimations } from 'gclass-anims'

registerComplete('showToast', (el) => {
  toast('animation finished on', el)
})

initAnimations()`}</Code>

      <H2>Resolution order</H2>
      <P>
        When an element carries e.g.{" "}
        <code>on-spawn-complete-showToast</code>, the engine looks up:
      </P>
      <ol className="my-3 list-decimal space-y-1 pl-6 text-sm opacity-80">
        <li>the registry populated by <code>registerComplete(name, fn)</code></li>
        <li>a global fallback: <code>window[&quot;showToast&quot;]</code> if it is a function</li>
      </ol>

      <Note>
        Registering before <code>initAnimations()</code> is safest, but not
        required - lookups happen at completion time, not wiring time.
        Returning the same fn you pass in makes inline registration ergonomic:
        <br />
        <code>{`onClick={registerComplete('x', fn)}`}</code>
      </Note>
    </article>
  );
}
