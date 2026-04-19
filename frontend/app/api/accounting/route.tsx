import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";

export async function GET() {
  try {
    const res = await fetch(`${process.env.LARAVEL_INTERNAL_BASE}/api/accounting-data`, {
      method: "GET",
      headers: {
        Accept: "application/json",
        // Authorization: `Bearer ${process.env.API_TOKEN}`,
      },
      cache: "no-store",
    });

    const data = await res.json().catch(() => ({}));
    return NextResponse.json(data, { status: res.status });
  } catch (e: any) {
    return NextResponse.json(
      { success: false, message: e?.message || "خطا در دریافت داده‌ها" },
      { status: 500 }
    );
  }
}

export async function PUT(req: NextRequest) {
  try {
    const body = await req.json();

    const res = await fetch(`${process.env.LARAVEL_INTERNAL_BASE}/api/accounting-data`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        // Authorization: `Bearer ${process.env.API_TOKEN}`,
      },
      body: JSON.stringify(body),
    });

    const data = await res.json().catch(() => ({}));
    return NextResponse.json(data, { status: res.status });
  } catch (e: any) {
    return NextResponse.json(
      { success: false, message: e?.message || "خطا در ذخیره داده‌ها" },
      { status: 500 }
    );
  }
}