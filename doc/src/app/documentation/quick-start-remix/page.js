import { H1, H2, P, Note, Code } from "@/Shared/DocsUI";

export const metadata = { title: "GClass - Quick start (Remix)" };

export default function Page() {
  return (
    <article>
      <H1>Quick start - Remix</H1>
      <P>
        Remix (React Router 7) client navigation does not reload. Re-init on{" "}
        <code>useLocation().pathname</code> change — same as Next App Router{" "}
        <code>usePathname</code> pattern in <code>Shared/animInit.js:6</code>, but{" "}
        <code>vite</code> via <code>@remix-run/dev vite:dev</code> (not Turbopack).
      </P><H2>Usage - Remix root</H2>
      <Code>{`// app/root.tsx
import { Outlet, useLocation } from '@remix-run/react'
import { useEffect } from 'react'
import { initAnimations } from 'gclass-anims'

export default function App() {
  const location = useLocation()
  useEffect(() => { initAnimations() }, [location.pathname])
  useEffect(() => { initAnimations() }, [])
  return <Outlet />
}

// app/routes/_index.tsx
export default function Index() {
  return <div className="appear scroll spawn-up">hello remix</div>
}`}</Code>
    </article>
  );
}
