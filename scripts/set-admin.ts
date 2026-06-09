import { createClient } from '@supabase/supabase-js'
import * as dotenv from 'dotenv'
import path from 'path'
import { eq } from 'drizzle-orm'
import { getDb, investors } from '../packages/database/src/index.js'

// Load environment variables
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseKey) {
  console.error("❌ Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in .env.local")
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseKey)

async function main() {
  const emailToAdmin = process.argv[2]
  
  if (!emailToAdmin) {
    console.error("⚠️ Usage: pnpm tsx scripts/set-admin.ts <user_email>")
    process.exit(1)
  }

  console.log(`Buscando usuario con email: ${emailToAdmin}...`)
  
  try {
    // 1. Obtener usuario de Auth
    const { data: { users: authUsers }, error: authError } = await supabase.auth.admin.listUsers()
    
    if (authError) throw authError
    
    const user = authUsers.find(u => u.email === emailToAdmin)
    
    if (!user) {
      console.error(`❌ Usuario no encontrado en Supabase Auth con el correo: ${emailToAdmin}`)
      process.exit(1)
    }

    console.log(`✅ Usuario encontrado en Auth: ${user.id}`)

    // 2. Actualizar app_metadata en Auth
    const currentMetadata = user.app_metadata || {}
    const { error: updateError } = await supabase.auth.admin.updateUserById(user.id, {
      app_metadata: { ...currentMetadata, role: 'admin' }
    })

    if (updateError) throw updateError
    console.log(`✅ app_metadata.role actualizado a 'admin' en Supabase Auth`)

    // 3. Actualizar tabla public.users (si existe)
    try {
      const db = getDb()
      await db.update(investors)
        .set({ role: 'admin' })
        .where(eq(investors.supabaseAuthId, user.id))
      console.log(`✅ Rol actualizado a 'admin' en tabla public.users`)
    } catch (dbError: any) {
      console.warn(`⚠️ No se pudo actualizar public.users, es posible que no tenga registro aún: ${dbError.message}`)
    }

    console.log(`🎉 ¡Éxito! El usuario ${emailToAdmin} ahora tiene permisos de Administrador.`)
    console.log(`Inicia sesión nuevamente en la aplicación para aplicar los cambios.`)

  } catch (err: any) {
    console.error("❌ Ocurrió un error:", err.message)
  }
}

main()
