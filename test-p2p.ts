import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(process.cwd(), 'apps/web/.env.local') });

const sb = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!);

async function test() {
  const sellerInvestorId = 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa';
  const propertyId = '11111111-1111-1111-1111-111111111111';
  const quantity = 1;
  const pricePerToken = 10;
  const totalAmount = quantity * pricePerToken;

  const { data: newOrder, error } = await sb.from('p2p_orders').insert({
    seller_investor_id: sellerInvestorId,
    property_id: propertyId,
    quantity: quantity.toString(),
    price_per_token: pricePerToken.toString(),
    total_amount: totalAmount.toString(),
    status: 'open',
    is_demo: true
  }).select().single();

  console.log("Insert result:", newOrder, error);
}

test();
