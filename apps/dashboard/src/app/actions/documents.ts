"use server";

export async function signAgreement(supabaseAuthId: string, agreementType: string, documentHash: string = "simulated_hash_123") {
  return { success: false, error: "Feature quarantined in MVP" };
}

export async function getPropertyDocuments(propertyId: string) {
  return { success: false, error: "Feature quarantined in MVP", data: [] };
}
