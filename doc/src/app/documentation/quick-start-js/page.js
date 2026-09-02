import { H1, H2, P, Note, Code } from "@/Shared/DocsUI";

export const metadata = { title: "GClass - Quick start (Vanilla JS)" };

export default function Page() {
  return (
    <article>
      <H1>Quick start - Vanilla JS</H1>
      <P>
        Framework-agnostic, but this is the zero-framework path. Install the
        package, import <code>initAnimations</code> once the DOM is ready, then
        drive everything with class names - no per-element JS or config.
      </P>
<H2>Usage</H2>
      <Code>{`// ESM (bundler or <script type="module">)
import { initAnimations } from 'gclass-anims'

// wait for DOM if you are not using a bundler entry:
document.addEventListener('DOMContentLoaded', () => {
  initAnimations()
})

// or simply at the end of <body>:
initAnimations()`}</Code>
      <Code>{`<!-- then everything is class-driven -->
<div class="appear scroll spawn-up">reveals on scroll</div>
<div class="float">loops forever</div>
<button class="magnet click-expand">magnet + click</button>`}</Code>

      <H2>What&apos;s next</H2>
      <P>
        See <code>Installation</code> for requirements and <code>Quick start</code>{" "}
        for the class anatomy (<code>.appear</code> / <code>.scroll</code> + behaviour +
        tunables). Framework-specific guides - React, Vue, Svelte, Next.js, Vite -
        are scaffolded alongside this page and will replace their placeholders next.
      </P>
    </article>
  );
}
