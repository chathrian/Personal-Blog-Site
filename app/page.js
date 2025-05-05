"use client";
import Link from "next/link";
import { useEffect, useState, useRef } from "react";

export default function Home() {
  const [posts, setPosts] = useState([]);
  const inputRef = useRef("");
  const [search, setSearch] = useState(false);

  useEffect(() => {
    fetch(process.env.NEXT_PUBLIC_API_URL + "/posts")
      .then((res) => res.json())
      .then((res) => setPosts(res));
  }, []);

  const serachPost = (e) => {
    if (e.type == 'keydown' && e.key !== 'Enter') {
      return;
    }
    setSearch(true);

    fetch(
      process.env.NEXT_PUBLIC_API_URL + "/posts?q=" + inputRef.current.value
    )
      .then((res) => res.json())
      .then((res) => setPosts(res))
      .finally(() => setSearch(false));
  };
  return (
    <>
      <main className="container mx-auto px-4 py-6">
        <h2 className="text-4xl font-bold mb-4 text-center">
          Welcome to Our Blog
        </h2>
        <p>
          Welcome to our blog, where we explore a wide range of topics that
          inspire, inform, and entertain. Whether you're looking for insightful
          articles on lifestyle, the latest tech trends, creative tips, or
          in-depth guides on personal development, you're in the right place.
          Our mission is to provide you with high-quality content that sparks
          curiosity and fosters a community of passionate readers. Stay tuned as
          we regularly share fresh ideas, expert advice, and stories that will
          not only keep you updated but also motivate you to take action in your
          everyday life. Thank you for joining us on this exciting journey!
        </p>
      </main>
      <div className="flex justify-end px-4 mb-4">
        <input
          disabled={search}
          ref={inputRef}
          onKeyDown={serachPost}
          type="text"
          className="px-4 py-2 border border-gray-300 rounded-md"
          placeholder="Search..."
        />
        <button
          onClick={serachPost}
          type="submit"
          disabled={search}
          className="px-4 py-2 bg-blue-500 text-white rounded-md ml-4"
        >
          {search ? "searchig..." : "Search"}
        </button>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-20">
        {posts.map((post) => (
          <Link key={post._id} href={"/post/" + post._id}>
            <div className="border border-gray-200 p-4">
              <img
                className="w-full h-80 object-cover mb-4"
                src={post.image}
                alt="Post Image"
              />
              <h2 className="text-xl font-semibold mb-2">{post.title}</h2>
              <p className="text-gray-600">{post.short_description}</p>
            </div>
          </Link>
        ))}
        {!posts.length > 0 && inputRef.current.value && (
          <p className="text-center">
            No post available for this query : "
            <strong>{inputRef.current.value}</strong>"
          </p>
        )}
      </div>
    </>
  );
}
