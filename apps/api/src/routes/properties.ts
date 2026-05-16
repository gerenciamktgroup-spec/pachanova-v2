import { Hono } from 'hono'
import { db, schema } from '@pachanova/database'
import { eq } from 'drizzle-orm'

export const properties = new Hono()

properties.get('/', async (c) => {
  const allProperties = await db.query.properties.findMany()
  return c.json(allProperties)
})

properties.get('/:id', async (c) => {
  const id = c.req.param('id')
  const property = await db.query.properties.findFirst({
    // @ts-ignore
    where: eq(schema.properties.id, id)
  })
  return c.json(property || { error: 'Not found' }, property ? 200 : 404)
})
