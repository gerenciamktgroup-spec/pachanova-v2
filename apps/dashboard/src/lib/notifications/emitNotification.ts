import { db } from "@/server/db";
import { schema } from "@pachanova/database";

export async function emitNotification({
  investorId,
  type,
  title,
  message,
  actionUrl,
  isDemo = false,
  metadata
}: {
  investorId: string;
  type: "system" | "transaction" | "kyc" | "market" | "dividend";
  title: string;
  message: string;
  actionUrl?: string;
  isDemo?: boolean;
  metadata?: any;
}) {
  try {
    await db.insert(schema.notifications).values({
      investorId,
      type,
      title,
      message,
      actionUrl,
      isDemo,
      metadata: metadata || null,
    });
  } catch (error) {
    console.error("Failed to emit notification:", error);
  }
}
