// sitemap.js - HOW TO REBUILD THIS WITHOUT AI
// ---------------------------------------------------------------------------
// What this file does:
// Next looks for `src/app/sitemap.js` and runs its default export at build
// time. Whatever array you return becomes `sitemap.xml` in the output.
// No sitemap = Google has to guess your URLs via crawling. With a sitemap,
// you tell Google exactly which pages exist and when they changed.
//
// Docs: https://nextjs.org/docs/app/api-reference/file-conventions/metadata/sitemap
// Spec: https://www.sitemaps.org/protocol.html
//
// How to redo it on your next project:
// 1. Create `src/app/sitemap.js` (or `.ts`) and export default function sitemap().
// 2. Return an array of { url, lastModified, changeFrequency, priority }.
// 3. `url` must be absolute (https://...). Next will write `sitemap.xml` for you.
// 4. Run `npm run build` and check `out/sitemap.xml` or `.next/...` to verify.
// 5. Submit the URL `https://yourdomain/sitemap.xml` in Google Search Console.
//
// Why the list below is manual:
// For a docs site with ~30 static routes, a static list is clearer to learn
// than a dynamic fs crawl. When you add a new page (e.g. quick-start-xyz),
// just add its URL here. For larger sites, you can replace the array with
// `fs.readdirSync("src/app/documentation")` logic.
//
// For `output: 'export'` (GitHub Pages), Next requires this line so the
// route can be prerendered at build time. Without it you get
// "export const dynamic = force-static not configured" error.
export const dynamic = "force-static";

export default function sitemap() {
  // Keep this in sync with `metadataBase` in layout.js and `homepage` in
  // package.json. When DEPLOY=1, your site lives at /GClass.
  const base = "https://saturn-sepehr.github.io/GClass";

  // Every route you want Google to index. Keep paths without trailing slash -
  // Next handles the mapping. Add new documentation folders here when you create them.
  const routes = [
    "", // -> https://saturn-sepehr.github.io/GClass/
    "/documentation",
    "/documentation/installation",
    "/documentation/quick-start",
    "/documentation/quick-start-js",
    "/documentation/quick-start-react",
    "/documentation/quick-start-vue",
    "/documentation/quick-start-svelte",
    "/documentation/quick-start-next",
    "/documentation/quick-start-vite",
    "/documentation/quick-start-angular",
    "/documentation/quick-start-nuxt",
    "/documentation/spawn",
    "/documentation/expand",
    "/documentation/clip-curtains",
    "/documentation/typewriter",
    "/documentation/split-text",
    "/documentation/scramble-text",
    "/documentation/counter",
    "/documentation/draw-svg",
    "/documentation/scroll",
    "/documentation/scroll-progress",
    "/documentation/scroll-frame",
    "/documentation/pin",
    "/documentation/parallax",
    "/documentation/progress-bars",
    "/documentation/loops",
    "/documentation/dynamic-elements",
    "/documentation/hover-click",
    "/documentation/magnet",
    "/documentation/css-classes",
    "/documentation/eases",
    "/documentation/defaults",
    "/documentation/custom-anims",
    "/documentation/register-complete",
    "/documentation/on-complete",
    "/documentation/toggle-reduced-motion",
    "/documentation/about",
  ];

  const now = new Date();

  return routes.map((route) => ({
    url: `${base}${route}`,
    lastModified: now,
    // How often this page changes - helps crawlers prioritize
    changeFrequency: route === "" ? "weekly" : "monthly",
    // Priority 0.0-1.0 - homepage is highest
    priority: route === "" ? 1.0 : route.startsWith("/documentation/quick-start") ? 0.9 : 0.7,
  }));
}
