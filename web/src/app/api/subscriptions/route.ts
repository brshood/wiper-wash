import { NextResponse } from "next/server";
import { jsonError } from "@/lib/api-error-response";
import { services } from "@/lib/wiper";
import { createSubscription, listSubscriptions } from "@/lib/store";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const subscriptions = await listSubscriptions();
    return NextResponse.json({ subscriptions });
  } catch (error) {
    return jsonError(error);
  }
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as {
      customer?: string;
      plateNumber?: string;
      weekday?: string;
      slot?: string;
      zone?: string;
    };
    const monthly = services.find((service) => service.id === "monthly");
    const amount = monthly?.price ?? 0;
    const { subscription, generatedOrders } = await createSubscription({
      customer: body.customer ?? "guest",
      plateNumber: body.plateNumber ?? "QTR-00000",
      weekday: body.weekday ?? "Sunday",
      slot: body.slot ?? "10:00 - 11:00",
      zone: body.zone ?? "West Bay",
      amount,
    });

    return NextResponse.json(
      {
        subscription: {
          ...subscription,
          service: monthly?.label.en,
          billingCycle: "monthly",
          refundPolicy: "admin_manual_only",
        },
        generatedOrders,
      },
      { status: 201 },
    );
  } catch (error) {
    return jsonError(error);
  }
}
