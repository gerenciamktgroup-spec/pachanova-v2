import { Hono } from 'hono'
import { getDb, schema } from '@pachanova/database'
import { eq } from 'drizzle-orm'

export const properties = new Hono()

properties.get('/', async (c) => {
  try {
    const rows = await getDb().query.properties.findMany()
    return c.json(rows)
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e)
    console.error('[GET /api/properties]', msg)
    return c.json({ error: msg }, 500)
  }
})

properties.get('/:id', async (c) => {
  try {
    const row = await getDb().query.properties.findFirst({
      where: eq(schema.properties.id, c.req.param('id'))
    })
    return c.json(row ?? { error: 'Not found' }, row ? 200 : 404)
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e)
    return c.json({ error: msg }, 500)
  }
})
