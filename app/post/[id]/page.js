"use client";

import { React, useEffect, useState } from "react";

export default function Post({ params }) {
  const { id } = params;

  const [post, setPost] = useState(null);

  useEffect(() => {
    fetch(process.env.NEXT_PUBLIC_API_URL + "/post/" + id)
      .then((res) => res.json())
      .then((res) => setPost(res));
  }, []);

  return (
    <>
      {post && (
        <main className="container mx-auto px-4 py-6 flex flex-col items-center">
          <h2 className="text-4xl font-bold mb-4 text-center">{post.title}</h2>
          <p className="text-gray-500 text-center mb-4">
            Published on {post.date}
          </p>
          <img
            src={post.image}
            alt="Post Image"
            className="my-4 w-96 h-64 object-cover rounded-md" // Set width and height for image
          />
          <p className="text-center">{post.description}</p>
        </main>
      )}
    </>
  );
}
