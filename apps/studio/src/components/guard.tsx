import { redirect } from "next/navigation";
import { getSession, homeFor, type Role } from "@/lib/session";
import { Shell } from "./shell";

export async function Guard({ allow, children }: { allow: Role[]; children: React.ReactNode }) {
  const session = await getSession();
  if (!session) redirect("/login");
  if (!allow.includes(session.role) && !(session.role === "operator" && allow.includes("admin"))) {
    redirect(homeFor(session.role));
  }
  return <Shell role={session.role} name={session.name}>{children}</Shell>;
}
