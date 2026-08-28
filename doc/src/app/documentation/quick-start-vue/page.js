import { H1, H2, P, Note, Code } from "@/Shared/DocsUI";

export const metadata = { title: "GClass - Quick start (Vue)" };

export default function Page() {
  return (
    <article>
      <H1>Quick start - Vue</H1>
      <P>
        Framework-agnostic - just call{" "}
        <code>initAnimations()</code> in <code>onMounted</code> once the DOM is
        present; the engine&apos;s MutationObserver handles subsequent{" "}
        <code>.appear</code> mounts and <code>.scroll</code> triggers.
      </P>
      <Note>
        Placeholder - Vue quick-start is coming soon. Will cover Options API vs
        Composition API and Nuxt notes.
      </Note>

      <H2>Usage - Composition API (SFC)</H2>
      <Code>{`<script setup>
import { onMounted } from 'vue'
import { initAnimations } from 'gclass-anims'

onMounted(() => {
  initAnimations()
})
</script>

<template>
  <div class="appear scroll spawn-up">hello vue</div>
  <button class="magnet click-expand">magnet + click</button>
</template>`}</Code>

      <H2>Options API</H2>
      <Code>{`import { initAnimations } from 'gclass-anims'

export default {
  mounted() {
    initAnimations()
  }
}`}</Code>

      <H2>What&apos;s next</H2>
      <P>
        Class anatomy is the same as vanilla: behaviour (<code>.spawn-up</code>) +
        trigger (<code>.appear</code>, <code>.scroll</code>) + tunables (
        <code>.time-1</code>, <code>.ease-back</code>). See{" "}
        <code>quick-start-js</code> for the full breakdown.
      </P>
    </article>
  );
}
