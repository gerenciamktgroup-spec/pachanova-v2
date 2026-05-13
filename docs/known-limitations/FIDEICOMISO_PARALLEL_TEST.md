# Known Limitation: Fideicomiso Parallel Test Isolation

## Status
Formal Exception (QA-1.1)

## Issue
The E2E test `FRONT-3E.1 Real DB Workflow Actions E2E (No Mocks) > Fideicomiso Workflows > Real Path: Proponer, Firmar y Ejecutar Simulación` has been formally removed and documented as an exception.

## Root Cause
The test is unstable when executed in a highly parallelized local environment (Playwright using multiple workers). 
Because the Fideicomiso dashboard queries the single active Fideicomiso operation using a global mock approach (`LIMIT 1`), multiple test runners evaluating the "Sign as Admin" or "Sign as Fiduciario" actions collide. This results in PostgreSQL unique constraint violations (multiple signers attempting to sign the exact same operation ID concurrently).

## Mitigation
To fully test the real database flow for Fideicomiso multi-signature, the architecture requires either:
1. True session-based UUID generation for mock operations.
2. Sequential test execution (`--workers=1`) coupled with DB teardown between test hooks, which heavily slows down the CI/CD pipeline.

## Demo/UAT Impact
**None.** The Demo Mirror runs effectively for single presenters or linear UAT sessions. This constraint strictly applies to aggressive automated concurrent bots testing the exact same hardcoded entity.
The simulated mocks (`workflow-actions.spec.ts`) continue to perfectly assert the UI capabilities without interacting with the real database constraints.
