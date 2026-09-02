import { H1, H2, P, Note, Code } from "@/Shared/DocsUI";

export const metadata = { title: "GClass - Quick start (Qwik)" };

export default function Page() {
  return (
    <article>
      <H1>Quick start - Qwik</H1>
      <P>
        Qwik is resumable — no hydration replay. Use{" "}
        <code>useVisibleTask$</code> (client only), not <code>useTask$</code> (runs on server before DOM is visible, <code>gsap.fromTo</code> gets no rect).
      </P><H2>Usage - Qwik City page</H2>
      <Code>{`import { component$, useVisibleTask$ } from '@builder.io/qwik'
import { initAnimations } from 'gclass-anims'

export default component$(() => {
  useVisibleTask$(() => {
    initAnimations()
  })
  return <div class="appear scroll spawn-up">hello qwik</div>
})`}</Code>

      <H2>Per-page re-init</H2>
      <P>
        Qwik City does not replay root — each route component needs its own{" "}
        <code>useVisibleTask$</code> re-init, same as SvelteKit <code>afterNavigate</code>.
      </P>
      <Code>{`// src/routes/about/index.tsx
import { component$, useVisibleTask$ } from '@builder.io/qwik'
import { initAnimations } from 'gclass-anims'
export default component$(() => {
  useVisibleTask$(() => initAnimations())
  return <div class="spawn-up">about</div>
})`}</Code>
    </article>
  );
}
