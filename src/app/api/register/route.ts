import { NextResponse } from "next/server";
import prisma from "@lib/prisma"; // Adjust based on your project structure
import { hash } from "bcryptjs"; // Ensure bcryptjs is installed
import { z } from "zod"; // Ensure zod is installed

// Define the Zod schema for registration validation
const registerSchema = z.object({
  username: z.string().min(1, { message: "Username is required." }), // Username is required
  email: z.string().email({ message: "Invalid email." }), // Email is required
  password: z
    .string()
    .min(6, { message: "Password must be at least 6 characters." }), // Password validation
});

// Handle POST requests to register a new user
export async function POST(req: Request) {
  try {
    const body = await req.json(); // Parse the incoming JSON request body
    console.log("Received registration body:", body); // Log the body for debugging

    // Validate input against schema
    const { username, email, password } = registerSchema.parse(body);
    console.log("Validated registration values:", {
      username,
      email,
      password,
    }); // Log validated values

    // Check if the user already exists in the database by email
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });
    if (existingUser) {
      console.log("User already exists:", existingUser);
      return NextResponse.json(
        { message: "User already exists." },
        { status: 400 }
      );
    }

    // Hash the password before saving it
    const hashedPassword = await hash(password, 10);
    console.log("Hashed password:", hashedPassword); // Log the hashed password

    // Create a new user record in the database
    const user = await prisma.user.create({
      data: {
        username, // Save the username
        email,
        password: hashedPassword, // Store the hashed password
      },
    });

    console.log("User created successfully:", user); // Log the created user

    return NextResponse.json(
      { message: "User registered successfully", user },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error during registration:", error); // Log error for debugging
    if (error instanceof z.ZodError) {
      return NextResponse.json({ message: error.errors }, { status: 400 });
    }
    return NextResponse.json(
      { message: (error as Error).message }, // Type assertion
      { status: 400 }
    );
  }
}
