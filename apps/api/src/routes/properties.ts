import { Hono } from 'hono'
import { db, schema } from '@pachanova/database'
import { eq } from 'drizzle-orm'

export const properties = new Hono()

properties.get('/', async (c) => {
  const allProps = await db.query.properties.findMany()
  return c.json(allProps)
})

properties.get('/:id', async (c) => {
  const id = c.req.param('id')
  const property = await db.query.properties.findFirst({
    where: eq(schema.properties.id, id)
  })
  return c.json(property || { error: 'Not found' }, property ? 200 : 404)
})

properties.get('/:id/investors', async (c) => {
  const id = c.req.param('id')
  const txs = await db.query.transactions.findMany({ where: eq(schema.transactions.propertyId, id) })
  return c.json({ investors: txs.map(t => t.senderId) })
})
