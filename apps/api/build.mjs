import { build } from 'esbuild'
import { resolve, dirname } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))

await build({
  entryPoints: [resolve(__dirname, 'src/server.ts')],
  bundle: true,
  platform: 'node',
  target: 'node20',
  format: 'esm',
  outfile: resolve(__dirname, 'api/index.mjs'),
  external: ['node:*'],
  define: {
    'process.env.NODE_ENV': JSON.stringify('production')
  },
  logLevel: 'info'
})

console.log('✅ Build OK -> api/index.mjs')
