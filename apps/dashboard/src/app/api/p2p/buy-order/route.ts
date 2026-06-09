import { NextResponse } from "next/server";

export async function POST() {
  return NextResponse.json({ error: "Feature quarantined in MVP" }, { status: 403 });
}
