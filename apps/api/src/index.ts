import { Hono } from 'hono'
import { cors } from 'hono/cors'

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

// Rutas (import dinámico para que Vercel las resuelva bien)
import('./routes/investors').then(({ investors }) => {
  app.route('/api/investors', investors)
})
import('./routes/properties').then(({ properties }) => {
  app.route('/api/properties', properties)
})

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
