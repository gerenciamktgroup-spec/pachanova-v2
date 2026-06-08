import { RouteBreadcrumbs } from "@/components/mission";
import SettingsClient from "./SettingsClient";
import { getDb, schema } from "@pachanova/database";
import { createServerClient } from "@/utils/supabase/server";
import { eq } from "drizzle-orm";
import { redirect } from "next/navigation";

export const dynamic = 'force-dynamic';

export default async function SettingsPage() {
  const supabase = await createServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    redirect('/auth/login');
  }

  const db = getDb();
  const [dbUser] = await db.select().from(schema.users).where(eq(schema.users.supabaseAuthId, user.id));

  return (
    <div className="space-y-6">
      <RouteBreadcrumbs items={[
        { label: 'Inversor' }, 
        { label: 'Perfil y Preferencias' }
      ]} />
      
      <div className="bg-[#0a111f] min-h-screen text-white rounded-2xl border border-white/10 p-6 md:p-8 relative overflow-hidden">
        {/* Futuristic Background accents */}
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#c5a46d]/5 rounded-full blur-3xl pointer-events-none -mr-40 -mt-40"></div>
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-[#c5a46d]/5 rounded-full blur-3xl pointer-events-none -ml-40 -mb-40"></div>

        <div className="mb-8 relative z-10">
          <h2 className="text-2xl font-semibold tracking-tight text-[#c5a46d] mb-1">Tu Perfil</h2>
          <p className="text-sm text-white/50">Gestiona tus datos personales, preferencias de notificaciones y seguridad (2FA).</p>
        </div>

        <div className="relative z-10">
          <SettingsClient user={dbUser || { email: user.email }} />
        </div>
      </div>
    </div>
  );
}
