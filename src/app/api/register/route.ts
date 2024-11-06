import { NextResponse } from "next/server";
import prisma from "@lib/prisma";
import { hash } from "bcryptjs";
import { z } from "zod";
import { sendVerificationEmail } from "@lib/mailgun";
import { v4 as uuidv4 } from "uuid";

const registerSchema = z.object({
  username: z.string().min(1, { message: "Username is required." }),
  email: z.string().email({ message: "Invalid email." }),
  password: z
    .string()
    .min(6, { message: "Password must be at least 6 characters." }),
});

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { username, email, password } = registerSchema.parse(body);

    const existingUser = await prisma.user.findUnique({
      where: { email },
    });
    if (existingUser) {
      return NextResponse.json(
        { message: "User already exists." },
        { status: 400 }
      );
    }

    const hashedPassword = await hash(password, 10);
    const user = await prisma.user.create({
      data: {
        username,
        email,
        password: hashedPassword,
      },
    });

    const verificationToken = uuidv4();
    await prisma.verificationToken.create({
      data: {
        identifier: user.email,
        token: verificationToken,
        expires: new Date(Date.now() + 60 * 60 * 1000),
      },
    });

    await sendVerificationEmail(user.email, verificationToken);

    return NextResponse.json(
      { message: "User registered successfully", user },
      { status: 201 }
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
