import { NextResponse } from "next/server";
import prisma from "@lib/prisma";
import { compare } from "bcryptjs";
import { z } from "zod";

const loginSchema = z.object({
  identifier: z.string(),
  password: z
    .string()
    .min(6, { message: "Password must be at least 6 characters." }),
});

export async function POST(req: Request) {
  try {
    const body = await req.json();

    console.log("Received login request body:", body);

    const { identifier, password } = loginSchema.parse(body);

    console.log("Identifier received:", identifier);

    const isEmail = identifier.includes("@");

    const user = await prisma.user.findFirst({
      where: isEmail ? { email: identifier } : { username: identifier },
    });

    if (!user) {
      return NextResponse.json(
        { message: "Invalid credentials." },
        { status: 401 }
      );
    }

    const isPasswordValid = await compare(password, user.password);
    if (!isPasswordValid) {
      console.log("Incorrect password for user:", user.username || user.email);
      return NextResponse.json(
        { message: "Invalid credentials. Please check your password." },
        { status: 401 }
      );
    }

    const { password: _, ...userWithoutPassword } = user;
    return NextResponse.json(
      { message: "Login successful", user: userWithoutPassword },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error during login:", error);

    if (error instanceof z.ZodError) {
      console.error("Zod validation errors:", error.errors);
      return NextResponse.json({ message: error.errors }, { status: 400 });
    }

    return NextResponse.json(
      { message: (error as Error).message },
      { status: 400 }
    );
  }
}
