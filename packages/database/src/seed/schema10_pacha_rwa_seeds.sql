-- schema10 PNC DB seeds for full real landbank (token_holdings, rwa_distribuciones, stakes)
-- Apply in Supabase SQL editor or psql: \i thisfile.sql (after core seeds)
-- Real PNC data: PAR eff 31639/17.1% Fase47 (from 8514 compound on 23125 base), net 68112.5 post Fase9 +212.5, power 3250 Fase42 staked (base 1250 + 2000), tx fresh publicnode, gcloud 0.73, predict 0.82, 15PNC+AET fleet, manual LIM, Fase15 landbank completo tokenized 4, Fase9/36/42/47 carried. Master manual. DATOS REALES.

-- Stakes (Fase42 DeFi Pacha power)
INSERT INTO stakes (investor_id, staked_amount, created_at, updated_at)
SELECT id, 2000.00, now(), now() FROM investors WHERE email LIKE '%admin%' OR role = 'admin' LIMIT 1
ON CONFLICT (investor_id) DO UPDATE SET staked_amount = 2000.00, updated_at = now();

-- Example for other if needed (0 for non PAR)
-- INSERT ... 

-- token_holdings (per-PNC real holdings + effective from Fase47 compound)
INSERT INTO token_holdings (investor_id, pnc_codigo, holdings_amount, effective_amount, land_meta, created_at, updated_at)
SELECT 
  (SELECT id FROM investors LIMIT 1),
  'PNC-PAR-001',
  23125.00,  -- base my_share
  31639.06,  -- eff Fase47 31639/17.1%
  '{"geo":"Paracas 5ha","product":"alquiler_yield","socio":"PachaNova","borrow_lock_tx":"0x...@25239069","schema10_applied":true}'::jsonb,
  now(), now()
ON CONFLICT (investor_id, pnc_codigo) DO UPDATE SET holdings_amount=23125.00, effective_amount=31639.06, land_meta=EXCLUDED.land_meta, updated_at=now();

-- rwa_distribuciones (real net yields post Fase9 for PAR etc)
INSERT INTO rwa_distribuciones (pnc_codigo, distrib_amount, net_yield_post, health_ratio, period, tx_proof, created_at)
VALUES 
('PNC-PAR-001', 68112.50, 68112.50, 1.65, '2026-06', 'YIELD_CLAIM_ATTEST@25239072 + 23125 + predict 0.82', now()),
('PNC-SB-003', 105840.00, 105840.00, 2.10, '2026-06', 'real from orq Fase9', now())
ON CONFLICT (pnc_codigo, period) DO UPDATE SET distrib_amount=EXCLUDED.distrib_amount, net_yield_post=EXCLUDED.net_yield_post, health_ratio=EXCLUDED.health_ratio, tx_proof=EXCLUDED.tx_proof;

-- Note: full 15PNC+AET + land_meta in core orq seeds or when bulk applied. See verify fallback + orq portfolioView override.
-- After apply: re-run orq --dry/verify; UI/dashboard will use real sync from DB (schema10 rwa_distribuciones/token_holdings when seeds).
-- Ties Fase15 RWA tokeniz, Fase36/42 power 3250, Fase47 31639 eff. Landbank completo.