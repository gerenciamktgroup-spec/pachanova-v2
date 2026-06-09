import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({ error: "Feature quarantined in MVP" }, { status: 403 });
}
