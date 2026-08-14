import { Hono } from 'hono'
import { cors } from 'hono/cors'
import { investors } from './routes/investors'
import { properties } from './routes/properties'

const app = new Hono()
const allowedOrigins = (process.env.CORS_ALLOWED_ORIGINS || 'http://localhost:3000,https://pachanova-v2.vercel.app')
  .split(',')
  .map((origin) => origin.trim())
  .filter(Boolean)

// CORS
app.use('*', cors({
  origin: allowedOrigins,
  allowMethods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
}))

// Middleware de autenticación
app.use('/api/*', async (c, next) => {
  const authHeader = c.req.header('Authorization')
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY

  if (!serviceRoleKey || serviceRoleKey.startsWith('[')) {
    return c.json({ error: 'API authentication is not configured' }, 503)
  }

  if (!authHeader || authHeader !== `Bearer ${serviceRoleKey}`) {
    return c.json({ error: 'Unauthorized: Invalid or missing Service Role Key' }, 401)
  }

  return next()
})

app.route('/api/investors', investors)
app.route('/api/properties', properties)

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
