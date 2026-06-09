"use server";

export async function createP2POrder(propertyId: string, quantity: number, pricePerToken: number) {
  return { success: false, error: "Feature quarantined in MVP" };
}

export async function initiateP2PTrade(orderId: string) {
  return { success: false, error: "Feature quarantined in MVP" };
}

export async function approveP2PTrade(tradeId: string, action: "APPROVED" | "REJECTED" = "APPROVED") {
  return { success: false, error: "Feature quarantined in MVP" };
}
