import { NextResponse } from "next/server";
import { awardXP } from "@/lib/gamification/engine";
import { z } from "zod";

const schema = z.object({
  userId: z.string().uuid(),
  action: z.string(),
  xp: z.number().int().positive(),
});

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const result = schema.safeParse(body);
    
    if (!result.success) {
      return NextResponse.json({ error: "Invalid data", details: result.error }, { status: 400 });
    }

    const { userId, action, xp } = result.data;
    
    const awardResult = await awardXP(userId, action, xp, { demoMode: true });

    return NextResponse.json({ success: true, ...awardResult });
  } catch (error: any) {
    console.error("[gamification demo api]", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
