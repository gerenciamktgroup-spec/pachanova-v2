import { serve } from '@hono/node-server'
import { Hono } from 'hono'
import { cors } from 'hono/cors'
import { config } from 'dotenv'

// Cargar variables de entorno
config({ path: process.env.NODE_ENV === 'production' ? '.env.production' : '.env.demo' })

async function bootstrap() {
  const { investors } = await import('./routes/investors')
  const { properties } = await import('./routes/properties')

  const app = new Hono()

  // CORS para permitir requests desde web y dashboard
  app.use('*', cors({
    origin: ['http://localhost:3000', 'http://localhost:3002'],
    allowMethods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
  }))

  // Middleware de autenticación: valida Service Role Key en rutas /api/*
  app.use('/api/*', async (c, next) => {
    const authHeader = c.req.header('Authorization')
    const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY

    // En desarrollo/demo sin SERVICE_ROLE_KEY configurado, permitir acceso
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

  app.get('/', (c) => {
    return c.text('PachaNova API is running!')
  })

  const port = process.env.PORT ? parseInt(process.env.PORT) : 3001
  console.log(`Server is running on port ${port}`)

  serve({
    fetch: app.fetch,
    port
  })
}

bootstrap()
