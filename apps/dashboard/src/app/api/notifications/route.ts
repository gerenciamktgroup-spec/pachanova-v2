import { NextResponse } from 'next/server';
import { db } from '@/server/db';
import { schema } from '@pachanova/database';
import { eq, and, desc, count } from 'drizzle-orm';
import { createServerClient } from '@/utils/supabase/server';
import { errorMessage } from '@/lib/errors';

async function getInvestorId() {
  if (process.env.DEMO_MODE === 'true') {
    const { cookies } = await import('next/headers');
    const cookieStore = await cookies();
    const demoSessionStr = cookieStore.get("pachanova_demo_session")?.value;
    let email = 'demo.investor.approved@pachanova.local';

    if (demoSessionStr) {
      try {
        const session = JSON.parse(demoSessionStr);
        email = session.email;
      } catch (e) {}
    }

    const investor = await db.query.investors.findFirst({
      where: eq(schema.investors.email, email),
    });
    return investor?.id || null;
  }

  try {
    const supabase = await createServerClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return null;

    const investor = await db.query.investors.findFirst({
      where: eq(schema.investors.supabaseAuthId, user.id),
    });
    return investor?.id || null;
  } catch (error) {
    console.error("Error retrieving user session for notifications:", error);
    return null;
  }
}

export async function GET() {
  try {
    const investorId = await getInvestorId();
    if (!investorId) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const notificationsList = await db.query.notifications.findMany({
      where: eq(schema.notifications.investorId, investorId),
      orderBy: [desc(schema.notifications.createdAt)],
      limit: 20,
    });

    const unreadResult = await db
      .select({ value: count() })
      .from(schema.notifications)
      .where(
        and(
          eq(schema.notifications.investorId, investorId),
          eq(schema.notifications.isRead, false)
        )
      );
    const unreadCount = unreadResult[0]?.value || 0;

    return NextResponse.json({
      success: true,
      notifications: notificationsList,
      unreadCount,
    });
  } catch (error: unknown) {
    return NextResponse.json({ success: false, error: errorMessage(error) }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const investorId = await getInvestorId();
    if (!investorId) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const { action, notificationId } = body;

    if (action === 'mark-read') {
      if (!notificationId) {
        return NextResponse.json({ success: false, error: 'Missing notificationId' }, { status: 400 });
      }

      await db.update(schema.notifications)
        .set({ isRead: true })
        .where(
          and(
            eq(schema.notifications.id, notificationId),
            eq(schema.notifications.investorId, investorId)
          )
        );
      return NextResponse.json({ success: true });
    }

    if (action === 'mark-all-read') {
      await db.update(schema.notifications)
        .set({ isRead: true })
        .where(eq(schema.notifications.investorId, investorId));
      return NextResponse.json({ success: true });
    }

    return NextResponse.json({ success: false, error: 'Invalid action' }, { status: 400 });
  } catch (error: unknown) {
    return NextResponse.json({ success: false, error: errorMessage(error) }, { status: 500 });
  }
}
