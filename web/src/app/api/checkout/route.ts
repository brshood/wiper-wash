import { NextResponse } from "next/server";
import { calculatePrice, services } from "@/lib/wiper";

export async function POST(request: Request) {
  const body = (await request.json()) as {
    serviceId?: string;
    polishOptions?: string[];
    subscription?: boolean;
  };

  const amount = body.subscription
    ? services.find((service) => service.id === "monthly")?.price ?? 0
    : calculatePrice(body.serviceId ?? "outer", body.polishOptions?.length ?? 0);

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
