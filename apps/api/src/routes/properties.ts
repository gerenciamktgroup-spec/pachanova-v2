import { Hono } from 'hono'
import { db, schema } from '@pachanova/database'
import { eq } from 'drizzle-orm'
import { z } from 'zod'

export const properties = new Hono()
const idSchema = z.string().uuid()

properties.get('/', async (c) => {
  const allProperties = await db.query.properties.findMany()
  return c.json(allProperties)
})

properties.get('/:id', async (c) => {
  const id = c.req.param('id')
  if (!idSchema.safeParse(id).success) return c.json({ error: 'Invalid property id' }, 400)
  const property = await db.query.properties.findFirst({
    where: eq(schema.properties.id, id)
  })
  return c.json(property || { error: 'Not found' }, property ? 200 : 404)
})
