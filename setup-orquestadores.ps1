# Run from project root after cd. Part of Fase 14 autonomous setup.
# scripts/setup-orquestadores.ps1
# Setup Autónomo Orquestadores Reales - Panel Maestro (Aetheris/Copera)
# Genera comandos exactos para .env, secrets, deploys, seed. No modifica secrets.
# Dry-run friendly (guidance only). Seguro, solo imprime.
# Fase 16 note + #9 verify enhancement for exact shares.

Write-Host "=== Setup Autónomo Orquestadores Reales - Panel Maestro (Aetheris/Copera) ===" -ForegroundColor Cyan
Write-Host "Run from project root after cd. Part of Fase 14 autonomous setup. Enhanced for Fase16/Y9 stability." -ForegroundColor Gray
Write-Host ""

# 1. .env
Write-Host "1. Validando .env (VITE_SUPABASE_URL real + ANON_KEY)..." -ForegroundColor Yellow
Write-Host "   (Copia .env.example a .env si falta. Pega URL y anon key reales desde Supabase Dashboard > API.)" -ForegroundColor Gray
Write-Host ""

# 2. SA key
Write-Host "2. Verificando GOOGLE_SERVICE_ACCOUNT_JSON (matriz-orquestador-key.json)..." -ForegroundColor Yellow
Write-Host "   Si existe (en .gitignore): supabase secrets set GOOGLE_SERVICE_ACCOUNT_JSON=\"$(Get-Content matriz-orquestador-key.json -Raw)\"" -ForegroundColor White
Write-Host "   Hint: Genera SA key en gcloud para el matrix-orquestador." -ForegroundColor Gray
Write-Host ""

# 3. OAuth
Write-Host "3. Secrets OAuth2 para Core Auth Gateway..." -ForegroundColor Yellow
Write-Host "   Pasos: gcloud console OAuth client + playground para refresh token. Set secrets GOOGLE_CLIENT_ID etc." -ForegroundColor Gray
Write-Host ""

# 4. Deploys
Write-Host "4. Deploy commands:" -ForegroundColor Yellow
Write-Host "   supabase functions deploy core-auth-gateway --no-verify-jwt" -ForegroundColor White
Write-Host "   supabase functions deploy mail-processor --no-verify-jwt" -ForegroundColor White
Write-Host "   supabase functions deploy google-bridge --no-verify-jwt" -ForegroundColor White
Write-Host ""

# 5. Seed
Write-Host "5. SQL Seed + ADMIN (copia a Supabase SQL Editor):" -ForegroundColor Yellow
Write-Host "   \i supabase/esquemas/06_token_holdings.sql" -ForegroundColor Cyan
Write-Host "   \i supabase/esquemas/07_rwa_distribuciones.sql" -ForegroundColor Cyan
Write-Host "   \i seeds/seed_panel_maestro.sql" -ForegroundColor Cyan
Write-Host "   UPDATE perfiles... SET rol='admin', proyectos_autorizados=... " -ForegroundColor White
Write-Host ""

# 6. Verify
Write-Host "6. Verificación de orquestadores (post secrets + deploys):" -ForegroundColor Yellow
Write-Host "   npm run check-emails (si aplica) o refresca UI health widget." -ForegroundColor Gray
Write-Host ""

Write-Host "=== Fin Setup ===" -ForegroundColor Cyan

# 7. Yield (Fase15/16)
Write-Host ""
Write-Host "7. YIELD & DISTRIBUCIONES RWA (Fase15/16):" -ForegroundColor Yellow
Write-Host "   \i supabase/esquemas/06_token_holdings.sql ; \i supabase/esquemas/07_rwa_distribuciones.sql" -ForegroundColor Cyan
Write-Host "   \i seeds/seed_panel_maestro.sql" -ForegroundColor Cyan
Write-Host "   Ver plan_fase15/16 + #5." -ForegroundColor Gray

# 8. VERIFY Fase16 exact + orquest (#9)
Write-Host ""
Write-Host "8. VERIFY for Fase 16 exact attribution + orquest stability (real data test helper per #9):" -ForegroundColor Yellow
Write-Host "   After seeds + holdings (demo 12.5% on AET-002 185k): expect my_share=23125 exact." -ForegroundColor Gray
Write-Host "   SQL assert example:" -ForegroundColor Gray
Write-Host "   SELECT ... (h.pct_owned/100.0 * d.monto_total) as expected_my_share FROM rwa_distribuciones d JOIN token_holdings h ... WHERE ... 12.5 LIMIT 1;" -ForegroundColor White
Write-Host "   UI check: inversor bar shows exact 23125; distrib 'tu share $23125 (12.5%)'." -ForegroundColor Gray
Write-Host "   Orquest: health widget VERIFICAR + this script. Realtime/declare keep exact." -ForegroundColor Gray
Write-Host "   See #9, plan_fase16, Fase17 for fleet/pachanova." -ForegroundColor Gray

# 8b. Node real-data verify helper (added per #9)
Write-Host "8b. Node verify (after seed + holdings):" -ForegroundColor Yellow
Write-Host "   node scripts/verify-fase16-yield.js" -ForegroundColor White
Write-Host "   (loads .env SUPABASE_*, queries token_holdings + rwa_distribuciones for AET-00x 12.5% case, asserts exact my_share = pct/100 * monto, exit 0/1, fallback note if no holdings). Real data only. See #9." -ForegroundColor Gray

Write-Host ""
Write-Host "=== Script complete (guidance only, DATOS REALES). ===" -ForegroundColor Cyan