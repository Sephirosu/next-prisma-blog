"use server";

import { db } from "../../db";
import { revalidatePath } from "next/cache";
import { writeFile } from "fs/promises";
import path from "path";

type CreatePostParams = {
  title: string;
  content: string;
  categoryId: number;
  userId: string;
  image: string | null;
};

export async function createPost({
  title,
  content,
  categoryId,
  userId,
  image,
}: CreatePostParams) {
  try {
    console.log("Creating post with data:", {
      title,
      content,
      categoryId,
      userId,
      hasImage: !!image,
    });

    let imagePath = null;

    if (image) {
      console.log("Processing image...");
      const buffer = Buffer.from(image, "base64");

      const filename = `${Date.now()}-image.png`;
      const filepath = path.join(process.cwd(), "public", "uploads", filename);
      await writeFile(filepath, buffer);
      imagePath = `/uploads/${filename}`;
      console.log("Image saved at:", imagePath);
    }

    console.log("Creating post in database...");
    const post = await db.blogPost.create({
      data: {
        title,
        content,
        categoryId,
        authorId: userId,
        imagePath,
      },
    });

    console.log("Post created successfully:", post);

    revalidatePath("/");

    return { success: true, post };
  } catch (error) {
    console.error("Failed to create post:", error);
    if (error instanceof Error) {
      return { error: error.message };
    }
    return { error: "An unexpected error occurred while creating the post" };
  }
}
