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
      <Note>
        Placeholder - Vite quick-start is coming soon. Will cover vanilla Vite,
        Vite + React/Vue/Svelte, and HMR notes.
      </Note>

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
        is fully ESM (<code>package.json:5</code>). If you use another bundler,
        the same <code>import {"{ initAnimations }"}</code> entry works -
        Vite-specific guidance here is just for the dev server / HMR setup. Any
        ES-module environment should be compatible.
      </P>
    </article>
  );
}
