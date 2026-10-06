import { defineConfig } from 'vite'
import path from 'path'

export default defineConfig({
  build: {
    lib: {
      entry: path.resolve(import.meta.dirname, 'index.js'),
      name: 'GClass',
      fileName: (format) => format === 'es' ? 'gclass.esm.js' : 'gclass.cjs',
      formats: ['es', 'cjs'],
    },
    rollupOptions: {
      external: ['gsap', 'gsap/all'],
      output: {
        globals: { gsap: 'gsap' },
        exports: 'named',
      },
    },
    outDir: 'dist',
    emptyOutDir: true,
    // Minified, but with source maps so stack traces still resolve back to
    // the original Listeners.js / Animations.js lines. Safe for this codebase:
    // nothing reflects on `fn.name`, uses eval / new Function, or renames
    // properties - all dynamic access is to element expandos (el._spawnTween,
    // el[key]) and to string-keyed element state, which minifiers never touch.
    // Chosen over leaving dist/ unminified because consumers' own bundlers
    // would minify it anyway; shipping it pre-minified just makes that cheap.
    //
    // `true` rather than 'esbuild': this repo has no direct esbuild dependency
    // (Vite 8 delegates to rolldown), and naming the minifier explicitly makes
    // the build fail with ERR_MODULE_NOT_FOUND on a clean install.
    minify: true,
    sourcemap: true,
  },
})
