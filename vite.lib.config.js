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
    minify: false,
  },
})
