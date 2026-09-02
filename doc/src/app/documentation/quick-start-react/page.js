import { H1, H2, P, Note, Code } from "@/Shared/DocsUI";

export const metadata = { title: "GClass - Quick start (React)" };

export default function Page() {
  return (
    <article>
      <H1>Quick start - React</H1>
      <P>
        The library is framework-agnostic - you only need to call{" "}
        <code>initAnimations()</code> once after mount and let the MutationObserver
        pick up <code>.appear</code> / <code>.scroll</code> elements as they render.
      </P>
<H2>Usage - Client component / SPA root</H2>
      <Code>{`import { useEffect } from 'react'
import { initAnimations } from 'gclass-anims'

function App() {
  useEffect(() => {
    initAnimations()
  }, [])

  return (
    <div className="appear scroll spawn-up">
      hello react
    </div>
  )
}`}</Code>

      <H2>Next.js App Router variant</H2>
      <P>
        Call <code>initAnimations()</code> on every <code>pathname</code> change so
        new routes re-wire (see the docs site&apos;s <code>Shared/animInit.js:6</code>).
      </P>
      <Code>{`"use client"
import { useEffect } from 'react'
import { usePathname } from 'next/navigation'
import { initAnimations } from 'gclass-anims'

export default function AnimInit() {
  const pathname = usePathname()
  useEffect(() => { initAnimations() }, [pathname])
  return null
}`}</Code>

      <H2>What&apos;s next</H2>
      <P>
        Once wired, add classes like <code>.spawn-up</code>, <code>.float</code>,{" "}
        <code>.magnet</code> directly to JSX <code>className</code>. No wrapper
        components needed. See <code>quick-start-js</code> for vanilla parity and{" "}
        <code>Toggle &amp; reduced motion</code> for <code>toggleAnimations()</code>.
      </P>
    </article>
  );
}
