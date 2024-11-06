import Image from "next/image";
import EditPostForm from "./posts/new/edit-post.form";
import DeleteButton from "./posts/new/delete-button";

const PostCard = ({ post, session, categories }) => {
  return (
    <div className=" border-gray-200 rounded-md p-4 flex flex-col items-center">
      {post.imagePath && (
        <div className="mb-4 w-full flex justify-center items-center">
          <div className="relative w-72 h-72">
            <Image
              src={post.imagePath}
              alt={post.title}
              layout="fill"
              objectFit="cover"
              className="rounded-md"
            />
          </div>
        </div>
      )}
      <div className="text-center">
        <p className="text-sm text-gray-600">{post.category.name}</p>
        <h3 className="text-lg font-semibold mb-2">{post.title}</h3>
        <p className="text-xs text-gray-500">
          Author: {post.author.name} | Date:{" "}
          {new Date(post.createdAt).toLocaleDateString()}
        </p>
      </div>
      <div className="mt-4 flex justify-end space-x-2">
        {session && session.user.id === post.author.id && (
          <>
            <EditPostForm
              post={post}
              userId={post.author.id}
              categories={categories}
            />
            <DeleteButton postId={post.id} userId={post.author.id} />
          </>
        )}
      </div>
    </div>
  );
};

export default PostCard;
