import { NextResponse } from "next/server";
import prisma from "@lib/prisma";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const token = searchParams.get("token");
  const identifier = searchParams.get("identifier");

  if (!token) {
    return NextResponse.json(
      { message: "Token is required." },
      { status: 400 }
    );
  }

  if (!identifier) {
    return NextResponse.json(
      { message: "Identifier is required." },
      { status: 400 }
    );
  }

  try {
    const verificationToken = await prisma.verificationToken.findUnique({
      where: {
        identifier_token: {
          identifier,
          token,
        },
      },
    });

    if (!verificationToken) {
      return NextResponse.json({ message: "Invalid token." }, { status: 400 });
    }

    const currentDate = new Date();
    if (verificationToken.expires < currentDate) {
      return NextResponse.json(
        { message: "Token has expired." },
        { status: 400 }
      );
    }

    await prisma.user.update({
      where: { email: verificationToken.identifier },
      data: { emailVerified: new Date() },
    });

    await prisma.verificationToken.delete({
      where: {
        identifier_token: {
          identifier: verificationToken.identifier,
          token,
        },
      },
    });

    return NextResponse.json(
      { message: "Email verified successfully!" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error during email verification:", error);
    return NextResponse.json(
      { message: "An error occurred.", error: error.message },
      { status: 500 }
    );
  }
}
