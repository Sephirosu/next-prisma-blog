
import { NextResponse } from "next/server";
import prisma from "@lib/prisma";


export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, email, password } = body;

    const user = await prisma.user.create({
      data: { name, email, password },
    });

    return NextResponse.json(user, { status: 201 });
  } catch (error) {
    console.error(error); 
    return NextResponse.json(
      { error: "Failed to create user." },
      { status: 500 }
    );
  }
}


export async function GET() {
  try {
    const users = await prisma.user.findMany();
    return NextResponse.json(users, { status: 200 });
  } catch (error) {
    console.error(error); 
    return NextResponse.json(
      { error: "Failed to fetch users." },
      { status: 500 }
    );
  }
}
