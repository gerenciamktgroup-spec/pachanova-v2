import { redirect } from "next/navigation";
import { createServerClient } from "@/utils/supabase/server";

type Role = "admin" | "operator" | "investor" | "fiduciario" | "comite" | string;

export async function requireRole(
  allowedRoles: Role[],
  redirectTo = "/unauthorized"
): Promise<{ userId: string; role: Role; email: string }> {
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
