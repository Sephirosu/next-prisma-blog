import { NextResponse } from "next/server";
import prisma from "@lib/prisma";
import { compare } from "bcryptjs";
import { z } from "zod";
import { sign } from "jsonwebtoken";

const loginSchema = z.object({
  identifier: z.string(),
  password: z
    .string()
    .min(6, { message: "Password must be at least 6 characters." }),
});

const JWT_SECRET = process.env.AUTH_SECRET;

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { identifier, password } = loginSchema.parse(body);

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
      return NextResponse.json(
        { message: "Invalid credentials. Please check your password." },
        { status: 401 }
      );
    }

    const token = sign(
      { id: user.id, email: user.email, username: user.username },
      JWT_SECRET,
      { expiresIn: "1h" }
    );

    return NextResponse.json(
      {
        message: "Login successful",
        user: { ...user, password: undefined },
        token,
      },
      { status: 200 }
    );
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ message: error.errors }, { status: 400 });
    }
    return NextResponse.json(
      { message: (error as Error).message },
      { status: 400 }
    );
  }
}
