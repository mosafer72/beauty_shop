import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  const base = process.env.LARAVEL_INTERNAL_BASE; // مثلا http://127.0.0.1:8000
  if (!base) return NextResponse.json({ message: "Missing base" }, { status: 500 });

  const url = new URL(req.url);
  const qs = url.searchParams.toString(); // page, search, filters, ...

  const upstream = `${base}/api/backup/listBackupFiles?${qs}`;

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