import { NextResponse } from 'next/server';
import { db } from '@/server/db';
import { schema } from '@pachanova/database';
import { eq, and } from 'drizzle-orm';

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

      // Update balances
      const newAvailableTokens = (availableTokens - colAmount).toString();
      const newLockedTokens = (parseFloat(balanceRecord.lockedTokens || "0") + colAmount).toString();
      const newAvailableUsd = (parseFloat(balanceRecord.availableUsd || "0") + parseFloat(borrowedAmount)).toString();

      await db.update(schema.balances)
        .set({
          availableTokens: newAvailableTokens,
          lockedTokens: newLockedTokens,
          availableUsd: newAvailableUsd,
          lastUpdatedAt: new Date(),
        })
        .where(eq(schema.balances.id, balanceRecord.id));

      // Insert loan
      const [newLoan] = await db.insert(schema.loans)
        .values({
          investorId,
          propertyId,
          collateralAmount: colAmount.toString(),
          collateralValueUsd: collateralValue.toString(),
          borrowedAmount: borrowedAmount.toString(),
          interestRate: "0.0850", // 8.5% APY
          accumulatedInterest: "0.00",
          status: 'active',
        })
        .returning();

      // Log audit
      await db.insert(schema.auditLogs).values({
        action: "DEFI_BORROW",
        userId: investorId,
        metadata: {
          loanId: newLoan.id,
          propertyId,
          collateralAmount: colAmount,
          borrowedAmount,
        },
      });

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

      // Log audit
      await db.insert(schema.auditLogs).values({
        action: "DEFI_REPAY",
        userId: loan.investorId,
        metadata: {
          loanId: loan.id,
          repaidAmount: totalDebt,
        },
      });

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

        await db.update(schema.loans)
          .set({
            collateralValueUsd: newCollateralValue.toFixed(2),
            status: newStatus,
            updatedAt: new Date(),
          })
          .where(eq(schema.loans.id, loan.id));

        // Log audit
        await db.insert(schema.auditLogs).values({
          action: newStatus === 'liquidated' ? "DEFI_LIQUIDATION" : "DEFI_MARGIN_CALL",
          userId: loan.investorId,
          metadata: {
            loanId: loan.id,
            newLtv,
            newCollateralValue,
          },
        });
      }

      return NextResponse.json({ success: true, newPrice });
    }

    return NextResponse.json({ success: false, error: 'Invalid action' }, { status: 400 });
  } catch (error: any) {
    console.error("Error processing borrow action:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
