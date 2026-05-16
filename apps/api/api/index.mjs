import { createAdaptorServer } from '@hono/node-server'
import app from '../src/index.ts'

const handler = createAdaptorServer({ fetch: app.fetch })
export default handler
