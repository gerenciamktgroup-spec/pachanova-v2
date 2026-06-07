import { NextResponse } from 'next/server';
import { db } from '@/server/db';
import { schema } from '@pachanova/database';
import { eq, and } from 'drizzle-orm';

// Fase3: Master overrides + landbank net tie for borrow/credits full loop (real paths, 5PNC collateral PAR etc)
async function getBorrowParams() {
  try {
    const ltvParam = await db.query.systemParameters.findFirst({ where: eq(schema.systemParameters.key, 'defi_max_ltv') });
    const rateParam = await db.query.systemParameters.findFirst({ where: eq(schema.systemParameters.key, 'defi_base_interest_rate') });
    const maxLtv = ltvParam ? parseFloat(ltvParam.value) : 0.60;
    const baseRate = rateParam ? parseFloat(rateParam.value) : 0.0850;
    return { maxLtv, baseRate };
  } catch {
    return { maxLtv: 0.60, baseRate: 0.0850 };
  }
}

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const investorId = searchParams.get('investorId');

    if (!investorId) {
      return NextResponse.json({ success: false, error: 'investorId is required' }, { status: 400 });
    }

    // Fetch all active/liquidated/repaid loans for this investor
    const activeLoans = await db.query.loans.findMany({
      where: eq(schema.loans.investorId, investorId),
      orderBy: (loans, { desc }) => [desc(loans.createdAt)],
    });

    // Auto-accrue interest for active loans on fetch (demo; real via orq scheduler in Fase9)
    // Fase3: accrue from landbank net data (PNC-PAR etc collateral) + recalc healthFactor
    for (const loan of activeLoans.filter(l => l.status === 'active')) {
      const now = new Date();
      const last = loan.lastAccruedAt ? new Date(loan.lastAccruedAt) : new Date(loan.createdAt);
      const days = Math.max(0, (now.getTime() - last.getTime()) / (1000*3600*24));
      if (days > 0.01) {
        const rate = parseFloat(loan.interestRate || "0.08");
        const principal = parseFloat(loan.borrowedAmount);
        const add = principal * rate * (days / 365);
        const newAccum = (parseFloat(loan.accumulatedInterest || "0") + add).toFixed(2);

        // landbank net tie for health (fetch prop meta)
        const prop = await db.query.properties.findFirst({ where: eq(schema.properties.id, loan.propertyId) });
        const meta = (prop as any)?.metadata || {};
        const landNet = Number(meta.net || 0);
        const curColVal = parseFloat(loan.collateralValueUsd);
        const curDebt = principal + parseFloat(newAccum);
        let newHealth = curColVal > 0 ? (curColVal / Math.max(curDebt, 0.01)).toFixed(4) : (loan.healthFactor || "1.5000");
        if (landNet > 0) {
          // boost health slightly from positive land net yield backing (high-level Fase9/orq sync)
          newHealth = (parseFloat(newHealth) * (1 + Math.min(landNet / 1000000, 0.05))).toFixed(4);
        }

        await db.update(schema.loans).set({ 
          accumulatedInterest: newAccum, 
          lastAccruedAt: now, 
          updatedAt: now,
          healthFactor: newHealth
        }).where(eq(schema.loans.id, loan.id));
        loan.accumulatedInterest = newAccum;
        (loan as any).healthFactor = newHealth;
      }
    }

    return NextResponse.json({ success: true, loans: activeLoans });
  } catch (error: any) {
    console.error("Error fetching loans:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { action, investorId, propertyId, loanId, collateralAmount, borrowedAmount, dropPercentage } = body;

    if (action === 'borrow') {
      if (!investorId || !propertyId || !collateralAmount || !borrowedAmount) {
        return NextResponse.json({ success: false, error: 'Missing required parameters for borrowing' }, { status: 400 });
      }

      // Check balance
      const balanceRecord = await db.query.balances.findFirst({
        where: and(
          eq(schema.balances.investorId, investorId),
          eq(schema.balances.propertyId, propertyId)
        ),
      });

      if (!balanceRecord) {
        return NextResponse.json({ success: false, error: 'Investor balance record not found' }, { status: 404 });
      }

      const availableTokens = parseFloat(balanceRecord.availableTokens || "0");
      const colAmount = parseFloat(collateralAmount);
      if (availableTokens < colAmount) {
        return NextResponse.json({ success: false, error: 'Insufficient available tokens for collateral' }, { status: 400 });
      }

      // Fetch property to get current price
      const property = await db.query.properties.findFirst({
        where: eq(schema.properties.id, propertyId),
      });

      if (!property) {
        return NextResponse.json({ success: false, error: 'Property not found' }, { status: 404 });
      }

      const tokenPrice = parseFloat(property.tokenPriceUsd || "0");
      const collateralValue = colAmount * tokenPrice;
      const borrowAmt = parseFloat(borrowedAmount);

      // Fase3: respect Master override LTV / rate (from system params + per-PNC property metadata from Master landbank overrides), landbank 5PNC metadata (net from PAR etc for health/accrue)
      const { maxLtv, baseRate } = await getBorrowParams();
      const meta = (property as any).metadata || {};
      const landNet = Number(meta.net || meta.net_yield || 0); // e.g. 68112.5 for PNC-PAR-001 from landbank orq
      const landHealthBase = Number(meta.health || 1.65);
      const perPncLtv = Number(meta.borrow_ltv_override || meta.borrowLtv || maxLtv);
      const effectiveLtv = Math.min( (borrowAmt / Math.max(collateralValue, 0.01)) , perPncLtv );
      const ltvAtBorrow = effectiveLtv;
      // Health factor: collateral / debt (adjusted by land net proxy for dynamic landbank yield backing; >1 safe, ties Fase9 orq)
      const healthFactor = collateralValue > 0 ? (collateralValue / Math.max(borrowAmt, 0.01)).toFixed(4) : "1.5000";
      const usedRate = (meta.borrow_interest_rate || meta.borrowInterestRate || baseRate).toFixed(4);

      // Update balances
      const newAvailableTokens = (availableTokens - colAmount).toString();
      const newLockedTokens = (parseFloat(balanceRecord.lockedTokens || "0") + colAmount).toString();
      const newAvailableUsd = (parseFloat(balanceRecord.availableUsd || "0") + borrowAmt).toString();

      await db.update(schema.balances)
        .set({
          availableTokens: newAvailableTokens,
          lockedTokens: newLockedTokens,
          availableUsd: newAvailableUsd,
          lastUpdatedAt: new Date(),
        })
        .where(eq(schema.balances.id, balanceRecord.id));

      // Insert loan - FULL real loans schema + landbank 5PNC collateral (PAR etc)
      const [newLoan] = await db.insert(schema.loans)
        .values({
          investorId,
          propertyId,
          collateralAmount: colAmount.toString(),
          collateralValueUsd: collateralValue.toString(),
          borrowedAmount: borrowAmt.toString(),
          interestRate: usedRate,
          accumulatedInterest: "0.00",
          ltvAtBorrow: ltvAtBorrow.toFixed(4),
          liquidationThreshold: "0.8500",
          healthFactor,
          lastAccruedAt: new Date(),
          status: 'active',
          manualOverrideNote: meta.manual_override_note || (landNet > 0 ? `Fase3 landbank net ${landNet} (5PNC collateral tie; Master LTV ${ (maxLtv*100).toFixed(0) }%)` : null),
        } as any)
        .returning();

      // Log audit (Fase3 fixed schema: details not metadata)
      await db.insert(schema.auditLogs).values({
        action: "DEFI_BORROW",
        userId: investorId,
        details: JSON.stringify({
          loanId: newLoan.id,
          propertyId,
          collateralAmount: colAmount,
          borrowedAmount,
          fase3: 'landbank-5pnc-real',
        }),
      } as any);

      return NextResponse.json({ success: true, loan: newLoan });
    }

    if (action === 'repay') {
      if (!loanId) {
        return NextResponse.json({ success: false, error: 'loanId is required' }, { status: 400 });
      }

      const loan = await db.query.loans.findFirst({
        where: eq(schema.loans.id, loanId),
      });

      if (!loan || loan.status !== 'active') {
        return NextResponse.json({ success: false, error: 'Active loan not found' }, { status: 404 });
      }

      // Check balance
      const balanceRecord = await db.query.balances.findFirst({
        where: and(
          eq(schema.balances.investorId, loan.investorId),
          eq(schema.balances.propertyId, loan.propertyId)
        ),
      });

      if (!balanceRecord) {
        return NextResponse.json({ success: false, error: 'Investor balance record not found' }, { status: 404 });
      }

      const availableUsd = parseFloat(balanceRecord.availableUsd || "0");
      const totalDebt = parseFloat(loan.borrowedAmount) + parseFloat(loan.accumulatedInterest);

      if (availableUsd < totalDebt) {
        return NextResponse.json({ success: false, error: `Saldo USD insuficiente. Necesitas $${totalDebt.toFixed(2)}` }, { status: 400 });
      }

      // Repay full
      const newAvailableUsd = (availableUsd - totalDebt).toString();
      const colAmount = parseFloat(loan.collateralAmount);
      const newAvailableTokens = (parseFloat(balanceRecord.availableTokens || "0") + colAmount).toString();
      const newLockedTokens = Math.max(0, parseFloat(balanceRecord.lockedTokens || "0") - colAmount).toString();

      // Update balance
      await db.update(schema.balances)
        .set({
          availableUsd: newAvailableUsd,
          availableTokens: newAvailableTokens,
          lockedTokens: newLockedTokens,
          lastUpdatedAt: new Date(),
        })
        .where(eq(schema.balances.id, balanceRecord.id));

      // Update loan status
      const [updatedLoan] = await db.update(schema.loans)
        .set({
          status: 'repaid',
          borrowedAmount: "0.00",
          accumulatedInterest: "0.00",
          updatedAt: new Date(),
        })
        .where(eq(schema.loans.id, loanId))
        .returning();

      // Log audit (Fase3 fixed schema: details not metadata)
      await db.insert(schema.auditLogs).values({
        action: "DEFI_REPAY",
        userId: loan.investorId,
        details: JSON.stringify({
          loanId: loan.id,
          repaidAmount: totalDebt,
          fase3: 'landbank-5pnc-real',
        }),
      } as any);

      return NextResponse.json({ success: true, loan: updatedLoan });
    }

    if (action === 'simulate-drop') {
      if (!propertyId || !dropPercentage) {
        return NextResponse.json({ success: false, error: 'propertyId and dropPercentage are required' }, { status: 400 });
      }

      const property = await db.query.properties.findFirst({
        where: eq(schema.properties.id, propertyId),
      });

      if (!property) {
        return NextResponse.json({ success: false, error: 'Property not found' }, { status: 404 });
      }

      // Calculate new price
      const currentPrice = parseFloat(property.tokenPriceUsd || "0");
      const dropMultiplier = (100 - parseFloat(dropPercentage)) / 100;
      const newPrice = (currentPrice * dropMultiplier).toFixed(2);
      const newTotalValuation = (parseFloat(property.totalValuationUsd || "0") * dropMultiplier).toFixed(2);

      // Update property price
      await db.update(schema.properties)
        .set({
          tokenPriceUsd: newPrice,
          totalValuationUsd: newTotalValuation,
          updatedAt: new Date(),
        })
        .where(eq(schema.properties.id, propertyId));

      // Get all active loans for this property to adjust status
      const affectedLoans = await db.query.loans.findMany({
        where: and(
          eq(schema.loans.propertyId, propertyId),
          eq(schema.loans.status, 'active')
        ),
      });

      for (const loan of affectedLoans) {
        const collateralAmount = parseFloat(loan.collateralAmount);
        const newCollateralValue = collateralAmount * parseFloat(newPrice);
        const borrowed = parseFloat(loan.borrowedAmount);
        const interest = parseFloat(loan.accumulatedInterest);
        const totalDebt = borrowed + interest;

        const newLtv = totalDebt / newCollateralValue;
        let newStatus = 'active';

        if (newLtv >= 0.90) {
          // Liquidate! protocol grabs the tokens
          newStatus = 'liquidated';

          // Update investor balances to deduct locked tokens permanently (already locked, so just keep them locked / protocol claims them)
          const balanceRec = await db.query.balances.findFirst({
            where: and(
              eq(schema.balances.investorId, loan.investorId),
              eq(schema.balances.propertyId, propertyId)
            ),
          });
          if (balanceRec) {
            const currentLocked = parseFloat(balanceRec.lockedTokens || "0");
            const newLocked = Math.max(0, currentLocked - collateralAmount).toString();
            await db.update(schema.balances)
              .set({
                lockedTokens: newLocked,
                lastUpdatedAt: new Date(),
              })
              .where(eq(schema.balances.id, balanceRec.id));
          }
        } else if (newLtv >= 0.80) {
          newStatus = 'under_collateralized';
        }

        // Fase3: recalc health on value change (landbank collateral viz)
        const newDebtForHealth = parseFloat(loan.borrowedAmount) + parseFloat(loan.accumulatedInterest);
        const newHf = newCollateralValue > 0 ? (newCollateralValue / Math.max(newDebtForHealth, 0.01)).toFixed(4) : loan.healthFactor;
        await db.update(schema.loans)
          .set({
            collateralValueUsd: newCollateralValue.toFixed(2),
            status: newStatus,
            healthFactor: newHf,
            updatedAt: new Date(),
          })
          .where(eq(schema.loans.id, loan.id));

        // Log audit (Fase3 fixed schema: details not metadata)
        await db.insert(schema.auditLogs).values({
          action: newStatus === 'liquidated' ? "DEFI_LIQUIDATION" : "DEFI_MARGIN_CALL",
          userId: loan.investorId,
          details: JSON.stringify({
            loanId: loan.id,
            newLtv,
            newCollateralValue,
            fase3: 'landbank-5pnc-real',
          }),
        } as any);
      }

      return NextResponse.json({ success: true, newPrice });
    }

    if (action === 'liquidate') {
      if (!loanId) {
        return NextResponse.json({ success: false, error: 'loanId required for liquidation' }, { status: 400 });
      }
      const loan = await db.query.loans.findFirst({ where: eq(schema.loans.id, loanId) });
      if (!loan || loan.status !== 'active' && loan.status !== 'under_collateralized') {
        return NextResponse.json({ success: false, error: 'Loan not liquidatable' }, { status: 400 });
      }
      const property = await db.query.properties.findFirst({ where: eq(schema.properties.id, loan.propertyId) });
      const tokenPrice = parseFloat(property?.tokenPriceUsd || "0");
      const colAmount = parseFloat(loan.collateralAmount);
      const currentColVal = colAmount * tokenPrice;
      const totalDebt = parseFloat(loan.borrowedAmount) + parseFloat(loan.accumulatedInterest);
      if (currentColVal / totalDebt > parseFloat(loan.liquidationThreshold || "0.85")) {
        return NextResponse.json({ success: false, error: 'Health factor still safe, cannot liquidate' }, { status: 400 });
      }
      // Protocol claims collateral: deduct locked from balance
      const bal = await db.query.balances.findFirst({ where: and(eq(schema.balances.investorId, loan.investorId), eq(schema.balances.propertyId, loan.propertyId)) });
      if (bal) {
        const locked = parseFloat(bal.lockedTokens || "0");
        await db.update(schema.balances).set({ lockedTokens: Math.max(0, locked - colAmount).toString(), lastUpdatedAt: new Date() }).where(eq(schema.balances.id, bal.id));
      }
      await db.update(schema.loans).set({ status: 'liquidated', borrowedAmount: "0", accumulatedInterest: "0", updatedAt: new Date() }).where(eq(schema.loans.id, loanId));
      await db.insert(schema.auditLogs).values({ action: "DEFI_LIQUIDATION_PROTOCOL", userId: loan.investorId, details: JSON.stringify({ loanId, claimedCollateral: colAmount, debt: totalDebt, fase3: 'landbank-5pnc-real' }) } as any);
      return NextResponse.json({ success: true, message: "Loan liquidated. Collateral claimed by protocol." });
    }

    if (action === 'accrue') {
      // Accrue interest for a loan (called on actions or manually). Simple daily pro-rata for demo (Aave style compound on real would use orq scheduler).
      // Fase3: + landbank net data for health recalc + 5PNC
      if (!loanId) return NextResponse.json({ success: false, error: 'loanId required' }, { status: 400 });
      const loan = await db.query.loans.findFirst({ where: eq(schema.loans.id, loanId) });
      if (!loan) return NextResponse.json({ success: false, error: 'Loan not found' }, { status: 404 });
      const now = new Date();
      const last = loan.lastAccruedAt ? new Date(loan.lastAccruedAt) : new Date(loan.createdAt);
      const days = Math.max(0, (now.getTime() - last.getTime()) / (1000*3600*24));
      const rate = parseFloat(loan.interestRate || "0.08");
      const principal = parseFloat(loan.borrowedAmount);
      const addInterest = principal * rate * (days / 365);
      const newAccum = (parseFloat(loan.accumulatedInterest || "0") + addInterest).toFixed(2);

      // landbank net + health update (from PAR 5PNC etc)
      const prop = await db.query.properties.findFirst({ where: eq(schema.properties.id, loan.propertyId) });
      const meta = (prop as any)?.metadata || {};
      const landNet = Number(meta.net || 0);
      const curColVal = parseFloat(loan.collateralValueUsd);
      const curDebt = principal + parseFloat(newAccum);
      let newHealth = curColVal > 0 ? (curColVal / Math.max(curDebt, 0.01)).toFixed(4) : (loan.healthFactor || "1.5000");
      if (landNet > 0) {
        newHealth = (parseFloat(newHealth) * (1 + Math.min(landNet / 1000000, 0.05))).toFixed(4);
      }

      await db.update(schema.loans).set({ 
        accumulatedInterest: newAccum, 
        lastAccruedAt: now, 
        updatedAt: now,
        healthFactor: newHealth
      }).where(eq(schema.loans.id, loanId));
      return NextResponse.json({ success: true, accumulatedInterest: newAccum, daysAccrued: days.toFixed(1), healthFactor: newHealth, landNetUsed: landNet });
    }

    return NextResponse.json({ success: false, error: 'Invalid action' }, { status: 400 });
  } catch (error: any) {
    console.error("Error processing borrow action:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
