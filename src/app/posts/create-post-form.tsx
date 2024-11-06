"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { createPost } from "@/actions/actions";

type Category = {
  id: number;
  name: string;
};

type CreatePostFormProps = {
  userId: string;
  categories: Category[];
};

export default function CreatePostForm({
  userId,
  categories = [],
}: CreatePostFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    const formData = new FormData(e.currentTarget);
    const title = formData.get("title") as string;
    const content = formData.get("content") as string;
    const categoryId = parseInt(formData.get("categoryId") as string, 10);
    const imageFile = formData.get("image") as File | null;

    let base64Image: string | null = null;
    if (imageFile && imageFile.size > 0) {
      const buffer = await imageFile.arrayBuffer();
      base64Image = await convertArrayBufferToBase64(buffer);
    }

    try {
      const result = await createPost({
        title,
        content,
        categoryId,
        userId,
        image: base64Image,
      });

      if (result.error) {
        throw new Error(result.error);
      }
      console.log("Post created:", result);
      router.push("/");
    } catch (err) {
      if (err instanceof Error) {
        setError(`Error creating post: ${err.message}`);
      } else {
        setError(
          "An unexpected error occurred while creating the post. Please try again."
        );
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const convertArrayBufferToBase64 = (buffer: ArrayBuffer) => {
    const byteArray = new Uint8Array(buffer);
    let binaryString = "";
    byteArray.forEach((byte) => {
      binaryString += String.fromCharCode(byte);
    });
    return window.btoa(binaryString);
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-8">
      <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">
        Create a New Post
      </h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label
            htmlFor="title"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Title
          </label>
          <input
            type="text"
            id="title"
            name="title"
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="Enter post title"
          />
        </div>
        <div>
          <label
            htmlFor="content"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Content
          </label>
          <textarea
            id="content"
            name="content"
            rows={4}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="Enter post content"
          ></textarea>
        </div>
        <div>
          <label
            htmlFor="categoryId"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Category
          </label>
          <select
            id="categoryId"
            name="categoryId"
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="">Select a category</option>
            {categories.length > 0 ? (
              categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))
            ) : (
              <option disabled>No categories available</option>
            )}
          </select>
        </div>
        <div>
          <label
            htmlFor="image"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Image
          </label>
          <input
            type="file"
            id="image"
            name="image"
            accept="image/*"
            onChange={handleImageChange}
            ref={fileInputRef}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
        {imagePreview && (
          <div className="mt-4">
            <Image
              src={imagePreview}
              alt="Preview"
              width={200}
              height={200}
              className="object-cover rounded-md"
            />
          </div>
        )}
        {error && <div className="text-red-500 text-sm">{error}</div>}
        <button
          type="submit"
          disabled={isSubmitting || categories.length === 0}
          className={`w-full ${
            isSubmitting || categories.length === 0
              ? "bg-blue-400 cursor-not-allowed"
              : "bg-blue-600 hover:bg-blue-700"
          } text-white py-2 px-4 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors duration-300`}
        >
          {isSubmitting ? "Creating..." : "Create Post"}
        </button>
      </form>
    </div>
  );
}
