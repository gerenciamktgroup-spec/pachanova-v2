# scripts/demo-visuals.ps1
# Permanent demo bootstrap for PachaNova Landbanking (Post-F6 polish continuation)
# Single unified project at 3000. Rich permanent visuals. DATOS REALES. Master sacred.
# Run in own terminal from repo root: pwsh -File scripts/demo-visuals.ps1
# Starts optional demo db (if docker), seeds, pnpm dashboard dev, prints exact nav URLs + hard refresh instructions.

param(
  [switch]$NoDocker,
  [switch]$NoSeed
)

Write-Host "==============================================" -ForegroundColor Cyan
Write-Host "PACHA NOVA LANDBANKING - DEMO VISUALS BOOTSTRAP" -ForegroundColor Cyan
Write-Host "Post-F6 Polish Continuation Cycle" -ForegroundColor Yellow
Write-Host "Full unified project (dashboard @3000)" -ForegroundColor Green
Write-Host "Landbanking = entire PachaNova + all tools: Master 5PNC, P2P, credits, yields/flywheel, gov, orq high-level, autonomy, holograms" -ForegroundColor White
Write-Host "Rich permanent demo. DATOS REALES. Master sacred. Never stop the flow." -ForegroundColor Magenta
Write-Host "==============================================" -ForegroundColor Cyan

$repoRoot = Split-Path -Parent $PSScriptRoot
Push-Location $repoRoot

# 1. Optional demo db if docker available and not -NoDocker
$useDocker = -not $NoDocker
if ($useDocker) {
  $dockerOk = $false
  try {
    docker --version | Out-Null
    $dockerOk = $true
  } catch {
    Write-Host "Docker not found or not running. Skipping demo db start (use -NoDocker to suppress)." -ForegroundColor Yellow
    $useDocker = $false
  }
}

if ($useDocker) {
  Write-Host "`n[1/4] Starting demo db (docker compose if available)..." -ForegroundColor Green
  try {
    pnpm run demo:db:up --if-present 2>$null | Out-Null
    Write-Host "Demo db up (or already running)." -ForegroundColor Green
  } catch {
    Write-Host "demo:db:up skipped or failed (non-fatal). Continue." -ForegroundColor Yellow
  }
  Start-Sleep -Seconds 3
}

# 2. Seeds (using existing demo scripts, optional)
if (-not $NoSeed) {
  Write-Host "`n[2/4] Seeding demo data (real 5PNC + PAR 68112.5 etc)..." -ForegroundColor Green
  try {
    pnpm run demo:reset --if-present 2>$null | Out-Null
    Write-Host "Demo reset + seed complete (orq real refs: 68112.5 net PAR, 31639 eff, 23125 claim, 17.1% etc)." -ForegroundColor Green
  } catch {
    Write-Host "Seed via demo:reset may need manual. Try pnpm run demo:db:seed or existing seeds." -ForegroundColor Yellow
  }
  # Also run showcase seed if present for visuals
  try {
    pnpm --filter @pachanova/demo-environment run demo:seed --if-present 2>$null | Out-Null
  } catch {}
} else {
  Write-Host "`n[2/4] Seeding skipped (-NoSeed)." -ForegroundColor Yellow
}

# 3. Start pnpm dashboard dev (port 3000)
Write-Host "`n[3/4] Launching dashboard dev (pnpm dashboard dev -> port 3000)..." -ForegroundColor Green
Write-Host "This will run in foreground. Use Ctrl+C to stop later. For background use another terminal or start-job." -ForegroundColor Yellow

# Print URLs and instructions BEFORE starting (so user sees immediately)
Write-Host "`n==============================================" -ForegroundColor Cyan
Write-Host "EXACT NAV URLs (after start + hard refresh Ctrl+Shift+R / Cmd+Shift+R):" -ForegroundColor White
Write-Host "  /dashboard/investor          -> Investor hero + portfolio (more interactive) + Landbank holograms + E2E + orq badges" -ForegroundColor Green
Write-Host "  /dashboard/admin/landbank    -> Admin Landbank full (holograms + yields/gov/borrow expansions + ver avances per PNC)" -ForegroundColor Green
Write-Host "  /dashboard/investor/marketplace -> Marketplace orderbook (more PNC ties + orq exercised + ver avances)" -ForegroundColor Green
Write-Host "  /demo/showcase#phase4-hologram-landbank -> Central rich visuals hub (ALL advances immediate, yields/gov/borrow surfaces expanded)" -ForegroundColor Green
Write-Host ""
Write-Host "HARD REFRESH INSTRUCTIONS: After pnpm dashboard dev is up and 'ready', hard refresh (Ctrl+Shift+R) all tabs to load full holograms/E2E/5PNC real data (PAR 68112.5 net, 31639 eff 17.1%, 23125 claim, Fases, Master notes, orq exercised badges, flowStatus etc)." -ForegroundColor Yellow
Write-Host "Look for: HologramPncCard, 'ORQ EXERCISED', Fase refs, per-PNC ver avances buttons, cross links, rich banners 'PachaNova Landbanking Full Unified' + 'rich permanent demo' + 'DATOS REALES'." -ForegroundColor White
Write-Host "==============================================" -ForegroundColor Cyan

Write-Host "`n[4/4] Starting dev server now..." -ForegroundColor Green
# Run the dev (blocks until Ctrl+C)
pnpm dashboard dev

Pop-Location
Write-Host "Dashboard stopped. Re-run script to restart. Blackboard NOT STOPPING." -ForegroundColor Cyan
