// Entrypoint para Vercel - convierte IncomingMessage a Web Request
import app from './index.js'
import type { IncomingMessage, ServerResponse } from 'node:http'

export default async function handler(req: IncomingMessage, res: ServerResponse) {
  try {
    const host = req.headers['host'] ?? 'localhost'
    const proto = 'https'
    const url = `${proto}://${host}${req.url ?? '/'}`

    const chunks: Uint8Array[] = []
    for await (const chunk of req) chunks.push(chunk as Uint8Array)
    const body = chunks.length > 0 ? Buffer.concat(chunks) : undefined

    const method = req.method ?? 'GET'
    const hasBody = body && body.length > 0 && !['GET', 'HEAD', 'OPTIONS'].includes(method)

    const webReq = new Request(url, {
      method,
      headers: req.headers as Record<string, string>,
      body: hasBody ? body : undefined,
    })

    const webRes = await app.fetch(webReq)

    res.statusCode = webRes.status
    webRes.headers.forEach((val, key) => res.setHeader(key, val))
    const buf = Buffer.from(await webRes.arrayBuffer())
    res.end(buf)
  } catch (err) {
    console.error('Handler error:', err)
    res.statusCode = 500
    res.setHeader('Content-Type', 'application/json')
    res.end(JSON.stringify({ error: String(err) }))
  }
}
