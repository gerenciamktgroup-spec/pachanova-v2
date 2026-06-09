import { Hono } from 'hono'
import { createClient } from '@supabase/supabase-js'

export const webhooks = new Hono()

// Configuración de Supabase (Service Role)
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL || ''
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || ''
const supabase = createClient(supabaseUrl, supabaseKey)

webhooks.post('/liquidation', async (c) => {
  try {
    const body = await c.req.json()
    const { trustId, assetId, totalFiat, successFee, investorPool } = body

    if (!trustId && !assetId) {
      return c.json({ error: 'Missing trustId or assetId' }, 400)
    }

    // Actualizar DB (estado a 'liquidated' o equivalente en tu esquema)
    const { error } = await supabase
      .from('assets')
      .update({ status: 'liquidated' }) // O 'estado' dependiendo de tu DB
      .eq(assetId ? 'id' : 'trust_id', assetId || trustId)

    if (error) throw new Error(`DB Error: ${error.message}`)

    return c.json({ success: true, message: 'Asset marked as liquidated' })
  } catch (error: any) {
    console.error('Error handling webhook:', error)
    return c.json({ error: error.message }, 500)
  }
})
