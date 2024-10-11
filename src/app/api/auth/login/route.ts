import { NextResponse } from "next/server";
import prisma from "@lib/prisma";
import { compare } from "bcryptjs";
import { z } from "zod";

// Zod schema for validation
const loginSchema = z.object({
  identifier: z.string(), // Single identifier field (email or username)
  password: z
    .string()
    .min(6, { message: "Password must be at least 6 characters." }),
});

export async function POST(req: Request) {
  try {
    const body = await req.json(); // Parse request body

    console.log("Received login request body:", body);

    // Validate the input using Zod
    const { identifier, password } = loginSchema.parse(body);

    // Log identifier
    console.log("Identifier received:", identifier);

    // Check if the identifier is an email or username
    const isEmail = identifier.includes("@");

    // Find user by email or username
    const user = await prisma.user.findFirst({
      where: isEmail
        ? { email: identifier } // if it's an email
        : { username: identifier }, // otherwise, assume it's a username
    });

    // Check if user exists
    if (!user) {
      return NextResponse.json(
        { message: "Invalid credentials." },
        { status: 401 }
      );
    }

    // Compare passwords
    const isPasswordValid = await compare(password, user.password);
    if (!isPasswordValid) {
      // If the password is incorrect, return a message
      console.log("Incorrect password for user:", user.username || user.email);
      return NextResponse.json(
        { message: "Invalid credentials. Please check your password." },
        { status: 401 }
      );
    }

    // Return user data without password
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
