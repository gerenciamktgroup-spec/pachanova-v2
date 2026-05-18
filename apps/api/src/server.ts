// Entrypoint oficial para Vercel — usa el adaptador nativo de Hono
import { handle } from 'hono/vercel'
import app from './index.js'

export const config = {
  runtime: 'nodejs20.x',
}

export default handle(app)
