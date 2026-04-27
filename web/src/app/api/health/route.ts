import { NextResponse } from "next/server";
import { getDb } from "@/lib/db";

export const dynamic = "force-dynamic";

/**
 * Liveness + Mongo connectivity (used by Railway healthchecks and ops).
 */
export async function GET() {
  try {
    const db = await getDb();
    await db.command({ ping: 1 });
    return NextResponse.json({
      ok: true,
      mongo: "connected",
      db: db.databaseName,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json(
      { ok: false, mongo: "error", error: message },
      { status: 503 },
    );
  }
}
