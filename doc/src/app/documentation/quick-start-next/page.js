import { H1, H2, P, Note, Code } from "@/Shared/DocsUI";

export const metadata = { title: "GClass - Quick start (Next.js)" };

export default function Page() {
  return (
    <article>
      <H1>Quick start - Next.js</H1>
      <P>
        The docs site itself is a Next.js App Router app!
        Re-call <code>initAnimations()</code> on <code>pathname</code> changes
        because the root layout persists across route navigations.
      </P>
<H2>Usage - App Router (recommended)</H2>
      <Code>{`// app/layout.js
import AnimInit from '@/Shared/animInit'

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <AnimInit />
        {children}
      </body>
    </html>
  )
}

// Shared/animInit.js
"use client"
import { useEffect } from 'react'
import { usePathname } from 'next/navigation'
import { initAnimations } from 'gclass-anims'

export default function AnimInit() {
  const pathname = usePathname()
  useEffect(() => { initAnimations() }, [pathname])
  return null
}`}</Code>

      <H2>Pages Router</H2>
      <Code>{`// pages/_app.js
import { useEffect } from 'react'
import { useRouter } from 'next/router'
import { initAnimations } from 'gclass-anims'

export default function App({ Component, pageProps }) {
  const { asPath } = useRouter()
  useEffect(() => { initAnimations() }, [asPath])
  return <Component {...pageProps} />
}`}</Code>

      <H2>What&apos;s next</H2>
      <P>
        Mark elements you want to keep across navigations with{" "}
        <code>.preserve</code> (header, nav). All other <code>.appear</code> /
        <code>.scroll</code> elements replay per route.
      </P>
    </article>
  );
}
