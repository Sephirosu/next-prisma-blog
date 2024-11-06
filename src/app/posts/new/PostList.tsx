"use client";

import { useState, useEffect } from "react";

export default function PostList() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchPosts() {
      const res = await fetch("/api/posts"); 
      const data = await res.json();
      setPosts(data);
      setLoading(false);
    }
    fetchPosts();
  }, []);

  async function deletePost(postId) {
    const res = await fetch(`/api/posts/${postId}`, { method: "DELETE" });
    if (res.ok) {
      setPosts(posts.filter((post) => post.id !== postId));
    }
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">
        Existing Snippets
      </h2>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <div className="space-y-4">
          {posts.map((post) => (
            <div
              key={post.id}
              className="border border-gray-200 rounded-md p-4"
            >
              <h3 className="text-lg font-semibold mb-2">{post.title}</h3>
              <pre className="bg-gray-100 p-2 rounded-md overflow-x-auto">
                <code>{post.content}</code>
              </pre>
              <div className="mt-2 text-sm text-gray-500">
                <p>Author: {post.author.name}</p>
                <p>Category: {post.category.name}</p>
              </div>
              <button
                onClick={() => deletePost(post.id)}
                className="mt-2 bg-red-500 text-white py-1 px-3 rounded-md hover:bg-red-600"
              >
                Delete
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
