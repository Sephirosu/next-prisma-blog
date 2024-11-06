import { NextResponse } from "next/server";
import prisma from "@lib/prisma";

export async function POST(req) {
  try {
    const { sessionToken } = await req.json();

    if (!sessionToken) {
      return NextResponse.json(
        { message: "Session token is required." },
        { status: 400 }
      );
    }

    await prisma.session.deleteMany({
      where: { sessionToken },
    });

    return NextResponse.json(
      { message: "Logged out successfully." },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error during logout:", error);
    return NextResponse.json(
      { message: "An error occurred during logout." },
      { status: 500 }
    );
  }
}
