import { Hono } from 'hono'
import { cors } from 'hono/cors'
import { handle } from 'hono/vercel'
import { investors } from './routes/investors'
import { properties } from './routes/properties'

export const config = { runtime: 'nodejs' }

const app = new Hono().basePath('/')

// CORS
app.use('*', cors({
  origin: [
    'http://localhost:3000',
    'http://localhost:3002',
    'https://pachanova-v2.vercel.app',
    'https://pachanova-v2-git-main-gerenciamktgroup-7296s-projects.vercel.app'
  ],
  allowMethods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
}))

// Auth middleware
app.use('/api/*', async (c, next) => {
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY
  if (!serviceRoleKey || serviceRoleKey.startsWith('[')) {
    console.warn('⚠️  SUPABASE_SERVICE_ROLE_KEY no configurada — auth desactivada')
    return next()
  }
  const authHeader = c.req.header('Authorization')
  if (!authHeader || authHeader !== `Bearer ${serviceRoleKey}`) {
    return c.json({ error: 'Unauthorized' }, 401)
  }
  return next()
})

app.route('/api/investors', investors)
app.route('/api/properties', properties)

app.get('/', (c) => c.json({
  status: 'ok',
  message: 'PachaNova API is running!',
  ts: new Date().toISOString()
}))

app.get('/health', (c) => c.json({ status: 'healthy' }))

// Export para Vercel serverless (ESM)
export default handle(app)
