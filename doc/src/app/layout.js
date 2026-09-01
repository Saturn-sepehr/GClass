import Header from "@/Shared/Header";
import Display from "@/Shared/Display";
import "./globals.css";
import AnimInit from "@/Shared/animInit";
import Boot from "@/Shared/Boot";

// --- SEO: HOW THIS WORKS (read this to redo it without AI) ---
// Next.js App Router reads the exported `metadata` object below and turns it
// into <title>, <meta name="description">, Open Graph tags, etc. in the
// final HTML. No extra library needed.
// Docs: https://nextjs.org/docs/app/api-reference/functions/generate-metadata
// Docs: https://nextjs.org/docs/app/api-reference/file-conventions/metadata
//
// 1. `metadataBase` tells Next how to resolve relative URLs (important when
//    you deploy under a subpath like /GClass on GitHub Pages).
// 2. `title.template` lets child pages do `export const metadata = { title: "X" }`
//    and get "X | GClass" automatically.
// 3. `openGraph` / `twitter` power the preview cards when you share the link.
// 4. You can test the result after `npm run build` by opening `out/index.html`
//    and checking <head> for <meta> tags.

export const metadata = {
  // Base URL for all relative metadata URLs. Keep in sync with
  // package.json homepage and next.config.mjs basePath.
  metadataBase: new URL("https://saturn-sepehr.github.io/GClass"),

  // Fallback title if a page does not export its own `metadata.title`
  title: {
    default: "GClass - GSAP utility library",
    template: "%s | GClass",
  },

  description:
    "GClass (gclass-anims) - a Tailwind-style utility layer on top of GSAP. Class-driven animations for vanilla JS, React, Vue, Svelte, Next.js, Nuxt, Angular and Vite.",

  // Shown in browser tab / bookmarks if no page title
  applicationName: "GClass",

  // Helps Google understand authorship
  authors: [{ name: "Saturn-sepehr", url: "https://github.com/Saturn-sepehr" }],
  creator: "Saturn-sepehr",

  // Keywords are less important for Google now, but still used by some crawlers
  keywords: [
    "gsap",
    "gsap animations",
    "scrolltrigger",
    "tailwind gsap",
    "gclass-anims",
    "animation library",
    "react gsap",
    "vue gsap",
    "svelte gsap",
  ],

  // Open Graph (Facebook, Discord, LinkedIn previews)
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://saturn-sepehr.github.io/GClass/",
    title: "GClass - GSAP utility library",
    description:
      "A Tailwind-style utility layer on top of GSAP. Add a class, get an animation - no config.",
    siteName: "GClass",
  },

  // Twitter / X card
  twitter: {
    card: "summary_large_image",
    title: "GClass - GSAP utility library",
    description:
      "A Tailwind-style utility layer on top of GSAP. Class-driven animations for any bundler.",
  },

  // Tells crawlers this site may be indexed (you can change to noindex while in beta if you want)
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="antialiased">
      <body className="bg-slate-950">
       
        <AnimInit />
        <Display>
          <Header />
          {children}
        </Display>
      </body>
    </html>
  );
}
