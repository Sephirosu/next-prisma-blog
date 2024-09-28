import { NextResponse } from "next/server";
import prisma from "@lib/prisma";

export async function POST(req: Request) {
  const { name } = await req.json();

  try {
    const category = await prisma.category.create({
      data: { name },
    });
    return NextResponse.json(category);
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Failed to create category." },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const categories = await prisma.category.findMany();
    return NextResponse.json(categories);
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Failed to retrieve categories." },
      { status: 500 }
    );
  }
}
