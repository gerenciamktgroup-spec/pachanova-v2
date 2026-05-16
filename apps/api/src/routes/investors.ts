import { Hono } from 'hono'
import { db, schema } from '@pachanova/database'
import { eq } from 'drizzle-orm'

export const investors = new Hono()

investors.get('/', async (c) => {
  const allInvestors = await db.query.investors.findMany()
  return c.json(allInvestors)
})

investors.get('/:id', async (c) => {
  const id = c.req.param('id')
  const investor = await db.query.investors.findFirst({
    // @ts-ignore
    where: eq(schema.investors.id, id)
  })
  return c.json(investor || { error: 'Not found' }, investor ? 200 : 404)
})

investors.put('/:id', async (c) => {
  const id = c.req.param('id')
  const body = await c.req.json()
  // @ts-ignore
  const updated = await db.update(schema.investors).set(body).where(eq(schema.investors.id, id)).returning()
  return c.json(updated[0])
})

investors.get('/:id/portfolio', async (c) => {
  const id = c.req.param('id')
  // @ts-ignore
  const balances = await db.query.balances.findMany({ where: eq(schema.balances.investorId, id) })
  return c.json({ balances, tokens: [], roi: 0 })
})
