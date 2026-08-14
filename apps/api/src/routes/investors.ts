import { Hono } from 'hono'
import { db, schema } from '@pachanova/database'
import { eq } from 'drizzle-orm'
import { z } from 'zod'

export const investors = new Hono()

const idSchema = z.string().uuid()
const updateInvestorSchema = z.object({
  firstName: z.string().trim().min(1).max(255).optional(),
  lastName: z.string().trim().min(1).max(255).optional(),
  phone: z.string().trim().max(50).nullable().optional(),
  country: z.string().trim().max(100).nullable().optional(),
  documentType: z.string().trim().max(50).nullable().optional(),
  documentNumber: z.string().trim().max(100).nullable().optional(),
  walletAddress: z.string().trim().max(66).nullable().optional(),
  role: z.enum(['investor', 'operator', 'admin', 'fiduciario', 'comite']).optional(),
  kycStatus: z.enum(['pending', 'approved', 'rejected']).optional(),
  isVerified: z.boolean().optional(),
  isAccredited: z.boolean().optional(),
  metadata: z.record(z.string(), z.unknown()).nullable().optional(),
}).strict()

investors.get('/', async (c) => {
  const allInvestors = await db.query.investors.findMany()
  return c.json(allInvestors)
})

investors.get('/:id', async (c) => {
  const id = c.req.param('id')
  if (!idSchema.safeParse(id).success) return c.json({ error: 'Invalid investor id' }, 400)
  const investor = await db.query.investors.findFirst({
    where: eq(schema.investors.id, id)
  })
  return c.json(investor || { error: 'Not found' }, investor ? 200 : 404)
})

investors.put('/:id', async (c) => {
  const id = c.req.param('id')
  if (!idSchema.safeParse(id).success) return c.json({ error: 'Invalid investor id' }, 400)
  const parsed = updateInvestorSchema.safeParse(await c.req.json())
  if (!parsed.success) return c.json({ error: 'Invalid update payload', details: parsed.error.flatten() }, 400)
  const updated = await db.update(schema.investors).set({ ...parsed.data, updatedAt: new Date() }).where(eq(schema.investors.id, id)).returning()
  return updated[0] ? c.json(updated[0]) : c.json({ error: 'Not found' }, 404)
})

investors.get('/:id/portfolio', async (c) => {
  const id = c.req.param('id')
  if (!idSchema.safeParse(id).success) return c.json({ error: 'Invalid investor id' }, 400)
  const balances = await db.query.balances.findMany({ where: eq(schema.balances.investorId, id) })
  return c.json({ balances, tokens: [], roi: 0 })
})
