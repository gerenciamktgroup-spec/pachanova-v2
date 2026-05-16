import { Hono } from 'hono'
import { cors } from 'hono/cors'
import { handle } from 'hono/vercel'
import { investors } from './routes/investors'
import { properties } from './routes/properties'

export const config = { runtime: 'nodejs' }

const app = new Hono().basePath('/')

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

// Health check con diagnostico completo
app.get('/health', (c) => {
  const dbUrl = process.env.DATABASE_URL
  const supaUrl = process.env.SUPABASE_URL
  const svcKey = process.env.SUPABASE_SERVICE_ROLE_KEY

  return c.json({
    status: 'ok',
    ts: new Date().toISOString(),
    env: {
      DATABASE_URL: dbUrl
        ? (dbUrl.includes('[TU_PASSWORD]') ? '❌ placeholder no configurado' : '✅ configurado')
        : '❌ ausente',
      SUPABASE_URL: supaUrl ? '✅ configurado' : '❌ ausente',
      SUPABASE_SERVICE_ROLE_KEY: svcKey && !svcKey.startsWith('[') ? '✅ configurado' : '❌ ausente o placeholder',
    }
  })
})

app.get('/', (c) => c.json({
  status: 'ok',
  message: 'PachaNova API running',
  ts: new Date().toISOString()
}))

export default handle(app)
