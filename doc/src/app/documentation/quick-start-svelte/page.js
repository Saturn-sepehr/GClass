import { H1, H2, P, Note, Code } from "@/Shared/DocsUI";

export const metadata = { title: "GClass - Quick start (Svelte)" };

export default function Page() {
  return (
    <article>
      <H1>Quick start - Svelte</H1>
      <P>
        Framework-agnostic - call{" "}
        <code>initAnimations()</code> inside <code>onMount</code> so it runs only
        in the browser; the engine then watches <code>.appear</code> and{" "}
        <code>.scroll</code> elements as the component tree mounts.
      </P>
<H2>Usage - Svelte component</H2>
      <Code>{`<script>
  import { onMount } from 'svelte'
  import { initAnimations } from 'gclass-anims'

  onMount(() => {
    initAnimations()
  })
</script>

<div class="appear scroll spawn-up">hello svelte</div>
<button class="magnet click-expand">magnet + click</button>`}</Code>

      <H2>SvelteKit layout re-init</H2>
      <Code>{`// src/routes/+layout.svelte
<script>
  import { onMount } from 'svelte'
  import { afterNavigate } from '$app/navigation'
  import { initAnimations } from 'gclass-anims'

  onMount(() => {
    initAnimations()
    afterNavigate(() => initAnimations())
  })
</script>

<slot />`}</Code>

      <H2>What&apos;s next</H2>
      <P>
        Add utility classes to markup - no Svelte actions or directives required.
        See <code>quick-start-js</code> for vanilla parity.
      </P>
    </article>
  );
}
