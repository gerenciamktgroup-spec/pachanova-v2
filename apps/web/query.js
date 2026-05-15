const { createClient } = require('@supabase/supabase-js');
const supabase = createClient('https://cndppfspgqomgwixlfkw.supabase.co', 'sb_secret_jVz2Pg52MkC-MXVvCC6Dsw_7Gw7-3IF');

async function run() {
  console.log("--- Usuarios y roles ---");
  const { data: d1, error: e1 } = await supabase.from('investors').select('id, email, role, kyc_status, created_at').order('created_at', { ascending: true });
  if (e1) console.error(e1); else console.table(d1);

  console.log("--- Balances actuales ---");
  const { data: d2, error: e2 } = await supabase.from('balances').select('available_tokens, available_usd, locked_tokens, updated_at, investors(email)');
  if (e2) console.error(e2); else {
    const parsed2 = d2?.map(r => ({ email: r.investors?.email, available_tokens: r.available_tokens, available_usd: r.available_usd, locked_tokens: r.locked_tokens, updated_at: r.updated_at }));
    console.table(parsed2);
  }

  console.log("--- Token ledger (últimas 10 entradas) ---");
  const { data: d3, error: e3 } = await supabase.from('token_ledger').select('investor_id, operation_type, token_amount, usd_amount, created_at').order('created_at', { ascending: false }).limit(10);
  if (e3) console.error(e3); else console.table(d3);

  console.log("--- Órdenes P2P activas ---");
  const { data: d4, error: e4 } = await supabase.from('p2p_orders').select('id, token_amount, price_per_token, status, created_at, seller:seller_id(email), buyer:buyer_id(email)').order('created_at', { ascending: false });
  if (e4) console.error(e4); else {
    const parsed4 = d4?.map(r => ({ id: r.id, seller: r.seller?.email, buyer: r.buyer?.email, token_amount: r.token_amount, price_per_token: r.price_per_token, status: r.status, created_at: r.created_at }));
    console.table(parsed4);
  }

  console.log("--- Audit log (últimas 10 acciones) ---");
  const { data: d5, error: e5 } = await supabase.from('audit_logs').select('actor_email, action_type, entity_type, created_at, metadata').order('created_at', { ascending: false }).limit(10);
  if (e5) console.error(e5); else console.table(d5);
}
run();
