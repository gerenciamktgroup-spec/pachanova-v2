import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(process.cwd(), 'apps/web/.env.local') });

const sb = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!);

async function test() {
  const { data, error } = await sb
    .from('kyc_documents')
    .select(`
      id,
      investor_id,
      document_type,
      file_url,
      status,
      uploaded_at,
      created_at,
      investors!inner(id, first_name, last_name, email)
    `)
    .order('created_at', { ascending: false });
  console.log("KYC:", data, error);
}

test();
