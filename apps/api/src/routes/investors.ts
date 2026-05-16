import { Hono } from 'hono'
import { getDb, schema } from '@pachanova/database'
import { eq } from 'drizzle-orm'

export const investors = new Hono()

investors.get('/', async (c) => {
  try {
    const all = await getDb().query.investors.findMany()
    return c.json(all)
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err)
    console.error('[investors GET /]', msg)
    return c.json({ error: msg }, 500)
  }
})

investors.get('/:id', async (c) => {
  try {
    const id = c.req.param('id')
    const investor = await getDb().query.investors.findFirst({
      where: eq(schema.investors.id, id)
    })
    return c.json(investor ?? { error: 'Not found' }, investor ? 200 : 404)
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err)
    console.error('[investors GET /:id]', msg)
    return c.json({ error: msg }, 500)
  }
})

investors.put('/:id', async (c) => {
  try {
    const id = c.req.param('id')
    const body = await c.req.json()
    const updated = await getDb().update(schema.investors)
      .set(body)
      .where(eq(schema.investors.id, id))
      .returning()
    return c.json(updated[0] ?? { error: 'Not found' }, updated.length ? 200 : 404)
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err)
    console.error('[investors PUT /:id]', msg)
    return c.json({ error: msg }, 500)
  }
})
