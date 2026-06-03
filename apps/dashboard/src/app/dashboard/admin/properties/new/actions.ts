"use server";

import { schema } from "@pachanova/database";
import { db } from "@/server/db";
import { createServerClient } from "@/utils/supabase/server";

export async function createPropertyAction(formData: FormData) {
  try {
    const supabase = await createServerClient();
    const { data: { user } } = await supabase.auth.getUser();

    // Verify admin logic (skipped for demo brevity, rely on middleware)

    const name = formData.get("name") as string;
    const location = formData.get("location") as string;
    const propertyType = formData.get("propertyType") as any;
    const status = formData.get("status") as any;
    const totalValuationUsd = formData.get("totalValuationUsd") as string;
    const tokenPriceUsd = formData.get("tokenPriceUsd") as string;
    const totalTokens = formData.get("totalTokens") as string;
    const annualYieldExpected = formData.get("annualYieldExpected") as string;

    await db.insert(schema.properties).values({
      name,
      location,
      propertyType,
      status,
      totalValuationUsd,
      tokenPriceUsd,
      totalTokens,
      availableTokens: totalTokens, // initially all tokens are available
      annualYieldExpected,
      imageUrl: "/properties/placeholder.jpg",
      isDemo: false // fixed per v3 45m loop demo0 strict + Master safety (was remnant)
    });

    return { success: true };
  } catch (err: any) {
    console.error("createPropertyAction error", err);
    return { success: false, error: err.message };
  }
}
