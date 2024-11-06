"use client";

import { useRouter } from "next/navigation";

const NewPost = () => {
  const router = useRouter();

  const handleClick = () => {
    router.push("/posts/new");
  };

  return (
    <button
      className="flex justify-center items-center bg-blue-800 text-white w-1/3 rounded-full text-3xl cursor-pointer"
      onClick={handleClick}
    >
      New post
    </button>
  );
};

export default NewPost;
