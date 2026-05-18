import { Hono } from 'hono'
import { getDb, schema } from '@pachanova/database'
import { eq } from 'drizzle-orm'

export const investors = new Hono()

investors.get('/', async (c) => {
  try {
    const rows = await getDb().query.investors.findMany()
    return c.json(rows)
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e)
    console.error('[GET /api/investors]', msg)
    return c.json({ error: msg }, 500)
  }
})

investors.get('/:id', async (c) => {
  try {
    const row = await getDb().query.investors.findFirst({
      where: eq(schema.investors.id, c.req.param('id'))
    })
    return c.json(row ?? { error: 'Not found' }, row ? 200 : 404)
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e)
    return c.json({ error: msg }, 500)
  }
})

investors.put('/:id', async (c) => {
  try {
    const body = await c.req.json()
    const rows = await getDb().update(schema.investors)
      .set(body).where(eq(schema.investors.id, c.req.param('id'))).returning()
    return c.json(rows[0] ?? { error: 'Not found' }, rows.length ? 200 : 404)
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e)
    return c.json({ error: msg }, 500)
  }
})
