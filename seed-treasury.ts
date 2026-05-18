import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(process.cwd(), 'apps/web/.env.local') });

const url = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const key = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const sbAdmin = createClient(url, key);

const TREASURY_ID = '00000000-0000-0000-0000-000000000000';

async function seedTreasury() {
  console.log(`Seeding Treasury UUID: ${TREASURY_ID}...`);
  
  // 1. Ensure Treasury exists in investors
  const { data: existingInv } = await sbAdmin.from('investors').select('id').eq('id', TREASURY_ID).maybeSingle();
  if (!existingInv) {
      console.log("Inserting Treasury into investors...");
      const { error } = await sbAdmin.from('investors').insert({
          id: TREASURY_ID,
          first_name: 'PachaNova',
          last_name: 'Treasury',
          email: 'treasury@pachanova.io',
          role: 'admin',
          is_verified: true,
          kyc_status: 'approved'
      });
      if (error) console.error("Investor insert error:", error);
  }

  // 2. Ensure Treasury exists in balances
  const { data: existing, error: fetchErr } = await sbAdmin
    .from('balances')
    .select('*')
    .eq('investor_id', TREASURY_ID)
    .maybeSingle();
    
  if (fetchErr) console.log("Fetch Error:", fetchErr);

  if (!existing) {
    console.log("Inserting Treasury into balances...");
    const { error: insertErr } = await sbAdmin.from('balances').insert({
        investor_id: TREASURY_ID,
        available_tokens: 500000,
        available_usd: 0,
        locked_tokens: 0,
        locked_usd: 0,
        reserved_tokens: 0
    });
    if (insertErr) console.error("Insert error:", insertErr);
    else console.log("Success!");
  } else {
    console.log("Treasury balance exists. Updating stock to 500,000...");
    await sbAdmin.from('balances').update({ available_tokens: 500000 }).eq('investor_id', TREASURY_ID);
    console.log("Updated!");
  }
}

seedTreasury();
