import { H1, H2, P, Note, Code } from "@/Shared/DocsUI";

export const metadata = { title: "GClass - Quick start (Nuxt)" };

export default function Page() {
  return (
    <article>
      <H1>Quick start - Nuxt</H1>
      <P>
        Framework-agnostic - Nuxt is the Vue meta-framework. Call{" "}
        <code>initAnimations()</code> on the client after mount and again after
        each route change. Use a <code>.client</code> plugin and a route watcher
        in <code>app.vue</code> - same pattern as Vue{" "}
        <code>router.afterEach</code> and Svelte <code>afterNavigate</code>.
      </P>
      <Note>
        Placeholder - Nuxt quick-start is coming soon. Will cover{" "}
        <code>.client</code> plugins, SSR guards, and <code>.preserve</code> for
        layouts.
      </Note>

      <H2>Usage - Client plugin</H2>
      <P>
        Mirrors the verified test in <code>gclass-test-nuxt</code> (
        <code>plugins/gclass.client.ts:1</code>). The <code>.client</code> suffix
        ensures it only runs on the browser; dynamic import keeps GSAP off the
        server bundle.
      </P>
      <Code>{`// plugins/gclass.client.ts
export default defineNuxtPlugin(() => {
  if (import.meta.client) {
    import('gclass-anims').then(({ initAnimations }) => {
      initAnimations()
    })
  }
})`}</Code>

      <H2>Usage - Re-init on route change</H2>
      <P>
        SPA navigation does not reload the page, so re-wire the new DOM. Mirrors
        the verified test in <code>app.vue:4</code> (watch <code>fullPath</code>{" "}
        + <code>nextTick</code>).
      </P>
      <Code>{`// app.vue
<script setup>
const route = useRoute()
watch(() => route.fullPath, async () => {
  if (import.meta.client) {
    await nextTick()
    const { initAnimations } = await import('gclass-anims')
    initAnimations()
  }
})

onMounted(async () => {
  if (import.meta.client) {
    await nextTick()
    const { initAnimations } = await import('gclass-anims')
    initAnimations()
  }
})
</script>

<template>
  <div>
    <NuxtPage />
  </div>
</template>`}</Code>

      <H2>What&apos;s next</H2>
      <P>
        Add classes in SFC templates or <code>pages/*.vue</code> -{" "}
        <code>class="appear scroll spawn-up"</code>,{" "}
        <code>class="float magnet"</code> - no wrapper needed. See{" "}
        <code>quick-start-vue</code> for Composition vs Options API parity and{" "}
        <code>quick-start-js</code> for class anatomy.
      </P>
    </article>
  );
}
