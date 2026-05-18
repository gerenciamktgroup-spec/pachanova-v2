import { createClient } from '@supabase/supabase-js'

const url = 'https://wdrhurnbxkhwmqrcbgpu.supabase.co'
const key = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Indkcmh1cm5ieGtod21xcmNiZ3B1Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3ODY0NjU0OCwiZXhwIjoyMDk0MjIyNTQ4fQ.kLneunKOF7gFVy1-klV88o1PY2gzWpimx05IllEP5b0'

async function test() {
  const sbAdmin = createClient(url, key)
  const email = 'diego.ramirez@demo.pachanova.io'
  const { data: userList } = await sbAdmin.auth.admin.listUsers();
  const existingUser = userList?.users?.find(u => u.email === email);
  console.log('User id:', existingUser?.id);

  if (existingUser?.id) {
    const { data: inv } = await sbAdmin.from('investors').select('id').eq('supabase_auth_id', existingUser.id).single();
    console.log('Investor:', inv);
    if (!inv) {
        console.log('Would insert investor');
        const { data: newInv, error } = await sbAdmin.from('investors').insert({
          supabase_auth_id: existingUser.id,
          email,
          first_name: 'Diego',
          last_name: 'Ramírez',
          kyc_status: 'pending',
          is_verified: false
        }).select('id').single();
        console.log('Insert Result:', newInv, error)
    }
  }
}

test()
