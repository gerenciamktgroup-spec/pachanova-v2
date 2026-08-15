import { redirect } from "next/navigation";
import { createServerClient } from "@/utils/supabase/server";

type Role = "admin" | "operator" | "investor" | "fiduciario" | "comite" | string;

export async function requireRole(
  allowedRoles: Role[],
  redirectTo = "/unauthorized"
): Promise<{ userId: string; role: Role; email: string }> {
  // Demo Mode or cloud preview fallback when Supabase is not configured
  const isDemo = process.env.DEMO_MODE === 'true' || !process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL.includes("placeholder");

  if (isDemo) {
    try {
      const { cookies } = await import("next/headers");
      const cookieStore = await cookies();
      const demoSessionStr = cookieStore.get("pachanova_demo_session")?.value;

      if (demoSessionStr) {
        const session = JSON.parse(demoSessionStr);
        if (allowedRoles.includes(session.role)) {
          return {
            userId: "demo-user-" + session.role,
            role: session.role,
            email: session.email,
          };
        }
      }
    } catch {
      // Ignore cookie parsing issues
    }

    const defaultRole = allowedRoles[0] || "investor";
    return {
      userId: "demo-user-" + defaultRole,
      role: defaultRole,
      email: `${defaultRole}@pachanova.local`,
    };
  }

  try {
    const supabase = await createServerClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) redirect("/login");

    const role = user.app_metadata?.role as Role | undefined;

    if (!role || !allowedRoles.includes(role)) {
      redirect(redirectTo);
    }

    return {
      userId: user.id,
      role,
      email: user.email ?? "",
    };
  } catch (err: unknown) {
    if (
      err &&
      typeof err === "object" &&
      "digest" in err &&
      typeof (err as { digest: unknown }).digest === "string" &&
      (err as { digest: string }).digest.startsWith("NEXT_REDIRECT")
    ) {
      throw err;
    }
    // Default fallback
    const defaultRole = allowedRoles[0] || "investor";
    return {
      userId: "demo-user-" + defaultRole,
      role: defaultRole,
      email: `${defaultRole}@pachanova.local`,
    };
  }
}
