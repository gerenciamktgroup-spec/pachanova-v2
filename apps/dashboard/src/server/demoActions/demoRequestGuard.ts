import { timingSafeEqual } from "crypto";

import { assertNoProductionConnection } from "./demoActionGuards";

function matchesToken(provided: string | null, expected: string): boolean {
  if (!provided) return false;
  const providedBuffer = Buffer.from(provided);
  const expectedBuffer = Buffer.from(expected);
  return providedBuffer.length === expectedBuffer.length && timingSafeEqual(providedBuffer, expectedBuffer);
}

export function assertDemoRequest(request: Request, options: { destructive?: boolean } = {}) {
  assertNoProductionConnection();

  if (!options.destructive || process.env.NODE_ENV !== "production") return;

  const expectedToken = process.env.DEMO_ADMIN_TOKEN;
  const authorization = request.headers.get("authorization");
  const providedToken = authorization?.startsWith("Bearer ") ? authorization.slice(7) : null;

  if (!expectedToken || !matchesToken(providedToken, expectedToken)) {
    throw new Error("A valid DEMO_ADMIN_TOKEN is required for destructive demo actions in production");
  }
}
