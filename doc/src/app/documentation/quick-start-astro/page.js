import { H1, H2, P, Note, Code } from "@/Shared/DocsUI";

export const metadata = { title: "GClass - Quick start (Astro)" };

export default function Page() {
  return (
    <article>
      <H1>Quick start - Astro</H1>
      <P>
        Astro ships zero JS by default — an island without{" "}
        <code>client:*</code> never hydrates, so <code>initAnimations()</code>{" "}
        never runs. Add <code>client:load</code> (or <code>client:visible</code>) to
        any island that contains <code>.spawn-*</code>/<code>.scroll</code> classes and
        re-init on <code>astro:after-swap</code> for View Transitions.
      </P>
      <Note>
        Without <code>client:load</code> the classes render but stay inert — expected.
      </Note>
<H2>Usage - Layout with View Transitions</H2>
      <Code>{`---
// src/layouts/Base.astro
---
<html>
  <head><meta charset="utf-8" /></head>
  <body>
    <slot />
    <script>
      import { initAnimations } from 'gclass-anims'
      initAnimations()
      document.addEventListener('astro:after-swap', () => initAnimations())
    </script>
  </body>
</html>`}</Code>

      <H2>Usage - Island</H2>
      <Code>{`---
// src/components/Counter.jsx (any framework island)
---
<div class="appear scroll spawn-up">hello astro</div>

---
// src/pages/index.astro
import Counter from '../components/Counter.jsx'
---
<Counter client:load />
<!-- client:visible works too — animation starts when island scrolls into view -->`}</Code>

      <H2>Gotcha - no client directive</H2>
      <P>
        If you put <code>.spawn-up</code> directly in <code>index.astro</code> (no island), Astro renders it statically. Wrap it in an island with <code>client:load</code> or add a page-level <code>client:load</code> script that calls <code>initAnimations()</code> after hydration.
      </P>
    </article>
  );
}
