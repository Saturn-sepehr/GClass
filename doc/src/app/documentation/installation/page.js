import { H1, H2, P, Note, Code, ClassRef } from "@/Shared/DocsUI";

export const metadata = { title: "GClass - Installation" };

export default function Page() {
  return (
    <article>
      <H1>Installation</H1>
      <P>
        GClass ships as the npm package <code>gclass-anims</code>. GSAP is a regular
        dependency and is installed automatically - nothing is bundled or
        redistributed.
      </P>
      <Code>{`npm install gclass-anims`}</Code>
      <Note>
        The package ships dual ESM + CJS and is framework-agnostic. It never
        touches your build config: every feature is driven by class names you
        put on markup. ESM is <code>dist/gclass.esm.js</code> and CJS is{" "}
        <code>dist/gclass.cjs</code> via <code>vite.lib.config.js</code>{" "}
        (GSAP is external, not bundled). The build is tree-shakable with{" "}
        <code>sideEffects: false</code> and <code>prepublishOnly: build</code>.
      </Note>

      <H2>Requirements</H2>
      <ClassRef
        rows={[
          ["gsap ^3.15", "Installed automatically as a dependency (package.json:52 gsap ^3.15.0)"],
          ["Node >=16", "Required for build (package.json:56 engines)"],
          ["Modern browser", "Supports ES modules; CJS via require() also available"],
          ["dist/gclass.esm.js", "ESM entry (package.json:7 module, :10 exports import)"],
          ["dist/gclass.cjs", "CJS entry (package.json:6 main, :13 exports require)"],
        ]}
      />
    </article>
  );
}
