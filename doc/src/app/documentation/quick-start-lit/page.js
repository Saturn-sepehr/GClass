import { H1, H2, P, Note, Code } from "@/Shared/DocsUI";

export const metadata = { title: "GClass - Quick start (Lit)" };

export default function Page() {
  return (
    <article>
      <H1>Quick start - Lit</H1>
      <P>
        Lit defaults to Shadow DOM - <code>Listeners.js:101 qAll</code> queries{" "}
        <code>document</code>, not <code>shadowRoot</code>, so classes inside a{" "}
        <code>LitElement</code> template do not animate unless you opt-out or scope.
      </P><H2>Usage - Light DOM (recommended)</H2>
      <Code>{`import { LitElement, html } from 'lit'
import { initAnimations } from 'gclass-anims'

class MyEl extends LitElement {
  createRenderRoot() { return this } // ← opt out of shadow
  firstUpdated() { initAnimations() }
  render() { return html\`<div class="appear scroll spawn-up">hello lit</div>\` }
}
customElements.define('my-el', MyEl)`}</Code>

      <H2>Usage - Keep Shadow DOM</H2>
      <Code>{`import { LitElement, html } from 'lit'
import initListeners from 'gclass-anims/Listeners.js'

class MyEl extends LitElement {
  firstUpdated() {
    // scope to shadowRoot - global initAnimations() misses it
    initListeners(this.shadowRoot)
  }
  render() { return html\`<div class="spawn-up">hello shadow</div>\` }
}
// slotted light-DOM content *does* animate with global initAnimations()
 // <my-el><span class="spawn-up">slotted - works</span></my-el>`}</Code>
    </article>
  );
}
