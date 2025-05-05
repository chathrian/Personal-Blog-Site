"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Head from "next/head";
import PopupForm from "@/components/popupForm";
import DataTable from "@/components/dataTable";
import EnquiryTable from "@/components/enquiryTable"; 

export default function Home() {
  const router = useRouter();
  const [blogs, setBlogs] = useState([]);
  const [enquiries, setEnquiries] = useState([]);
  const [showPopup, setShowPopup] = useState(false);
  const [currentBlog, setCurrentBlog] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("blogs");

  useEffect(() => {
    fetch(process.env.NEXT_PUBLIC_API_URL + "/posts")
      .then((res) => res.json())
      .then((res) => setBlogs(res));

    fetch(process.env.NEXT_PUBLIC_API_URL + "/enquiry")
      .then((res) => res.json())
      .then((res) => setEnquiries(res));
  }, []);

  const handleAddBlog = () => {
    setCurrentBlog(null);
    setShowPopup(true);
  };

  const handleEditBlog = (blog) => {
    console.log("Editing blog:", blog); // Debug log
    setCurrentBlog(blog);
    setShowPopup(true);
  };

  const handleDeleteBlog = async (blog) => {
    if (confirm("Are you sure you want to delete this blog?")) {
      try {
        // Replace with actual API call
        setBlogs(blogs.filter((b) => b.id !== blog.id));
      } catch (error) {
        console.error("Error deleting blog:", error);
      }
    }
  };

  const handleSubmitBlog = async (formData) => {
    try {
      if (currentBlog) {
        // Update existing blog
        setBlogs(
          blogs.map((blog) =>
            blog.id === currentBlog.id
              ? { ...formData, id: currentBlog.id }
              : blog
          )
        );
      } else {
        // Add new blog
        const newBlog = {
          ...formData,
          id: Math.max(...blogs.map((b) => b.id), 0) + 1, // Generate new ID
        };
        setBlogs([...blogs, newBlog]);
      }
      setShowPopup(false);
    } catch (error) {
      console.error("Error saving blog:", error);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("authToken");
    router.push("/login");
  };

  return (
    <>
      <Head>
        <title>Blog Dashboard</title>
      </Head>

      <div className="min-h-screen bg-gray-100">
        {/* Navigation */}
        <nav className="bg-white shadow-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between h-16 items-center">
              <h1 className="text-xl font-semibold">Dashboard</h1>
              <div className="flex space-x-4">
                <button
                  onClick={() => setActiveTab("blogs")}
                  className={`px-4 py-2 rounded-md ${
                    activeTab === "blogs"
                      ? "bg-blue-600 text-white"
                      : "bg-gray-200"
                  }`}
                >
                  Blogs
                </button>
                <button
                  onClick={() => setActiveTab("enquiries")}
                  className={`px-4 py-2 rounded-md ${
                    activeTab === "enquiries"
                      ? "bg-blue-600 text-white"
                      : "bg-gray-200"
                  }`}
                >
                  Enquiries
                </button>
                <button
                  onClick={handleLogout}
                  className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
                >
                  Logout
                </button>
              </div>
            </div>
          </div>
        </nav>

        {/* Main Content */}
        <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
          <div className="px-4 py-6 sm:px-0">
            {activeTab === "blogs" && (
              <>
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-lg font-medium">My Blogs</h2>
                  <button
                    onClick={handleAddBlog}
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                  >
                    Add New Blog
                  </button>
                </div>

                {isLoading ? (
                  <div className="flex justify-center items-center h-64">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
                  </div>
                ) : (
                  <DataTable
                    data={blogs}
                    onEdit={handleEditBlog}
                    onDelete={handleDeleteBlog}
                  />
                )}
              </>
            )}

            {activeTab === "enquiries" && (
              <div>
                <h2 className="text-lg font-medium mb-6">Enquiries</h2>
                <EnquiryTable data={enquiries} />
              </div>
            )}
          </div>
        </main>

        {/* Popup Form */}
        {showPopup && (
          <PopupForm
            onClose={() => setShowPopup(false)}
            onSubmit={handleSubmitBlog}
            initialData={currentBlog}
          />
        )}
      </div>
    </>
  );
}
