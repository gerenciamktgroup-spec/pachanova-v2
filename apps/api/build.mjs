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
  outfile: resolve(__dirname, 'api/index.mjs'),
  // No externals - bundle todo para que funcione en serverless
  external: [],
  banner: {
    js: `import { createRequire } from 'module'; const require = createRequire(import.meta.url);`
  },
  define: {
    'process.env.NODE_ENV': JSON.stringify('production')
  }
})

console.log('Build completado! -> api/index.mjs')
