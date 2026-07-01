import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const body = await req.json();

  console.log("MPESA CALLBACK");
  console.log(JSON.stringify(body, null, 2));

  return NextResponse.json({
    ResultCode: 0,
    ResultDesc: "Accepted",
  });
}