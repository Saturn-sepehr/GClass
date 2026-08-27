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
        The package is fully ESM and framework-agnostic. It never touches your
        build config: every feature is driven by class names you put on markup.
      </Note>

      <H2>Requirements</H2>
      <ClassRef
        rows={[
          ["gsap ^3.13", "Installed automatically as a dependency"],
          ["Modern browser", "Anything that supports ES modules"],
        ]}
      />
    </article>
  );
}
