import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";

export async function GET(req: NextRequest) {

  try {

    const response = await fetch(
      `${process.env.LARAVEL_INTERNAL_BASE}/backup/sync`,
      {
        method: "GET",

        headers: {
        //   Authorization: `Bearer ${process.env.API_TOKEN}`,
          Accept: "application/json",
        },

        cache: "no-store",
      }
    );

    const data = await response.json();

    return NextResponse.json(data, {
      status: response.status,
    });

  } catch (error: any) {

    return NextResponse.json(
      {
        success: false,
        message: error.message,
      },
      { status: 500 }
    );

  }

}