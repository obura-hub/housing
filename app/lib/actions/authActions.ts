"use server";

import { signIn } from "@/auth";

export async function loginWithOtp(sessionToken: string, otp: string) {
  try {
    const result = await signIn("credentials", {
      sessionToken,
      otp,
      redirect: false,
    });

    if (result?.error) {
      return { success: false, error: "Invalid OTP" };
    }

    return { success: true };
  } catch (error) {
    console.error("Login failed:", error);
    return { success: false, error: "Authentication failed" };
  }
}
