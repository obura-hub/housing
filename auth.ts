import NextAuth from "next-auth";
import { authConfig } from "./auth.config";
import Credentials from "next-auth/providers/credentials";
import { z } from "zod";

import bcrypt from "bcryptjs";
import { getUser } from "./app/lib/actions/userActions";

interface User {
  email: string;
  password: string;
}

export const { auth, signIn, signOut } = NextAuth({
  ...authConfig,
  providers: [
    Credentials({
      async authorize(credentials) {
        const parsedCredentials = z
          .object({ email: z.email(), password: z.string().min(6) })
          .safeParse(credentials);

        if (parsedCredentials.success) {
          const { email, password } = parsedCredentials.data;

          const user = (await getUser(email)) as User;

          console.log("Our user kkkk", user, email, password, user.password);
          if (!user) return null;
          const passwordsMatch = await bcrypt.compare(password, user?.password);

          if (!passwordsMatch) return user;
        }

        console.log("Invalid credentials");
        return null;
      },
    }),
  ],
});
