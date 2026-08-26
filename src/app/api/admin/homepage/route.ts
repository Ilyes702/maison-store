import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { updateHomepageContent } from "@/lib/data/settings";

export async function PATCH(req: NextRequest) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "غير مصرح" }, { status: 401 });

  const body = await req.json();
  await updateHomepageContent(body);
  return NextResponse.json({ ok: true });
}
