import { NextRequest, NextResponse } from "next/server";

async function getAccessToken() {
  const auth = Buffer.from(
    `${process.env.MPESA_CONSUMER_KEY}:${process.env.MPESA_CONSUMER_SECRET}`
  ).toString("base64");

  const response = await fetch(
    "https://sandbox.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials",
    {
      headers: {
        Authorization: `Basic ${auth}`,
      },
      cache: "no-store",
    }
  );

  const data = await response.json();

  return data.access_token;
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    let { phone, amount, accountReference, transactionDesc } = body;

    if (!phone || !amount) {
      return NextResponse.json(
        {
          success: false,
          message: "Phone and amount are required",
        },
        { status: 400 }
      );
    }

    phone = phone.replace(/\D/g, "");

    if (phone.startsWith("0")) {
      phone = "254" + phone.substring(1);
    }

    const accessToken = await getAccessToken();

    const timestamp = new Date()
      .toISOString()
      .replace(/[-:.TZ]/g, "")
      .slice(0, 14);

    const password = Buffer.from(
      `${process.env.MPESA_SHORTCODE}${process.env.MPESA_PASSKEY}${timestamp}`
    ).toString("base64");

    const response = await fetch(
      "https://sandbox.safaricom.co.ke/mpesa/stkpush/v1/processrequest",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          BusinessShortCode: process.env.MPESA_SHORTCODE,
          Password: password,
          Timestamp: timestamp,
          TransactionType: "CustomerPayBillOnline",
          Amount: Number(amount),
          PartyA: phone,
          PartyB: process.env.MPESA_SHORTCODE,
          PhoneNumber: phone,
          CallBackURL:
            `${process.env.NEXT_PUBLIC_APP_URL}/api/mpesa/callback`,
          AccountReference:
            accountReference || "CHEFKENYA",
          TransactionDesc:
            transactionDesc || "Reservation Payment",
        }),
      }
    );

    const data = await response.json();

    if (data.ResponseCode === "0") {
      return NextResponse.json({
        success: true,
        message: "STK Push sent successfully",
        data,
      });
    }

    return NextResponse.json({
      success: false,
      message:
        data.errorMessage ||
        data.ResponseDescription ||
        "STK Push failed",
      data,
    });
  } catch (error: any) {
    console.error(error);

    return NextResponse.json(
      {
        success: false,
        message: error.message,
      },
      { status: 500 }
    );
  }
}