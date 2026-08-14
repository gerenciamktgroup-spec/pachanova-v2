import { redirect } from "next/navigation";
import { createServerClient } from "@/utils/supabase/server";

type Role = "admin" | "operator" | "investor" | "fiduciario" | "comite" | string;

export async function requireRole(
  allowedRoles: Role[],
  redirectTo = "/unauthorized"
): Promise<{ userId: string; role: Role; email: string }> {
  // DEMO_MODE bypass: verify via session cookie, or default to admin
  if (process.env.DEMO_MODE === 'true') {
    const { cookies } = await import("next/headers");
    const cookieStore = await cookies();
    const demoSessionStr = cookieStore.get("pachanova_demo_session")?.value;

    if (demoSessionStr) {
      try {
        const session = JSON.parse(demoSessionStr);
        if (allowedRoles.includes(session.role)) {
          return {
            userId: "demo-user-" + session.role,
            role: session.role,
            email: session.email,
          };
        } else {
          redirect(redirectTo);
        }
      } catch (e) {
        // Ignore parsing errors
      }
    }

    return {
      userId: "demo-admin-00000000-0000-0000-0000-000000000001",
      role: "admin",
      email: "gerencia.mktgroup@gmail.com",
    };
  }

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
}
