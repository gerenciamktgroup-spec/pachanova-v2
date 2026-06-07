import { NextRequest, NextResponse } from "next/server";
import { db } from "@/server/db";
import { schema } from "@pachanova/database";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  try {
    const isSSE = req.headers.get("accept") === "text/event-stream";

    if (isSSE) {
      // Create a Server-Sent Events stream
      const stream = new ReadableStream({
        async start(controller) {
          const encoder = new TextEncoder();
          
          try {
            // Fetch initial 20 logs
            const logs = await db.query.auditLogs.findMany({
              orderBy: (a, { desc }) => [desc(a.timestamp)],
              limit: 20,
            });

            controller.enqueue(encoder.encode(`data: ${JSON.stringify({ type: 'init', logs })}\n\n`));

            // In a real system, we'd setup a Postgres LISTEN/NOTIFY or similar trigger here.
            // For now, we simulate a small heartbeat before closing the stream
            setTimeout(() => {
               controller.enqueue(encoder.encode(`data: ${JSON.stringify({ type: 'ping' })}\n\n`));
               controller.close();
            }, 5000);

          } catch (e) {
            controller.error(e);
          }
        },
      });

      return new NextResponse(stream, {
        headers: {
          "Content-Type": "text/event-stream",
          "Cache-Control": "no-cache",
          "Connection": "keep-alive",
        },
      });
    }

    // Standard GET response
    const logs = await db.query.auditLogs.findMany({
      orderBy: (a, { desc }) => [desc(a.timestamp)],
      limit: 50,
    });

    const investorsCount = await db.$count(schema.users);
    const propertiesCount = await db.$count(schema.properties);
    const distributionsCount = await db.$count(schema.distributions);

    return NextResponse.json({
      success: true,
      logs,
      stats: {
        investors: investorsCount,
        properties: propertiesCount,
        distributions: distributionsCount,
      }
    });

  } catch (e: any) {
    console.error("[activity GET]", e);
    return NextResponse.json({ success: false, error: e.message }, { status: 500 });
  }
}
