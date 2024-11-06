import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import GitHub from "next-auth/providers/github";
import Google from "next-auth/providers/google";
import prisma from "@lib/prisma";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { compare } from "bcryptjs";

interface User {
  id: string;
  username: string;
  email: string | null;
  name: string | null;
  password?: string;
}

export const { auth, handlers, signIn, signOut } = NextAuth({
  adapter: PrismaAdapter(prisma),
  providers: [
    Credentials({
      name: "Credentials",
      credentials: {
        identifier: {
          label: "Username or Email",
          type: "text",
          placeholder: "your-username-or-email",
        },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        console.log("Received credentials:", credentials);

        if (!credentials || !credentials.identifier || !credentials.password) {
          console.error("Missing identifier or password.");
          throw new Error("Missing identifier or password.");
        }

        const searchKey = credentials.identifier;

        const user = await prisma.user.findFirst({
          where: {
            OR: [{ email: searchKey }, { username: searchKey }],
          },
        });

        console.log("User found:", user);

        if (!user) {
          console.error("No user found.");
          throw new Error("No user found.");
        }

        if (!user.password) {
          console.error("User has no password set.");
          throw new Error("User has no password set.");
        }

        const isValid = await compare(
          credentials.password as string,
          user.password
        );
        console.log("Password validation result:", isValid);
        console.log("Comparing password:", credentials.password, user.password);

        if (!isValid) {
          console.error("Invalid password.");
          throw new Error("Invalid password.");
        }
        console.log("Comparing password:", credentials.password, user.password);

        return {
          id: user.id,
          username: user.username,
          email: user.email,
          name: user.name,
        } as User;
      },
    }),
    GitHub,
    Google({
      authorization: { params: { prompt: "select_account" } },
    }),
  ],
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60,
    updateAge: 24 * 60 * 60,
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.email = user.email;
        token.username = user.username;
      }
      return token;
    },
    async session({ session, token }) {
      session.user.id = typeof token.id === "string" ? token.id : "";
      session.user.username =
        typeof token.username === "string" ? token.username : "";
      session.user.email = typeof token.email === "string" ? token.email : "";
      return session;
    },
  },
  pages: {
    signIn: "/login",
    error: "/login",
  },
  secret: process.env.AUTH_SECRET,
  debug: true,
});
