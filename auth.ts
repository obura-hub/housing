import NextAuth from "next-auth";
import { authConfig } from "./auth.config";
import Credentials from "next-auth/providers/credentials";
import { z } from "zod";
import { verifyOtpForAuth } from "./app/lib/actions/registerActions";

export const { auth, signIn, signOut } = NextAuth({
  ...authConfig,
  providers: [
    Credentials({
      async authorize(credentials) {
        const parsed = z
          .object({
            sessionToken: z.string().min(1),
            otp: z.string().length(6),
          })
          .safeParse(credentials);

        if (!parsed.success) return null;

        const result = await verifyOtpForAuth(
          parsed.data.sessionToken,
          parsed.data.otp,
        );

        if (!result.success) {
          throw new Error(result.error); // ✅ prevents silent redirect
        }

        // Next Auth requires an object with at least `id`
        return {
          id: result.userId,
          email: result.email ?? null,
        };
      },
    }),
  ],
});
