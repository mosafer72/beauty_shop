// app/api/auth/login/route.js
import { NextRequest, NextResponse } from "next/server";

const BASE = process.env.LARAVEL_INTERNAL_BASE; // مثلا: https://api.example.com/api

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const cookie = request.headers.get("cookie") || "";

    const res = await fetch(`${BASE}/api/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        cookie,
      },
      body: JSON.stringify(body),
    });
    console.log(res);

    const data = await res.json();

    // اگر بک‌اند Set-Cookie می‌فرسته، Next خودش پاس می‌ده (در اغلب کیس‌ها)
    return NextResponse.json(data, { status: res.status });
  } catch (e) {
    return NextResponse.json(
      { success: false, message: "Proxy error" },
      { status: 500 }
    );
  }
}