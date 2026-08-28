// robots.js - HOW TO REBUILD THIS WITHOUT AI
// ---------------------------------------------------------------------------
// What this file does:
// Next looks for `src/app/robots.js` and writes `robots.txt` at build time.
// `robots.txt` tells search engine bots which paths they may crawl.
// Without it, bots assume `Allow: /` (everything allowed), but adding it
// explicitly + linking your sitemap makes indexing faster and more reliable.
//
// Docs: https://nextjs.org/docs/app/api-reference/file-conventions/metadata/robots
// Spec: https://developers.google.com/search/docs/crawling-indexing/robots/intro
//
// How to redo it on your next project:
// 1. Create `src/app/robots.js` and export default function robots().
// 2. Return { rules, sitemap }. `rules` is an array of { userAgent, allow/disallow }.
// 3. `sitemap` should be the absolute URL to your sitemap.xml.
// 4. Run `npm run build` and check `out/robots.txt` to verify.
// 5. Test in Google Search Console > Settings > robots.txt Tester.
//
// For `output: 'export'` (GitHub Pages), Next requires this line so the
// route can be prerendered at build time.
export const dynamic = "force-static";

export default function robots() {
  const base = "https://saturn-sepehr.github.io/GClass";

  return {
    rules: {
      // `*` means all bots (Google, Bing, etc.)
      userAgent: "*",
      // Allow everything. To hide a page later, change to `disallow: "/private/"`
      allow: "/",
      // Uncomment to block a section, e.g. disallow: "/documentation/about/"
    },
    // Full URL to the sitemap you defined in `sitemap.js`. Next writes it to
    // `/sitemap.xml` (or `/GClass/sitemap.xml` when basePath is set).
    sitemap: `${base}/sitemap.xml`,
  };
}
