import { NextRequest, NextResponse } from "next/server";
import { getLawArticles } from "@/lib/lawApi";

export async function GET(request: NextRequest) {
  const law = request.nextUrl.searchParams.get("law") ?? undefined;
  const { articles, source } = await getLawArticles(law);
  return NextResponse.json({ articles, source });
}
