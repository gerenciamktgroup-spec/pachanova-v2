import { Hono } from 'hono'
import { cors } from 'hono/cors'
import { investors } from './routes/investors.js'
import { properties } from './routes/properties.js'
import { demoRouter } from './routes/demo.js'

const app = new Hono()

// CORS
app.use('*', cors({
  origin: [
    'http://localhost:3000',
    'http://localhost:3002',
    'https://pachanova-v2.vercel.app',
    'https://pachanova-v2-web.vercel.app',
    'https://pachanova-v2-git-main-gerenciamktgroup-7296s-projects.vercel.app'
  ],
  allowMethods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
}))

// Rutas reales (DB)
app.route('/api/investors', investors)
app.route('/api/properties', properties)

// Rutas demo (mock, sin DB)
app.route('/demo', demoRouter)

// Health robusto
app.get('/health', (c) => {
  const envChecks = {
    DATABASE_URL: !!process.env.DATABASE_URL,
    SUPABASE_URL: !!process.env.SUPABASE_URL,
    SUPABASE_SERVICE_ROLE_KEY: !!process.env.SUPABASE_SERVICE_ROLE_KEY,
  }
  const allOk = Object.values(envChecks).every(Boolean)
  return c.json({
    status: allOk ? 'ok' : 'degraded',
    ts: new Date().toISOString(),
    version: '2.0.0',
    env: Object.fromEntries(
      Object.entries(envChecks).map(([k, v]) => [k, v ? '✅' : '❌'])
    )
  }, allOk ? 200 : 200)
})

app.get('/', (c) => c.json({
  status: 'ok',
  message: 'PachaNova API v2',
  ts: new Date().toISOString(),
  endpoints: [
    'GET /health',
    'GET /demo/properties',
    'GET /demo/investors',
    'GET /demo/tokens',
    'GET /demo/orders',
    'POST /demo/kyc',
    'POST /demo/deposit',
    'GET /api/properties',
    'GET /api/investors',
  ]
}))

export default app
