import { NextResponse } from "next/server";
import prisma from "@lib/prisma"; // prilagodi putanju prema tvom projektu
import { auth } from "../../../../auth";

export async function GET() {
  try {
    const posts = await prisma.blogPost.findMany({
      include: {
        author: true, // uključiti informacije o autoru
        category: true, // uključiti informacije o kategoriji
      },
    });
    return NextResponse.json(posts, { status: 200 });
  } catch (error) {
    console.error("Error fetching posts:", error);
    return NextResponse.json(
      { error: "Failed to fetch posts" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  const session = await auth();

  if (!session || !session.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { title, content, categoryId } = await request.json();

    const post = await prisma.blogPost.create({
      data: {
        title,
        content,
        authorId: session.user.id,
        categoryId,
      },
    });

    return NextResponse.json(post, { status: 201 });
  } catch (error) {
    console.error("Error creating post:", error);
    return NextResponse.json(
      { error: "Failed to create post" },
      { status: 500 }
    );
  }
}
