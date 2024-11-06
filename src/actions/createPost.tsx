"use server";

import { db } from "../../db";

export async function createPost(formData: FormData) {
  const title = formData.get("title") as string;
  const content = formData.get("code") as string;
  const categoryId = parseInt(formData.get("categoryId") as string, 10);
  const userId = formData.get("userId") as string;

  try {
    const newPost = await db.post.create({
      data: {
        title,
        content,
        categoryId,
        userId,
      },
    });

    return { success: true, post: newPost };
  } catch (error) {
    console.error("Failed to create post:", error);
    return { success: false, error: "Failed to create post" };
  }
}
