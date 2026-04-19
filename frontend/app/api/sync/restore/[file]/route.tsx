import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

// 1. Define the context type with params as a Promise (Next.js 15 requirement)
type RouteContext = {
  params: Promise<{ file?: string }>;
};

// 2. Use NextRequest and the RouteContext
export async function GET(req: NextRequest, { params }: RouteContext) {
  const base = process.env.LARAVEL_INTERNAL_BASE; // مثلا http://127.0.0.1:8000
  if (!base) return NextResponse.json({ message: "Missing base" }, { status: 500 });

  const url = new URL(req.url);
  const qs = url.searchParams.toString(); // page, search, filters, ...
  
  // 3. AWAIT the params before accessing properties!
  const resolvedParams = await params;
  
  const file = resolvedParams?.file || url.pathname.split("/").pop();
  const upstream = `${base}/api/backup/restore/${file}?${qs}`;

  const res = await fetch(upstream, {
    cache: "no-store",
    headers: {
      Accept: "application/json",
      // اگر auth با کوکی هست، همین خط کمک می‌کند:
      // Cookie: req.headers.get("cookie") ?? "",
      Authorization: req.headers.get("authorization") ?? "",
    },
  });

  const data = await res.json().catch(() => null);

  return NextResponse.json(data, { status: res.status });
}
