import { H1, H2, P, Note, Code } from "@/Shared/DocsUI";

export const metadata = { title: "GClass - Quick start (SvelteKit)" };

export default function Page() {
  return (
    <article>
      <H1>Quick start - SvelteKit</H1>
      <P>
        SvelteKit layouts persist across routes - unlike plain Svelte Vite. Call{" "}
        <code>initAnimations()</code> in <code>onMount</code> and again on{" "}
        <code>afterNavigate</code>. Wrapping a layout in{" "}
        <code>class="preserve"</code> freezes it (uses{" "}
        <code>Listeners.js:145 isPreserved</code>) - remove it to re-animate.
      </P><H2>Usage - SvelteKit layout</H2>
      <Code>{`// src/routes/+layout.svelte
<script>
  import { onMount } from 'svelte'
  import { afterNavigate } from '$app/navigation'
  import { initAnimations } from 'gclass-anims'

  onMount(async () => {
    const { tick } = await import('svelte')
    await tick()
    initAnimations()
  })

  afterNavigate(async () => {
    const { tick } = await import('svelte')
    await tick()
    initAnimations()
  })
</script>

<slot />`}</Code>

      <H2>SSR guard</H2>
      <P>
        <code>AnimToggle.js:11</code> guards <code>window.matchMedia</code> with{" "}
        <code>typeof window</code> - <code>vite build</code> SSR bundle will not throw. No <code>client:load</code> equivalent needed.
      </P>
    </article>
  );
}
