import { H1, H2, P, Note, Code, ClassRef } from "@/Shared/DocsUI";

export const metadata = { title: "GClass - gclassDev" };

export default function Page() {
  return (
    <article>
      <H1>gclassDev</H1>
      <P>
        A styled wrapper around <code>GSDevTools.create()</code> that matches
        the docs palette. It registers <code>GSDevTools</code> via{" "}
        <code>gsap.registerPlugin(GSDevTools)</code> (<code>AnimToggle.js:4</code>) and
        re-exports from <code>index.js:1</code>.
      </P>
      <Code>{`import { gclassDev } from 'gclass-anims'

// defaults - slate-900 bg, slate-700 border, centered
gclassDev()

// CSS string verbatim
gclassDev("width:50%; bottom:30px")

// style object shorthand merged with defaults
gclassDev({ width: "50%", bottom: "30px" })

// full GSDevTools opts, css merged with defaults
gclassDev({ css: { width: "50%" }, animation: tl, minimal: true, id: "my" })
gclassDev({ css: "width:50%;", container: "#dev", animation: tl })`}</Code>

      <H2>Defaults</H2>
      <ClassRef
        rows={[
          ["backgroundColor", "rgba(15,23,42,0.96) slate-900"],
          ["border", "1px solid rgba(51,65,85,0.8) slate-700"],
          ["borderRadius", "12px rounded-xl"],
          ["boxShadow", "0 0 0 1px rgba(51,65,85,0.5), 0 8px 32px rgba(0,0,0,0.45)"],
          ["backdropFilter", "blur(8px)"],
          ["color", "#e2e8f0 slate-200"],
          ["bottom / width / maxWidth / left / transform", "16px / 92% / 860px / 50% / translateX(-50%) centered bottom bar"],
        ]}
      />
      <Note>
        Defined in <code>AnimToggle.js:185 gclassDev(cssOrOpts)</code> and
        typed in <code>index.d.ts:35 gclassDev(cssOrOpts?: string | Record)</code>.
        Returns <code>GSDevTools.create({"{"} css, ...opts {"}"})</code>. Pass{" "}
        <code>animation: tl</code> to control a specific timeline, or call with
        no args to get the global dev tools bar.
      </Note>

      <H2>When to use</H2>
      <P>
        Use during development to scrub and debug GSAP timelines. It is the same{" "}
        <code>GSDevTools</code> from <code>gsap/all</code>, just pre-styled to the
        docs. No extra setup - import and call once after <code>initAnimations()</code>.
      </P>
    </article>
  );
}
