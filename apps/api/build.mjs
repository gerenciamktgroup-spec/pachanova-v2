import { build } from 'esbuild'
import { resolve, dirname } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))

await build({
  entryPoints: [resolve(__dirname, 'src/index.ts')],
  bundle: true,
  platform: 'node',
  target: 'node20',
  format: 'esm',
  outfile: resolve(__dirname, 'dist/index.mjs'),
  external: ['postgres', '@neondatabase/serverless'],
  banner: {
    js: `import { createRequire } from 'module'; const require = createRequire(import.meta.url);`
  }
})

console.log('Build completado!')
