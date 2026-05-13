# PachaNova V2.0 Demo Mirror: Operator Runbook

## Overview
This runbook provides the standard operating procedures for deploying, maintaining, and resetting the PachaNova V2.0 Demo Mirror (Sandbox Environment).

## Requirements
- Node.js (v20+)
- pnpm (v9+)
- Docker (for Postgres local database)

## Quick Start Sequence
1. **Database:** `pnpm demo:up` (Starts Postgres on port 5433)
2. **Schema & Seed:** `pnpm demo:reset` (Pushes Drizzle schema and seeds simulated users)
3. **Frontend:** `pnpm dev` (Runs Next.js on port 3000)

## Validating the Environment
Before any demo, run the diagnostic script:
```bash
pnpm demo:doctor
```
This script verifies:
- Docker connectivity (Port 5433)
- Database readiness
- Next.js build integrity
- Safe isolation from production (MercadoPago and Foundry credentials must NOT be active).

## Running Tests
To validate the 75-suite E2E pipeline:
```bash
pnpm test:e2e:demo
```
Expected outcome: 75/75 passed.

## Simulating Real Workflows
To inject state into the system (e.g., approving a user's KYC without an external provider):
1. Navigate to `http://localhost:3000/demo/scenarios`
2. Select the specific scenario (e.g., "Set KYC to Approved")
3. Execute and verify the immediate UI update.
