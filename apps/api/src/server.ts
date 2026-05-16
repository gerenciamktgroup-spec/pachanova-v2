import { createAdaptorServer } from '@hono/node-server'
import app from './index'
import type { IncomingMessage, ServerResponse } from 'node:http'

const server = createAdaptorServer({ fetch: app.fetch })

export default function handler(req: IncomingMessage, res: ServerResponse) {
  server.emit('request', req, res)
}
