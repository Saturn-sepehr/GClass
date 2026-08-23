/** @type {import('next').NextConfig} */
const nextConfig = {
  reactCompiler: true,
  // GitHub Pages deployment (https://saturn-sepehr.github.io/GClass/):
  // static export + repo subpath. `npm run build` stays a normal build for
  // local dev; the Pages workflow builds with DEPLOY=1.
  ...(process.env.DEPLOY === '1' && {
    output: 'export',
    basePath: '/GClass',
    trailingSlash: true,
  }),
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
