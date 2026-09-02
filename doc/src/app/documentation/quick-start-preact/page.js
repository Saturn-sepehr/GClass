import { H1, H2, P, Note, Code } from "@/Shared/DocsUI";

export const metadata = { title: "GClass - Quick start (Preact)" };

export default function Page() {
  return (
    <article>
      <H1>Quick start - Preact</H1>
      <P>
        Preact is React-compatible but has no StrictMode double-mount and{" "}
        <code>preact-router</code> has no <code>router.afterEach</code>. Use{" "}
        <code>preact/hooks useEffect</code> + <code>popstate</code> re-init.
      </P>
      <Note>
        Verified in <code>gclass-test-preact</code> (<code>src/main.jsx:9</code>). Compares to <code>dev-react-strict/</code> React 18 — Preact diffs don't double-invoke.
      </Note>

      <H2>Usage - Preact app</H2>
      <Code>{`import { render } from 'preact'
import { useEffect } from 'preact/hooks'
import { initAnimations } from 'gclass-anims'

function Home() {
  useEffect(() => { initAnimations() }, [])
  return <div class="appear scroll spawn-up">hello preact</div>
}

function App() {
  useEffect(() => {
    const onRoute = () => setTimeout(() => initAnimations(), 0)
    window.addEventListener('popstate', onRoute)
    return () => window.removeEventListener('popstate', onRoute)
  }, [])
  return <Home />
}

render(<App />, document.getElementById('app'))`}</Code>

      <H2>With preact-router</H2>
      <Code>{`import Router from 'preact-router'
import { useEffect } from 'preact/hooks'
import { initAnimations } from 'gclass-anims'

function Home() { useEffect(() => initAnimations(), []); return <div class="spawn-up">home</div> }
function About() { useEffect(() => initAnimations(), []); return <div class="spawn-up">about</div> }

export default () => (
  <Router>
    <Home path="/" />
    <About path="/about" />
  </Router>
)`}</Code>
    </article>
  );
}
