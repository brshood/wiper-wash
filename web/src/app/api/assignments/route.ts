import { NextResponse } from "next/server";
import { assignWorker, workers } from "@/lib/wiper";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const zone = searchParams.get("zone") ?? "West Bay";
  const worker = assignWorker(zone);

  return NextResponse.json({
    strategy: ["same_zone", "lowest_active_jobs", "highest_rating"],
    fallback: "unassigned_admin_queue",
    requestedZone: zone,
    worker,
    availableWorkers: workers,
  });
}
