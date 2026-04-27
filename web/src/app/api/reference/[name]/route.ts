import { readFile } from "node:fs/promises";
import path from "node:path";
import { NextResponse } from "next/server";

const allowedReferences = new Set([
  "wiper1",
  "wiper2",
  "wiper3",
  "wiper4",
  "wiper5",
  "wiper6",
  "wiper7",
  "wiper8",
  "wiper9",
  "wipervan2",
]);

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ name: string }> },
) {
  const { name } = await params;
  const isVanPng = name === "wiper8" || name === "wipervan2";

  if (!allowedReferences.has(name)) {
    return NextResponse.json({ error: "Reference not found" }, { status: 404 });
  }

  const filePath = path.join(
    process.cwd(),
    "..",
    "pic_ref",
    isVanPng ? "wipervan2.png" : `${name}.JPG`,
  );
  const file = await readFile(filePath);

  return new NextResponse(file, {
    headers: {
      "Cache-Control": isVanPng ? "no-store" : "public, max-age=31536000, immutable",
      "Content-Type": isVanPng ? "image/png" : "image/jpeg",
    },
  });
}
