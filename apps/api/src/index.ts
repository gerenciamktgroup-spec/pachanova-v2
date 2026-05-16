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
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY
  if (!key || key.startsWith('[')) return next()
  const auth = c.req.header('Authorization')
  if (auth !== `Bearer ${key}`) return c.json({ error: 'Unauthorized' }, 401)
  return next()
})

app.route('/api/investors', investors)
app.route('/api/properties', properties)

app.get('/health', (c) => c.json({
  status: 'ok',
  ts: new Date().toISOString(),
  env: {
    DATABASE_URL: process.env.DATABASE_URL ? '✅' : '❌',
    SUPABASE_URL: process.env.SUPABASE_URL ? '✅' : '❌',
    SUPABASE_SERVICE_ROLE_KEY: process.env.SUPABASE_SERVICE_ROLE_KEY ? '✅' : '❌',
  }
}))

app.get('/', (c) => c.json({ status: 'ok', message: 'PachaNova API', ts: new Date().toISOString() }))

export default app
