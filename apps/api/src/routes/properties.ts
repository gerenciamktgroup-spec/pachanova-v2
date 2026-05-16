import { Hono } from 'hono'
import { getDb, schema } from '@pachanova/database'
import { eq } from 'drizzle-orm'

export const properties = new Hono()

properties.get('/', async (c) => {
  try {
    const db = getDb()
    const all = await db.query.properties.findMany()
    return c.json(all)
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err)
    console.error('[properties GET /]', msg)
    return c.json({ error: msg }, 500)
  }
})

properties.get('/:id', async (c) => {
  try {
    const db = getDb()
    const id = c.req.param('id')
    const property = await db.query.properties.findFirst({
      where: eq(schema.properties.id, id)
    })
    return c.json(property || { error: 'Not found' }, property ? 200 : 404)
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err)
    console.error('[properties GET /:id]', msg)
    return c.json({ error: msg }, 500)
  }
})
