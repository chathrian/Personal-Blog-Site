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
    if (e.type == "keydown" && e.key !== "Enter") {
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
      <div>
        <section className=" lg:grid  lg:place-content-center">
          <div className="mx-auto w-screen max-w-screen-xl px-4 py-16 sm:px-6 sm:py-24 lg:px-6 lg:py-24">
            <div className="mx-auto max-w-prose text-center">
              <h1 className="text-4xl font-bold text-gray-900 sm:text-5xl">
                Welcome to my
                <strong className="text-indigo-600"> Personal </strong>
                Blog Site
              </h1>

              <p className="mt-10 text-base text-pretty text-gray-700 sm:text-lg/relaxed">
                Welcome to my blog, where we explore a wide range of topics that
                inspire, inform, and entertain. Whether you're looking for
                insightful articles on lifestyle, the latest tech trends,
                creative tips, or in-depth guides on personal development,
                you're in the right place. Our mission is to provide you with
                high-quality content that sparks curiosity and fosters a
                community of passionate readers. Stay tuned as we regularly
                share fresh ideas, expert advice, and stories that will not only
                keep you updated but also motivate you to take action in your
                everyday life. Thank you for joining us on this exciting
                journey!
              </p>
            </div>
          </div>
        </section>

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
        <div className="mb-20">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-20  px-20 ">
            {posts.map((post) => (
              <Link key={post._id} href={"/post/" + post._id}>
                <div className="group relative block bg-black rounded-md shadow-lg transition-shadow duration-200 hover:shadow-lg">
                  <img
                    alt={post.title}
                    src={post.image}
                    className="absolute inset-0 h-full w-full object-cover rounded-md opacity-75 transition-opacity group-hover:opacity-50"
                  />

                  <div className="relative p-4 sm:p-6 lg:p-8">
                    <p className="text-sm font-medium tracking-widest text-pink-500 uppercase">
                      {post.date}
                    </p>

                    <p className="text-xl font-bold text-white sm:text-2xl">
                      {post.title}
                    </p>

                    <div className="mt-32 sm:mt-48 lg:mt-64">
                      <div className="translate-y-8 transform opacity-0 transition-all group-hover:translate-y-0 group-hover:opacity-100">
                        <p className="text-sm text-white">
                          {post.short_description}
                        </p>
                      </div>
                    </div>
                  </div>
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
        </div>
      </div>
    </>
  );
}
