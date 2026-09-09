import { H1, H2, P, Note, Code } from "@/Shared/DocsUI";

export const metadata = { title: "GClass - Quick start (Vite)" };

export default function Page() {
  return (
    <article>
      <H1>Quick start - Vite</H1>
      <P>
        Vite is a bundler, not a framework - <code>gclass-anims</code> is
        framework-agnostic and works with any Vite template. Import and call{" "}
        <code>initAnimations()</code> once from your entry module.
      </P>
<H2>Usage - Vanilla Vite entry</H2>
      <Code>{`// main.js (Vite entry)
import { initAnimations } from 'gclass-anims'

initAnimations()

// index.html then just uses classes:
 // <div class="appear scroll spawn-up">hello vite</div>`}</Code>

      <H2>Usage - Vite + framework (React / Vue / Svelte)</H2>
      <P>
        Use the same <code>initAnimations()</code> call as the standalone
        framework guide, just imported from the Vite entry or the framework
        root component. For example, Vite + React:
      </P>
      <Code>{`// src/main.jsx
import React, { useEffect } from 'react'
import ReactDOM from 'react-dom/client'
import { initAnimations } from 'gclass-anims'
import App from './App.jsx'

function Root() {
  useEffect(() => { initAnimations() }, [])
  return <App />
}

ReactDOM.createRoot(document.getElementById('root')).render(<Root />)`}</Code>

      <H2>Compatibility</H2>
      <P>
        Works with any bundler (Vite, Webpack, Turbopack, esbuild). The package
        ships dual ESM + CJS (<code>package.json:6 main ./dist/gclass.cjs</code>,{" "}
        <code>:7 module ./dist/gclass.esm.js</code>,{" "}
        <code>:10 exports import/require</code>) built by{" "}
        <code>vite.lib.config.js</code> (formats es + cjs, external gsap). It
        is tree-shakable with <code>sideEffects: false</code> and{" "}
        <code>prepublishOnly: build</code>. If you use another bundler, the
        same <code>import {"{ initAnimations }"}</code> entry works - for CJS
        use <code>require(&apos;gclass-anims&apos;)</code> or{" "}
        <code>require(&apos;gclass-anims/dist/gclass.cjs&apos;)</code>.
        Vite-specific guidance here is just for the dev server / HMR setup. Any
        ES-module or CJS environment should be compatible.
      </P>
    </article>
  );
}
