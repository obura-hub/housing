"use server";

import { signIn } from "@/auth";
import { AuthError } from "next-auth";
import bcrypt from "bcryptjs";
import { getUserByIdentifier } from "./userActions";
import { DatabaseError } from "../db";
import { verifyOtpForAuth } from "./registerActions";
import { redirect } from "next/navigation";

export async function loginWithOtp(sessionToken: string, otp: string) {
  try {
    const result = await verifyOtpForAuth(sessionToken, otp);

    if (!result?.success) {
      return { success: false, error: "Invalid OTP" };
    }

    return { success: true };
  } catch (error) {
    console.error("Login failed:", error);
    return { success: false, error: "Authentication failed" };
  }
}

export async function authenticate(_state: unknown, formData: FormData) {
  const identifier = formData.get("identifier") as string;
  const password = formData.get("password") as string;

  if (!identifier || !password) {
    return "Both identifier and password are required.";
  }

  try {
    // 1. Look up user by email, national ID, or personal number
    const user = await getUserByIdentifier(identifier);

    if (!user) {
      return "Invalid credentials.";
    }

    const email = user.email; // We will use email for NextAuth sign-in

    // 3. Sign in using NextAuth (using email as the credential)
    await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    // 4. Redirect on success (handled by the form action)
    // We return a special value to indicate success; the client will redirect.
  } catch (error) {
    if (error instanceof AuthError) {
      return error.type === "CredentialsSignin"
        ? "Invalid credentials."
        : "Something went wrong. Please try again later.";
    }
    if (error instanceof DatabaseError) {
      return "Our service is temporarily unavailable. Please try again later.";
    }
    console.error("Login error:", error);
    return "An unexpected error occurred.";
  }

  redirect("/projects");
}
