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
      scheduledDate?: string;
      planId?: string;
    };
    const planId = body.planId === "sub-8-pool" ? "sub-8-pool" : "sub-4-row";
    const plan = services.find((service) => service.id === planId && service.kind === "subscription");
    const amount = plan?.price ?? 0;
    const visitCount = planId === "sub-8-pool" ? 8 : 4;
    const { subscription, generatedOrders } = await createSubscription({
      customer: body.customer ?? "guest",
      plateNumber: body.plateNumber ?? "QTR-00000",
      weekday: body.weekday ?? "Sunday",
      slot: body.slot ?? "15:00 - 16:00",
      zone: body.zone ?? "West Bay",
      amount,
      scheduledDate: body.scheduledDate,
      visitCount,
      packageLabelEn: plan?.label.en ?? planId,
    });

    return NextResponse.json(
      {
        subscription: {
          ...subscription,
          service: plan?.label.en,
          billingCycle: "period",
          planId,
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
