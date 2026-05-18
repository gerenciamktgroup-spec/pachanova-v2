import { handle } from 'hono/vercel'
import app from './index.js'

export const config = {
  runtime: 'nodejs20.x',
}

// Entrypoint para Vercel usando el adaptador oficial de Hono
export default handle(app)
