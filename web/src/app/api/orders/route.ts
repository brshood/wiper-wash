import { NextResponse } from "next/server";
import { createOrder, listOrders, updateOrderStatus } from "@/lib/store";

export async function GET() {
  const orders = await listOrders();
  return NextResponse.json({ orders });
}

export async function POST(request: Request) {
  const body = (await request.json()) as {
    customer?: string;
    plateNumber?: string;
    service?: string;
    zone?: string;
    day?: string;
    slot?: string;
    amount?: number;
    kind?: "single" | "subscription";
  };
  const order = await createOrder({
    customer: body.customer ?? "New customer",
    plateNumber: body.plateNumber ?? "QTR-00000",
    service: body.service ?? "Outer wash",
    zone: body.zone ?? "West Bay",
    day: body.day ?? "Sunday",
    slot: body.slot ?? "10:00 - 11:00",
    amount: body.amount ?? 0,
    kind: body.kind ?? "single",
  });

  return NextResponse.json({ order }, { status: 201 });
}

export async function PATCH(request: Request) {
  const body = (await request.json()) as {
    id?: string;
    action?: "accept" | "start" | "complete";
  };

  if (!body.id || !body.action) {
    return NextResponse.json({ error: "Missing id or action." }, { status: 400 });
  }

  const statusMap = {
    accept: "assigned",
    start: "in_progress",
    complete: "completed",
  } as const;

  const order = await updateOrderStatus(body.id, statusMap[body.action]);
  if (!order) {
    return NextResponse.json({ error: "Order not found." }, { status: 404 });
  }

  return NextResponse.json({ order });
}
