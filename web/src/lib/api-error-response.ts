import { NextResponse } from "next/server";

export function jsonError(error: unknown, status = 503) {
  const message = error instanceof Error ? error.message : "Server error";
  return NextResponse.json({ error: message }, { status });
}
