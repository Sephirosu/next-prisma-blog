import { NextResponse } from "next/server";
import prisma from "@lib/prisma";

export async function GET() {
  try {
    const posts = await prisma.blogPost.findMany({
      include: {
        author: true,
        category: true,
      },
    });
    return NextResponse.json(posts, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Failed to fetch blog posts." },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  const { title, content, authorId, categoryId } = await req.json();

  console.log("Attempting to create a new post.");

  try {
    const newPost = await prisma.blogPost.create({
      data: {
        title,
        content,
        authorId,
        categoryId,
      },
    });

    console.log(`New post created with ID: ${newPost.id}`);
    return NextResponse.json(newPost, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Failed to create the blog post." },
      { status: 500 }
    );
  }
}
