import { NextResponse } from "next/server";
import { jsonError } from "@/lib/api-error-response";
import { createInquiry, listInquiries } from "@/lib/store";

export const dynamic = "force-dynamic";

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

    return NextResponse.json({ inquiry }, { status: 201 });
  } catch (error) {
    return jsonError(error);
  }
}
