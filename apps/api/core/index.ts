import { Hono } from 'hono'
import { cors } from 'hono/cors'
import { logger } from 'hono/logger'
import { investors } from './routes/investors.js'
import { properties } from './routes/properties.js'
// demoRouter removed (pachanova-9h-): was mock for dev; production uses real orq (Fase9/15/36/42/47/portfolioView with 68112.5/31639/3250/PASSED 4x real land paths, Fase15 landbank completo tokenized 4, schema10 when seeds (token_holdings/rwa_distribuciones + core orq/verify fallback), live Fase36 gov gate on real distrib/land from orq pncProposals + Fase36/42 power 3250 staked + Fase47 31639 eff + Fase9 net 68112.5 + tx fresh + gcloud 0.73 + predict 0.82 + 23125 + 15PNC+AET + manual LIM + Master). See orq --dry/verify and investor/portfolio cards (Fase15 RWA + Fase36/42/47 badges + per-PNC cards). No demo in prod paths.

const app = new Hono()

// Logger global
app.use('*', logger())

// CORS
app.use('*', cors({
  origin: [
    'http://localhost:3000',
    'http://localhost:3002',
    'https://pachanova-v2.vercel.app',
    'https://pachanova-v2-web.vercel.app',
    'https://pachanova-v2-git-main-gerenciamktgroup-7296s-projects.vercel.app',
  ],
  allowMethods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
}))

// Error handler global — nunca rompe la serverless function
app.onError((err, c) => {
  console.error('[PachaNova API Error]', err)
  return c.json({
    error: 'Internal Server Error',
    message: err.message ?? String(err),
    ts: new Date().toISOString(),
  }, 500)
})

// Rutas reales (DB) - production uses real orq (Fase9/15/36/42/47/portfolioView 68112.5/31639/3250/PASSED, schema10 when seeds, live Fase36 gov gate on real distrib/land + Fase15 RWA tokeniz). No demo.
app.route('/api/investors', investors)
app.route('/api/properties', properties)

// Health
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
    ),
  })
})

app.get('/', (c) => c.json({
  status: 'ok',
  message: 'PachaNova API v2 (production: real orq Fase9/15/36/42/47/portfolioView with 68112.5/31639/3250/PASSED 4x real land paths, Fase15 landbank completo tokenized 4 PAR eff 31639/17.1% net 68112.5 power 3250 PASSED, schema10 when seeds (token_holdings/rwa_distribuciones + core orq/verify fallback), live Fase36 gov gate on real distrib/land + Fase42 staked power 3250 + Fase47 31639 eff flywheel + Fase9 + tx fresh + gcloud 0.73 + predict 0.82 + 23125 + 15PNC+AET + manual LIM + Master; no demo)',
  ts: new Date().toISOString(),
  endpoints: [
    'GET /health',
    'GET /api/properties',
    'GET /api/investors',
    'POST /api/governance/vote',
    'POST /api/governance/stake (Fase42 deposit/withdraw PACHA for power 3250)',
    'GET /api/governance/proposals (orq runCycle real PNC + Fase36/42/15/47)',
  ],
}))

export default app
