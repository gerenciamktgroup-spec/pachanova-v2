import { db } from "@/server/db";
import { schema } from "@pachanova/database";
import { eq, and, sql } from "drizzle-orm";
import { emitNotification } from "@/lib/notifications/emitNotification";

export interface CollateralLoanEstimate {
  collateralPachaAmount: number;
  oraclePricePerTokenUsd: number;
  totalCollateralValueUsd: number;
  maxBorrowUsd: number; // 60% LTV
  annualInterestRatePct: number; // 8% APY
  estimatedMonthlyInterestUsd: number;
}

export const LTV_MAX_RATIO = 0.60; // 60%
export const ANNUAL_INTEREST_RATE = 0.08; // 8%

export function calculateCollateralLoanEstimate(
  pachaAmount: number,
  oraclePriceUsd: number = 8.40
): CollateralLoanEstimate {
  const totalValue = pachaAmount * oraclePriceUsd;
  const maxBorrow = totalValue * LTV_MAX_RATIO;
  const annualInterest = maxBorrow * ANNUAL_INTEREST_RATE;
  const monthlyInterest = annualInterest / 12;

  return {
    collateralPachaAmount: pachaAmount,
    oraclePricePerTokenUsd: oraclePriceUsd,
    totalCollateralValueUsd: Number(totalValue.toFixed(2)),
    maxBorrowUsd: Number(maxBorrow.toFixed(2)),
    annualInterestRatePct: 8.0,
    estimatedMonthlyInterestUsd: Number(monthlyInterest.toFixed(2)),
  };
}

/**
 * Execute Borrowing: Lock tokens, credit USD, create loan position
 */
export async function executeBorrowPosition({
  investorId,
  pachaAmount,
  borrowUsd,
  propertyId,
  isDemo = true,
}: {
  investorId: string;
  pachaAmount: number;
  borrowUsd: number;
  propertyId?: string;
  isDemo?: boolean;
}) {
  return await db.transaction(async (tx) => {
    // 1. Verify investor balance
    const balance = await tx.query.balances.findFirst({
      where: eq(schema.balances.investorId, investorId),
    });

    if (!balance || Number(balance.availableTokens) < pachaAmount) {
      throw new Error(`Tokens PACHA insuficientes para hipotecar. Disponibles: ${balance?.availableTokens || 0}`);
    }

    // 2. Lock collateral tokens, credit borrowed USD
    await tx.update(schema.balances)
      .set({
        availableTokens: sql`${schema.balances.availableTokens} - ${pachaAmount}`,
        lockedTokens: sql`${schema.balances.lockedTokens} + ${pachaAmount}`,
        availableUsd: sql`${schema.balances.availableUsd} + ${borrowUsd}`,
        lastUpdatedAt: new Date(),
      })
      .where(eq(schema.balances.investorId, investorId));

    // 3. Create Loan Record
    const [newLoan] = await tx.insert(schema.collateralLoans).values({
      investorId,
      propertyId: propertyId || null,
      collateralPachaAmount: pachaAmount.toString(),
      principalBorrowedUsd: borrowUsd.toString(),
      interestRateBps: 800,
      accruedInterestUsd: "0",
      ltvPercent: "60.00",
      status: "active",
      isDemo,
      dueAt: new Date(Date.now() + 180 * 24 * 60 * 60 * 1000), // 6 months term
    }).returning();

    // 4. Audit & Ledger Logs
    await tx.insert(schema.auditLogs).values({
      action: "COLLATERAL_LOAN_ORIGINATED",
      details: `Investor ${investorId} borrowed $${borrowUsd} USD against ${pachaAmount} PACHA tokens collateral (LTV 60%)`,
    });

    await emitNotification({
      investorId,
      type: "transaction",
      title: "Préstamo con Garantía Aprobado",
      message: `Has obtenido $${borrowUsd} USD de liquidez inmediata hipotecando ${pachaAmount} fracciones PACHA.`,
      isDemo,
    });

    return newLoan;
  });
}

/**
 * Repay Loan: Debit USD (principal + interest), unlock tokens
 */
export async function executeRepayLoan({
  loanId,
  investorId,
  isDemo = true,
}: {
  loanId: string;
  investorId: string;
  isDemo?: boolean;
}) {
  return await db.transaction(async (tx) => {
    const loan = await tx.query.collateralLoans.findFirst({
      where: and(
        eq(schema.collateralLoans.id, loanId),
        eq(schema.collateralLoans.investorId, investorId),
        eq(schema.collateralLoans.status, "active")
      ),
    });

    if (!loan) {
      throw new Error("Préstamo activo no encontrado");
    }

    const principal = Number(loan.principalBorrowedUsd);
    const durationDays = (Date.now() - new Date(loan.createdAt).getTime()) / (1000 * 60 * 60 * 24);
    const accruedInterest = principal * ANNUAL_INTEREST_RATE * (durationDays / 365);
    const totalRepay = Number((principal + accruedInterest).toFixed(2));
    const collateralPacha = Number(loan.collateralPachaAmount);

    const balance = await tx.query.balances.findFirst({
      where: eq(schema.balances.investorId, investorId),
    });

    if (!balance || Number(balance.availableUsd) < totalRepay) {
      throw new Error(`Saldo USD insuficiente para pagar el préstamo ($${totalRepay} USD requeridos)`);
    }

    // Debit USD, unlock tokens
    await tx.update(schema.balances)
      .set({
        availableUsd: sql`${schema.balances.availableUsd} - ${totalRepay}`,
        lockedTokens: sql`${schema.balances.lockedTokens} - ${collateralPacha}`,
        availableTokens: sql`${schema.balances.availableTokens} + ${collateralPacha}`,
        lastUpdatedAt: new Date(),
      })
      .where(eq(schema.balances.investorId, investorId));

    // Update loan status
    await tx.update(schema.collateralLoans)
      .set({
        status: "repaid",
        accruedInterestUsd: accruedInterest.toFixed(2),
        repaidAt: new Date(),
        updatedAt: new Date(),
      })
      .where(eq(schema.collateralLoans.id, loanId));

    await tx.insert(schema.auditLogs).values({
      action: "COLLATERAL_LOAN_REPAID",
      details: `Loan ${loanId} repaid ($${totalRepay} USD). ${collateralPacha} PACHA unlocked for investor ${investorId}.`,
    });

    await emitNotification({
      investorId,
      type: "transaction",
      title: "Hipotéca de Tokens Amortizada",
      message: `Préstamo cancelado exitosamente. Tus ${collateralPacha} fracciones PACHA han sido desbloqueadas.`,
      isDemo,
    });

    return { success: true, repaidAmount: totalRepay, unlockedPacha: collateralPacha };
  });
}
