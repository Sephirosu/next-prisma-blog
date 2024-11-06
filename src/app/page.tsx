import { db } from "../../db";
import SignIn from "./Sign";
import Banner from "./components/BannerSection/Banner";
import NewPost from "./new-post";
import Pagination from "./pagination";
import { auth } from "../../auth";
import PostList from "./PostList";

export const revalidate = 0;

export default async function Homepage({ searchParams }) {
  const session = await auth();
  const currentPage = parseInt(searchParams.page) || 1;
  const postsPerPage = 10;

  const posts = await db.blogPost.findMany({
    orderBy: { createdAt: "desc" },
    skip: (currentPage - 1) * postsPerPage,
    take: postsPerPage,
    include: {
      author: { select: { name: true, id: true } },
      category: { select: { name: true } },
    },
  });

  const totalPosts = await db.blogPost.count();
  const totalPages = Math.ceil(totalPosts / postsPerPage);
  const categories = await db.category.findMany();

  return (
    <div>
      <SignIn />
      <Banner />
      <NewPost />
      <div className="bg-white rounded-lg shadow-md ">
        <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">
          Latest Posts
        </h2>
        <PostList posts={posts} session={session} categories={categories} />
        <Pagination currentPage={currentPage} totalPages={totalPages} />
      </div>
    </div>
  );
}
