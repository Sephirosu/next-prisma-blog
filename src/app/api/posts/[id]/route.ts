import { NextResponse } from "next/server";
import prisma from "@lib/prisma";
import { z } from "zod";

const postSchema = z.object({
  title: z
    .string()
    .min(3, "Title must be at least 3 characters long")
    .max(100, "Title cannot exceed 100 characters"),
  content: z.string().min(10, "Content must be at least 10 characters long"),
  categoryId: z.number().positive("Category ID must be a positive number"),
  userId: z.string().length(25, "Invalid user ID format"),
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
  const { id } = params;

  try {
    const requestBody = await req.json();
    const validatedData = postSchema.parse(requestBody);

    const { title, content, categoryId, userId } = validatedData;

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

    if (post.authorId !== userId) {
      console.log(
        "Unauthorized action. Post authorId:",
        post.authorId,
        "User ID:",
        userId
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
  const { id } = params;
  const userId = req.headers.get("user-id");

  console.log("Received DELETE request for post ID:", id);
  console.log("User ID from headers:", userId);

  if (!userId) {
    console.log("User ID is missing from headers.");
    return NextResponse.json(
      { error: "User ID is required." },
      { status: 401 }
    );
  }

  const userIdSchema = z.string().min(1, "User ID is required");

  try {
    userIdSchema.parse(userId);

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

    if (post.authorId !== userId) {
      console.log(
        "Unauthorized action. Post authorId:",
        post.authorId,
        "User ID:",
        userId
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
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors }, { status: 400 });
    }

    console.error("Error deleting post:", error);
    return NextResponse.json(
      { error: "Failed to delete the blog post." },
      { status: 500 }
    );
  }
}
