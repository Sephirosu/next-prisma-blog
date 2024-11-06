import { NextResponse } from "next/server";
import prisma from "@lib/prisma";
import { z } from "zod";
import { auth } from "../../../../../auth";

const postSchema = z.object({
  title: z
    .string()
    .min(3, "Title must be at least 3 characters long")
    .max(100, "Title cannot exceed 100 characters"),
  content: z.string().min(10, "Content must be at least 10 characters long"),
  categoryId: z.number().positive("Category ID must be a positive number"),
});

export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  const { id } = params;

  try {
    const post = await prisma.blogPost.findUnique({
      where: { id: parseInt(id) },
      include: {
        author: true,
        category: true,
      },
    });

    if (!post) {
      console.log("Blog post not found for ID:", id);
      return NextResponse.json(
        { error: "Blog post not found." },
        { status: 404 }
      );
    }

    console.log("Fetched post:", post);
    return NextResponse.json(post, { status: 200 });
  } catch (error) {
    console.error("Error fetching post:", error);
    return NextResponse.json(
      { error: "Failed to fetch the blog post." },
      { status: 500 }
    );
  }
}

export async function PUT(
  req: Request,
  { params }: { params: { id: string } }
) {
  const session = await auth();
  if (!session || !session.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = params;

  try {
    const requestBody = await req.json();
    const validatedData = postSchema.parse(requestBody);

    const { title, content, categoryId } = validatedData;

    console.log("Attempting to update post with ID:", id);

    const post = await prisma.blogPost.findUnique({
      where: { id: parseInt(id) },
    });

    if (!post) {
      console.log("Post not found for ID:", id);
      return NextResponse.json(
        { error: "Blog post not found." },
        { status: 404 }
      );
    }

    if (post.authorId !== session.user.id) {
      console.log(
        "Unauthorized action. Post authorId:",
        post.authorId,
        "User ID:",
        session.user.id
      );
      return NextResponse.json(
        { error: "Unauthorized action." },
        { status: 403 }
      );
    }

    const updatedPost = await prisma.blogPost.update({
      where: { id: parseInt(id) },
      data: { title, content, categoryId },
    });

    return NextResponse.json(updatedPost, { status: 200 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors }, { status: 400 });
    }

    console.error("Error updating post:", error);
    return NextResponse.json(
      { error: "Failed to update the blog post." },
      { status: 500 }
    );
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
) {
  const session = await auth();
  if (!session || !session.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = params;

  console.log("Received DELETE request for post ID:", id);
  console.log("User ID:", session.user.id);

  try {
    const post = await prisma.blogPost.findUnique({
      where: { id: parseInt(id) },
    });

    if (!post) {
      console.log(`Blog post with ID ${id} not found.`);
      return NextResponse.json(
        { error: "Blog post not found." },
        { status: 404 }
      );
    }

    if (post.authorId !== session.user.id) {
      console.log(
        "Unauthorized action. Post authorId:",
        post.authorId,
        "User ID:",
        session.user.id
      );
      return NextResponse.json(
        { error: "Unauthorized action." },
        { status: 403 }
      );
    }

    await prisma.blogPost.delete({
      where: { id: parseInt(id) },
    });

    console.log(`Blog post with ID ${id} deleted successfully.`);
    return NextResponse.json(
      { message: "Blog post deleted successfully." },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error deleting post:", error);
    return NextResponse.json(
      { error: "Failed to delete the blog post." },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  const session = await auth();
  if (!session || !session.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const requestBody = await req.json();
    const validatedData = postSchema.parse(requestBody);

    const { title, content, categoryId } = validatedData;

    const newPost = await prisma.blogPost.create({
      data: {
        title,
        content,
        categoryId,
        authorId: session.user.id,
      },
    });

    console.log("Created new post:", newPost);
    return NextResponse.json(newPost, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors }, { status: 400 });
    }

    console.error("Error creating post:", error);
    return NextResponse.json(
      { error: "Failed to create the blog post." },
      { status: 500 }
    );
  }
}
