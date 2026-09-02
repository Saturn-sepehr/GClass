import { H1, H2, P, Note, Code } from "@/Shared/DocsUI";

export const metadata = { title: "GClass - Quick start (Solid)" };

export default function Page() {
  return (
    <article>
      <H1>Quick start - Solid</H1>
      <P>
        Solid has no VDOM — DOM nodes persist via fine-grained signals. Call{" "}
        <code>initAnimations()</code> in <code>onMount</code>. No <code>afterEach</code> needed unless you use <code>@solidjs/router</code> — then re-init on route or reuse the same watcher as Vue.
      </P>
      <Note>
        Verified in <code>gclass-test-solidstart</code> (simplified to <code>vite + vite-plugin-solid</code> SPA — same reactivity as SolidStart 1 Vinxi without the <code>virtual:$vinxi/handler</code> scaffold). Tests <code>Listeners.js:145 isPreserved</code> with never-unmounted nodes.
      </Note>

      <H2>Usage - Solid component</H2>
      <Code>{`import { onMount } from 'solid-js'
import { initAnimations } from 'gclass-anims'

function App() {
  onMount(() => initAnimations())
  return <div class="appear scroll spawn-up">hello solid</div>
}`}</Code>

      <H2>Usage - With router</H2>
      <Code>{`import { Router, Route } from '@solidjs/router'
import { onMount } from 'solid-js'
import { initAnimations } from 'gclass-anims'

function Home() { onMount(() => initAnimations()); return <div class="spawn-up">home</div> }
function About() { onMount(() => initAnimations()); return <div class="spawn-up">about</div> }

export default () => (
  <Router>
    <Route path="/" component={Home} />
    <Route path="/about" component={About} />
  </Router>
)`}</Code>
    </article>
  );
}
