import { build } from 'esbuild'
import { resolve, dirname } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))

await build({
  entryPoints: [resolve(__dirname, 'src/index.ts')],
  bundle: true,
  platform: 'node',
  target: 'node20',
  format: 'cjs',           // CommonJS - Vercel lo resuelve sin problema con cualquier extension
  outfile: resolve(__dirname, 'api/index.js'),
  external: ['node:*'],    // Solo excluir built-ins de Node, bundlear TODO lo demás
  define: {
    'process.env.NODE_ENV': JSON.stringify('production')
  },
  logLevel: 'info'
})

console.log('✅ Build OK -> api/index.js')
