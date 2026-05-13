# PachaNova V2 - AI Handover Guide

Welcome, next AI Assistant (Perplexity, Multi-Agent system, etc.). This document serves as the central context file for the **PachaNova v2** project to help you get up to speed quickly with our architecture, current state, and the work done so far.

## 📌 Project Overview
PachaNova v2 is an institutional-grade platform combining real estate tokenization and e-learning/KYC. We have been developing the **"Demo Mirror"** — a high-fidelity business simulation environment used for institutional pitches. It simulates end-to-end flows (KYC, payments, token minting) without touching production assets, using localized databases and sandbox environments.

## 🏗️ Architecture & Tech Stack
This project is built as a **Turborepo Monorepo** with the following stack:
- **Frontend/Framework**: Next.js 15 (App Router), React 19, TypeScript
- **Styling & UI**: Tailwind CSS v4, Framer Motion, Three.js (`@react-three/fiber`)
- **API/Communication**: tRPC
- **Database & ORM**: PostgreSQL, Drizzle ORM
- **Integrations**: MercadoPago (Sandbox currently)
- **Contracts**: Solidity/Foundry (Mocked in the demo via Anvil)
- **Testing**: Playwright (E2E), Vitest (Unit)
- **Package Manager**: pnpm

### 📁 Workspace Structure
- `apps/web`: The main Next.js application frontend and tRPC backend.
- `packages/database`: Drizzle schema, migrations, and seed scripts.
- `packages/config`: Shared configurations (ESLint, TypeScript).
- `packages/contracts`: Smart contracts and Anvil demo integration.
- `packages/integrations`: External API integrations (e.g., MercadoPago).
- `packages/ui`: Shared UI components.

## 🚀 The "Demo Mirror" Environment
The core focus recently has been the **Demo Mirror**. This is a self-contained local environment running via Docker and local Node scripts.
- **Run command**: `pnpm run demo:showcase` (Spins up Postgres in Docker, runs migrations, seeds data, and starts the Next.js dev server).
- **Other demo scripts**: `demo:reset`, `demo:acceptance`, `demo:doctor` are available in `package.json`.
- **Mock Scenarios**: Predefined database states can be loaded via scripts like `pnpm run demo:scenario:rejected-payment` or `demo:scenario:happy`.

## 📜 Historical Reports & Context
We have generated extensive documentation, audits, and checklists during development. To declutter the root, all previous reports have been moved to `docs/reports_history/`. 
**Key Reports to review if needed:**
- `FRONTEND_ECOSYSTEM_COMPLETION_REPORT.md`: Details the UI/UX completeness.
- `BUSINESS_MODEL_DEMO_FLOW_REPORT.md`: Explains the business logic simulated in the demo.
- `MERCADOPAGO_SANDBOX_PREFLIGHT_REPORT.md`: Details the MP sandbox integration.
- `DEMO_ACCEPTANCE_REPORT.md` / `LOCAL_ACCEPTANCE_STABILITY_REPORT.md`: Results of E2E testing.

## 🎯 Current Status
- The Demo Mirror is fully functional.
- The UI features a high-end dark aesthetic with smooth animations and dynamic routing.
- The end-to-end flow from Landing -> KYC -> MercadoPago Mock Payment -> Token Dashboard is implemented.
- The project is ready for institutional demonstration.

## 🛠️ Instructions for Next AI
1. **Understand Constraints**: When modifying the "Demo Mirror", DO NOT use production credentials. Always use `.env.demo.local`.
2. **Commands**: Prefer using `pnpm --filter <workspace> <command>` when targeting specific packages.
3. **Styles**: We use Tailwind CSS v4. Avoid arbitrary values where design tokens can be used.
4. **Continue the flow**: Depending on the user's new prompt, focus on expanding the platform or integrating real services now that the demo is stable.
