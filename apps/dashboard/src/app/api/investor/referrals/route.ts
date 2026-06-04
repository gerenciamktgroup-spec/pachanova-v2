import { NextResponse } from 'next/server';
import { db } from '@/server/db';
import { schema } from '@pachanova/database';
import { eq } from 'drizzle-orm';
import { createServerClient } from '@/utils/supabase/server';

export async function GET(req: Request) {
  try {
    const supabase = await createServerClient();
    const { data: { user } } = await supabase.auth.getUser();
    const userEmail = user?.email || 'investor@pachanova.local';

    const investor = await db.query.investors.findFirst({
      where: eq(schema.investors.email, userEmail),
    });

    if (!investor) {
      return NextResponse.json({ success: false, error: 'Investor not found' }, { status: 404 });
    }

    let gamification = await db.query.gamification.findFirst({
      where: eq(schema.gamification.investorId, investor.id),
    });

    // If investor doesn't have a referral profile yet, create one automatically
    if (!gamification) {
      const randomCode = `PACHA-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;
      const [newGamification] = await db.insert(schema.gamification).values({
        investorId: investor.id,
        referralCode: randomCode,
      }).returning();
      gamification = newGamification;
    }

    // Fetch the list of users this investor has referred
    const referredUsers = await db.query.gamification.findMany({
      where: eq(schema.gamification.referredById, investor.id),
      with: {
        investor: true // assuming relation exists, if not we'll map manually or omit details
      }
    });

    return NextResponse.json({
      success: true,
      profile: gamification,
      referredCount: referredUsers.length,
    });
  } catch (error: any) {
    console.error('[API REFERRALS] GET Error:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { action, referralCode } = body;

    const supabase = await createServerClient();
    const { data: { user } } = await supabase.auth.getUser();
    const userEmail = user?.email || 'investor@pachanova.local';

    const investor = await db.query.investors.findFirst({
      where: eq(schema.investors.email, userEmail),
    });

    if (!investor) {
      return NextResponse.json({ success: false, error: 'Investor not found' }, { status: 404 });
    }

    if (action === 'apply_referral') {
      if (!referralCode) {
        return NextResponse.json({ success: false, error: 'Referral code is required' }, { status: 400 });
      }

      // Find the referrer
      const referrer = await db.query.gamification.findFirst({
        where: eq(schema.gamification.referralCode, referralCode),
      });

      if (!referrer) {
        return NextResponse.json({ success: false, error: 'Código de referido inválido.' }, { status: 404 });
      }

      if (referrer.investorId === investor.id) {
        return NextResponse.json({ success: false, error: 'No puedes usar tu propio código.' }, { status: 400 });
      }

      // Get current user's profile
      let myProfile = await db.query.gamification.findFirst({
        where: eq(schema.gamification.investorId, investor.id),
      });

      if (myProfile && myProfile.referredById) {
        return NextResponse.json({ success: false, error: 'Ya has sido referido por otro usuario.' }, { status: 400 });
      }

      if (!myProfile) {
        const randomCode = `PACHA-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;
        const [newProf] = await db.insert(schema.gamification).values({
          investorId: investor.id,
          referralCode: randomCode,
          referredById: referrer.investorId,
          yieldBoostPct: "0.0050", // Give the new user a 0.5% yield boost for using a code
        }).returning();
        myProfile = newProf;
      } else {
        await db.update(schema.gamification).set({
          referredById: referrer.investorId,
          yieldBoostPct: (parseFloat(myProfile.yieldBoostPct) + 0.0050).toString(),
        }).where(eq(schema.gamification.id, myProfile.id));
      }

      // Reward the referrer
      const newPoints = parseInt(referrer.points) + 1000;
      const newTotalReferrals = parseInt(referrer.totalReferrals) + 1;
      
      let newTier = referrer.currentTier;
      if (newPoints >= 10000) newTier = 'PLATINUM';
      else if (newPoints >= 5000) newTier = 'GOLD';
      else if (newPoints >= 2000) newTier = 'SILVER';

      const newVotingBoost = (parseFloat(referrer.votingBoostPct) + 0.05).toFixed(4); // +5% voting boost per referral

      await db.update(schema.gamification).set({
        points: newPoints.toString(),
        totalReferrals: newTotalReferrals.toString(),
        currentTier: newTier,
        votingBoostPct: newVotingBoost,
      }).where(eq(schema.gamification.id, referrer.id));

      return NextResponse.json({ success: true, message: '¡Código aplicado con éxito! Has recibido un boost de yield.' });
    }

    return NextResponse.json({ success: false, error: 'Invalid action' }, { status: 400 });
  } catch (error: any) {
    console.error('[API REFERRALS] POST Error:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
