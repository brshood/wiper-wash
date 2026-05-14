import { NextResponse } from "next/server";
import { jsonError } from "@/lib/api-error-response";
import { createInquiry, listInquiries, type InquiryRecord } from "@/lib/store";

export const dynamic = "force-dynamic";

async function notifyAdminWebhook(inquiry: InquiryRecord) {
  const url = process.env.ADMIN_WEBHOOK_URL?.trim();
  if (!url) return;
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 12_000);
  try {
    await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        type: "wiper_inquiry",
        id: inquiry.id,
        name: inquiry.name,
        phone: inquiry.phone,
        message: inquiry.message,
        createdAt: inquiry.createdAt,
      }),
      signal: controller.signal,
    });
  } catch (error) {
    console.warn("[wiper] ADMIN_WEBHOOK_URL notify failed:", error);
  } finally {
    clearTimeout(timer);
  }
}

export async function GET() {
  try {
    const inquiries = await listInquiries();
    return NextResponse.json({ inquiries });
  } catch (error) {
    return jsonError(error);
  }
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as {
      name?: string;
      phone?: string;
      message?: string;
    };

    if (!body.phone?.trim() || !body.message?.trim()) {
      return NextResponse.json({ error: "Phone and message are required." }, { status: 400 });
    }

    const inquiry = await createInquiry({
      name: body.name ?? "",
      phone: body.phone,
      message: body.message,
    });

    void notifyAdminWebhook(inquiry);

    return NextResponse.json({ inquiry }, { status: 201 });
  } catch (error) {
    return jsonError(error);
  }
}
