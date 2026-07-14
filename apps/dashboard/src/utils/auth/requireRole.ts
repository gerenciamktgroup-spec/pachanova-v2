import { redirect } from "next/navigation";
import { createServerClient } from "@/utils/supabase/server";

type Role = "admin" | "operator" | "investor" | "fiduciario" | "comite" | string;

export async function requireRole(
  allowedRoles: Role[],
  redirectTo = "/unauthorized"
): Promise<{ userId: string; role: Role; email: string }> {
  // DEMO_MODE bypass: return admin role without Supabase verification
  if (process.env.DEMO_MODE === 'true') {
    return {
      userId: "demo-admin-00000000-0000-0000-0000-000000000001",
      role: "admin",
      email: "demo.admin@pachanova.local",
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
