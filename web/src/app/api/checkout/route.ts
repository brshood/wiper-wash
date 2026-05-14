import { NextResponse } from "next/server";
import { calculatePrice, services } from "@/lib/wiper";

export async function POST(request: Request) {
  const body = (await request.json()) as {
    serviceId?: string;
    subscription?: boolean;
    planId?: string;
  };

  const amount = body.subscription
    ? services.find((service) => service.id === (body.planId ?? "sub-4-row"))?.price ?? 0
    : calculatePrice(body.serviceId ?? "quick-wipe");

  return NextResponse.json({
    provider: "stripe",
    currency: "QAR",
    amount,
    checkoutUrl:
      process.env.STRIPE_SECRET_KEY === undefined
        ? "/book?checkout=demo"
        : "https://checkout.stripe.com/session-placeholder",
    note: "Replace placeholder with a real Stripe Checkout session when live keys are configured.",
  });
}
