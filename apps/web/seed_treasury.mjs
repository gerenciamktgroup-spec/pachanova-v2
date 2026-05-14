import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'
import { resolve } from 'path'

dotenv.config({ path: resolve('.env.local') })

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
)

async function seed() {
  const { error } = await supabase.from('system_parameters').upsert({
    key: 'treasury_balance_usd',
    value: '840.00',
    description: 'Balance actual del fideicomiso en USD'
  }, { onConflict: 'key' })
  
  if (error) {
    console.error('Error seeding treasury:', error)
  } else {
    console.log('Successfully seeded treasury_balance_usd = 840.00')
  }
}

seed()
