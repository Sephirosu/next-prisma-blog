import { NextResponse } from "next/server";
import prisma from "@lib/prisma";
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
      return NextResponse.json(
        { error: "Blog post not found." },
        { status: 404 }
      );
    }

    return NextResponse.json(post, { status: 200 });
  } catch (error) {
    console.error(error);
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
  const { title, content, categoryId, userId } = await req.json();

  console.log("Attempting to update post with ID:", id);

  try {
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
    console.error(error);
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
  console.log("Received DELETE request.");
  console.log("Request headers:", req.headers);

  const { id } = params;
  const userId = req.headers.get("user-id");

  console.log(`User ID from headers: ${userId}`);

  if (!userId) {
    console.log("No user ID found in headers.");
    return NextResponse.json(
      { error: "User ID is required." },
      { status: 401 }
    );
  }

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

  if (post.authorId !== parseInt(userId)) {
    console.log("Unauthorized action: user is not the author of the post.");
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
}
