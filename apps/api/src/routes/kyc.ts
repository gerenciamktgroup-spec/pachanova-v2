import { Hono } from 'hono'
import { createClient } from '@supabase/supabase-js'
import { ethers } from 'ethers'

export const kyc = new Hono()

// Configuración de Supabase (Service Role)
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL || ''
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || ''
const supabase = createClient(supabaseUrl, supabaseKey)

kyc.post('/approve-kyc', async (c) => {
  try {
    const body = await c.req.json()
    const { userId, smartWalletAddress } = body

    if (!userId || !smartWalletAddress) {
      return c.json({ error: 'Missing userId or smartWalletAddress' }, 400)
    }

    // 1. Actualizar DB relacional
    const { error: dbError } = await supabase
      .from('users_identity')
      .update({ kyc_status: 'approved' })
      .eq('user_id', userId)

    if (dbError) throw new Error(`DB Error: ${dbError.message}`)

    // 2. Conectar a Blockchain (Service Role) para el estándar ERC-3643
    const privateKey = process.env.ADMIN_PRIVATE_KEY
    const rpcUrl = process.env.RPC_URL || 'http://127.0.0.1:8545'
    const registryAddress = process.env.IDENTITY_REGISTRY_ADDRESS

    if (privateKey && registryAddress) {
      const provider = new ethers.JsonRpcProvider(rpcUrl)
      const wallet = new ethers.Wallet(privateKey, provider)
      
      const abi = ['function setVerified(address _wallet, bool _status) external']
      const registryContract = new ethers.Contract(registryAddress, abi, wallet)

      const tx = await registryContract.setVerified(smartWalletAddress, true)
      await tx.wait()
    } else {
      console.warn('Blockchain env vars missing. DB updated, but smart contract call skipped.')
    }

    return c.json({ success: true, message: 'KYC approved and synced on-chain' })
  } catch (error: any) {
    console.error('Error approving KYC:', error)
    return c.json({ error: error.message }, 500)
  }
})
