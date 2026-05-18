import { build } from 'esbuild'
import { resolve, dirname } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))

await build({
  entryPoints: [resolve(__dirname, 'core/server.ts')],
  bundle: true,
  platform: 'node',
  target: 'node20',
  format: 'esm',
  outfile: resolve(__dirname, 'index.mjs'),
  external: [
    'node:http', 'node:https', 'node:net', 'node:tls', 'node:fs', 'node:path',
    'node:crypto', 'node:stream', 'node:buffer', 'node:url', 'node:util',
    'node:events', 'node:os', 'node:zlib', 'node:child_process'
  ],
  define: { 'process.env.NODE_ENV': JSON.stringify('production') },
  logLevel: 'info',
})

console.log('✅ Build OK -> index.mjs')
