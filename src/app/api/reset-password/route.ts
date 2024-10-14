import { NextResponse } from "next/server";
import prisma from "@lib/prisma";
import bcrypt from "bcryptjs";

async function verifyToken(token, identifier) {
  console.log("Verifying token:", token, "for identifier:", identifier);

  const user = await prisma.user.findUnique({
    where: { email: identifier },
  });

  if (!user) {
    console.error("User not found.");
    return false;
  }

  const isTokenValid =
    user.resetToken === token && user.resetTokenExpiry > new Date();
  if (!isTokenValid) {
    console.error("Invalid or expired token.");
    return false;
  }

  return true;
}

export async function POST(req) {
  try {
    const { token, identifier, password } = await req.json();
    console.log("Request data:", { token, identifier, password });

    if (!token || !identifier || !password) {
      console.log("Error: All fields are required.");
      return NextResponse.json(
        { error: "All fields are required." },
        { status: 400 }
      );
    }

    const isValidToken = await verifyToken(token, identifier);
    if (!isValidToken) {
      console.log("Error: Invalid or expired token.");
      return NextResponse.json(
        { error: "Invalid or expired token." },
        { status: 403 }
      );
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    console.log("Hashed password:", hashedPassword);

    const updatedUser = await prisma.user.update({
      where: { email: identifier },
      data: {
        password: hashedPassword,
        resetToken: null,
        resetTokenExpiry: null,
      },
    });
    console.log("User updated:", updatedUser);

    console.log("Password reset successfully for identifier:", identifier);
    return NextResponse.json(
      { message: "Password reset successfully." },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error in password reset process:", error);
    return NextResponse.json(
      { error: "Failed to reset password." },
      { status: 500 }
    );
  }
}
