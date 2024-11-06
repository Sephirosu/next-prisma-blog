import { NextResponse } from "next/server";
import prisma from "@lib/prisma";

export async function POST(req) {
  try {
    const { sessionToken } = await req.json();

    await prisma.session.deleteMany({
      where: { sessionToken },
    });

    console.log("Session deleted for token:", sessionToken);

    return NextResponse.json({ message: "Logout successful" }, { status: 200 });
  } catch (error) {
    console.error("Error during logout:", error);
    return NextResponse.json(
      { message: (error as Error).message },
      { status: 500 }
    );
  }
}
