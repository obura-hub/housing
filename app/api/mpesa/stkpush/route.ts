import { NextRequest, NextResponse } from "next/server";
import { getAccessToken } from "@/lib/mpesa";

export async function POST(req: NextRequest) {
  try {
    const { phone, amount } = await req.json();

    const accessToken = await getAccessToken();

    const timestamp = new Date()
      .toISOString()
      .replace(/[-:TZ.]/g, "")
      .slice(0, 14);

    const shortcode = process.env.MPESA_SHORTCODE!;
    const passkey = process.env.MPESA_PASSKEY!;

    const password = Buffer.from(
      shortcode + passkey + timestamp
    ).toString("base64");

    let formattedPhone = phone.replace(/\D/g, "");

    if (formattedPhone.startsWith("0")) {
      formattedPhone = "254" + formattedPhone.substring(1);
    }

    const callbackUrl =
      `${process.env.NEXT_PUBLIC_APP_URL}/api/mpesa/callback`;

    const response = await fetch(
      "https://sandbox.safaricom.co.ke/mpesa/stkpush/v1/processrequest",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          BusinessShortCode: shortcode,
          Password: password,
          Timestamp: timestamp,
          TransactionType: "CustomerPayBillOnline",
          Amount: amount,
          PartyA: formattedPhone,
          PartyB: shortcode,
          PhoneNumber: formattedPhone,
          CallBackURL: callbackUrl,
          AccountReference: "NAIROBI HOUSING",
          TransactionDesc: "STK Push Test",
        }),
      }
    );

    const data = await response.json();

    return NextResponse.json({
      success: data.ResponseCode === "0",
      data,
      message:
        data.CustomerMessage ||
        data.errorMessage ||
        "STK Request processed",
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