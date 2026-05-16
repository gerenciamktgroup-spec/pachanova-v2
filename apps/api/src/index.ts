import { Hono } from 'hono'
import { cors } from 'hono/cors'
import { investors } from './routes/investors'
import { properties } from './routes/properties'

const app = new Hono()

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

app.get('/health', (c) => {
  const dbUrl = process.env.DATABASE_URL
  const supaUrl = process.env.SUPABASE_URL
  const svcKey = process.env.SUPABASE_SERVICE_ROLE_KEY
  return c.json({
    status: 'ok',
    ts: new Date().toISOString(),
    env: {
      DATABASE_URL: dbUrl ? (dbUrl.includes('[') ? '❌ placeholder' : '✅ ok') : '❌ ausente',
      SUPABASE_URL: supaUrl ? '✅ ok' : '❌ ausente',
      SUPABASE_SERVICE_ROLE_KEY: svcKey && !svcKey.startsWith('[') ? '✅ ok' : '❌ ausente',
    }
  })
})

app.get('/', (c) => c.json({
  status: 'ok',
  message: 'PachaNova API running',
  ts: new Date().toISOString()
}))

export default app
