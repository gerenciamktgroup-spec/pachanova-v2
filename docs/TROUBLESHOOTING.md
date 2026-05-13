# PachaNova V2.0 Troubleshooting Guide

## Known Issues & Resolutions

### 1. `EADDRINUSE: address already in use :::3000` (or 3004 / 3006)
**Cause:** A zombie Node.js process is occupying the required port for the Next.js server or Playwright webServer.
**Resolution:**
```bash
# Windows (PowerShell)
netstat -ano | findstr :3004
taskkill /PID <PID> /F
```

### 2. E2E Tests failing due to `element(s) not found` (Timeout)
**Cause:** The UI rendering changed, or the component requires horizontal scrolling to be visible (e.g. `JourneyProgressRail`). Or, the backend database requires a reset because state from previous tests is persisting and altering the UI flow.
**Resolution:**
- Run `pnpm demo:reset` to re-seed the local Postgres database.
- Re-run the tests. Ensure that the Next.js production build is fresh (`pnpm build`).

### 3. Database `invalid input syntax for type uuid`
**Cause:** Hardcoded fallback values like `"demo-investor-123"` were passed to the Postgres database instead of valid UUIDs during API routes.
**Resolution:**
- Use a mock valid UUID like `"00000000-0000-0000-0000-000000000000"` for local demo simulations, or explicitly generate UUIDs dynamically when injecting test cases.

### 4. Docker Postgres Connection Refused
**Cause:** Docker daemon is not running, or the port 5433 mapping failed.
**Resolution:**
- Ensure Docker Desktop is running.
- Run `docker ps` to verify `pachanova-demo-postgres` is active. If not, `pnpm demo:up`.
