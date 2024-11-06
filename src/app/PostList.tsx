import PostCard from "./PostCard";
const PostList = ({ posts, session, categories }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 ">
      {posts.map((post) => (
        <PostCard
          key={post.id}
          post={post}
          session={session}
          categories={categories}
        />
      ))}
    </div>
  );
};

export default PostList;
