import { Hono } from 'hono'
import { cors } from 'hono/cors'
import { investors } from './routes/investors'
import { properties } from './routes/properties'
import { payments } from './routes/payments'
import { analytics } from './analytics/analytics'
import { kyc } from './routes/kyc'
import { webhooks } from './routes/webhooks'

const app = new Hono()

// CORS
app.use('*', cors({
  origin: ['http://localhost:3000', 'http://localhost:3002', 'https://pachanova-v2.vercel.app'],
  allowMethods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
}))

// Middleware de autenticación
app.use('/api/*', async (c, next) => {
  const authHeader = c.req.header('Authorization')
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY

  if (!serviceRoleKey || serviceRoleKey.startsWith('[')) {
    console.warn('⚠️ SUPABASE_SERVICE_ROLE_KEY no configurada — acceso permitido sin autenticación')
    return next()
  }

  if (!authHeader || authHeader !== `Bearer ${serviceRoleKey}`) {
    return c.json({ error: 'Unauthorized: Invalid or missing Service Role Key' }, 401)
  }

  return next()
})

app.route('/api/investors', investors)
app.route('/api/properties', properties)
app.route('/api/payments', payments)
app.route('/api/analytics', analytics)
app.route('/api/kyc', kyc)
app.route('/api/webhooks', webhooks)

app.get('/', (c) => {
  return c.json({ status: 'ok', message: 'PachaNova API is running!' })
})

// Export para Vercel serverless
export default app
export const GET = app.fetch
export const POST = app.fetch
export const PUT = app.fetch
export const DELETE = app.fetch
export const OPTIONS = app.fetch
