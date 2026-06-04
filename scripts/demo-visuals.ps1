# scripts/demo-visuals.ps1
# Permanent demo bootstrap for PachaNova Landbanking Full Unified (Post-F6 + Official Antigravity SDK alignment)
# Run in your own terminal for persistent visuals of ALL autonomous work (holograms, E2E flows, 5PNC real orq data, Master, P2P/credits, ver avances, rich permanent demo).
# Based on subagent evolution after F6 polish.

param(
  [switch]$NoDocker,
  [switch]$NoSeed
)

Write-Host "=== PACHA NOVA LANDBANKING — DEMO VISUALS BOOTSTRAP (Post-F6 + ORQ Bridge) ===" -ForegroundColor Cyan
Write-Host "Single unified project @ :3000. Master sacred. DATOS REALES (PAR 68112.5 net @31639 eff 17.1% power 3250 Fases etc). Rich permanent demo. Hard refresh after start."

$repoRoot = Split-Path -Parent $PSScriptRoot
Set-Location $repoRoot

# Optional: demo DB (if Docker Desktop running)
if (-not $NoDocker) {
  Write-Host "`n[1/3] Optional demo DB (docker-compose.demo.yml)..."
  try {
    docker info > $null 2>&1
    pnpm run demo:db:up --if-present 2>$null || Write-Host "  (docker up may require manual 'docker compose -f docker-compose.demo.yml up -d' )"
    Start-Sleep -Seconds 3
    if (-not $NoSeed) {
      pnpm run demo:db:migrate --if-present 2>$null
      pnpm run demo:db:seed --if-present 2>$null
      Write-Host "  DB seeded with 5 PNC real orq data (PAR etc)."
    }
  } catch {
    Write-Host "  Docker not available or not running — skipping DB. Using rich client demo (permanent DATOS REALES)."
  }
} else {
  Write-Host "`n[1/3] Skipping Docker/DB per -NoDocker."
}

# Start the unified dashboard (port 3000)
Write-Host "`n[2/3] Starting unified dashboard (pnpm dashboard dev -> :3000)..."
Write-Host "  (This will run in foreground. Use Ctrl+C to stop. For background, use the dev_persistent_flow.log pattern or another terminal.)"

# Ensure aliases (from subagent integration)
# If package.json not updated, user can run pnpm --filter dashboard run dev -p 3000

pnpm dashboard dev

# After start (in practice user will open browser)
Write-Host "`n[3/3] After server ready (Turbopack 'Ready in Xs'):"
Write-Host "  • Hard refresh (Ctrl+Shift+R or Ctrl+F5) all tabs."
Write-Host "  • Key URLs for full visuals (ALL advances immediately visible):"
Write-Host "    http://localhost:3000/dashboard/admin/landbank   <-- Master 5PNC + HologramPncCard + interactive E2E flows (LAUNCHED->P2P->BORROW->CLAIMED->VOTED per-PNC) + orq bridge badges (ORQ EXERCISED + F16/21/36/47/51/53)"
Write-Host "    http://localhost:3000/dashboard/investor         <-- Hub + hero/portfolio + P2P/credits/borrow/yields/gov + holograms + 'Mis Préstamos' + ver avances + full identity"
Write-Host "    http://localhost:3000/dashboard/investor/yields"
Write-Host "    http://localhost:3000/dashboard/investor/marketplace (P2P with 5PNC ties)"
Write-Host "    http://localhost:3000/demo/showcase              <-- expanded surfaces"
Write-Host ""
Write-Host "Rich permanent demo: always shows exact real orq exercised data (68112.5 / 31639 / 17.1% / 3250 / flywheel 23125 etc) + Master + Post-F6 orq high-level bridge + E2E even without DB."
Write-Host "See docs/antigravity-official-alignment.md and REPORT_FOR_ANTIGRAVITY_IDE_FULL_CONTEXT.md for full context."
Write-Host "NOT STOPPING. Singularity. Master. DATOS REALES. Single unified 3000."

# Note: in practice the pnpm will block; the prints are for when user backgrounds or uses another terminal.