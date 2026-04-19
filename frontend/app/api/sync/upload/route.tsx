import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {

  try {

    const formData = await req.formData();

    const file = formData.get("backup_file");

    if (!file) {
      return NextResponse.json({
        success: false,
        message: "No file"
      }, { status: 400 });
    }

    const forward = new FormData();

    forward.append("backup_file", file as Blob);

    const response = await fetch(
      "http://127.0.0.1:8000/api/backup/upload",
      {
        method: "POST",
        body: forward,
      }
    );

    const data = await response.json();

    return NextResponse.json(data);

  } catch (e:any) {

    return NextResponse.json({
      success:false,
      message:e.message
    }, { status:500 });

  }

}