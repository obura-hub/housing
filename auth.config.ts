import type { NextAuthConfig } from "next-auth";

const PROTECTED_PREFIXES = [
  "/projects",
  "/project",
  "/dashboard",
  "/profile",
  "/savings",
  "/financing",
];

export const authConfig = {
  pages: {
    signIn: "/register",
  },
  session: {
    strategy: "jwt",
    maxAge: 8 * 60 * 60, // 8 hours
  },
  callbacks: {
    // Persist userId into the JWT so server actions can read it
    async jwt({ token, user }) {
      if (user) {
        token.userId = user.id;
        token.name = user.name ?? null;
        token.email = user.email ?? null;
      }
      return token;
    },
    // Expose userId on the session object
    async session({ session, token }) {
      if (token.userId) {
        session.user.id = token.userId as string;
      }
      return session;
    },
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user;
      const isProtected = PROTECTED_PREFIXES.some((prefix) =>
        nextUrl.pathname.startsWith(prefix),
      );

      if (isProtected && !isLoggedIn) {
        // Redirect to login, preserving intended destination
        const loginUrl = new URL("/register", nextUrl);
        loginUrl.searchParams.set("callbackUrl", nextUrl.pathname);
        return Response.redirect(loginUrl);
      }

      return true;
    },
  },
  providers: [],
} satisfies NextAuthConfig;
