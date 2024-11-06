import { redirect } from "next/navigation";
import prisma from "../../../../lib/prisma";
import { auth } from "../../../../auth";
import CreatePostForm from "../create-post-form";
// TAJ JE
export default async function CreatePostPage() {
  const session = await auth();

  if (!session || !session.user) {
    redirect("/");
  }

  const categories = await prisma.category.findMany({
    select: {
      id: true,
      name: true,
    },
    orderBy: {
      name: "asc",
    },
  });

  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <div className="max-w-4xl mx-auto">
        <CreatePostForm userId={session.user.id} categories={categories} />
      </div>
    </div>
  );
}
