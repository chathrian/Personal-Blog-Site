"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Head from "next/head";
import PopupForm from "@/components/popupForm";
import DataTable from "@/components/dataTable";
import EnquiryTable from "@/components/enquiryTable"; 
import { ToastContainer, toast } from "react-toastify";

export default function Home() {
  const router = useRouter();
  const [blogs, setBlogs] = useState([]);
  const [enquiries, setEnquiries] = useState([]);
  const [showPopup, setShowPopup] = useState(false);
  const [currentBlog, setCurrentBlog] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("blogs");

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
  
        const [blogRes, enquiryRes] = await Promise.all([
          fetch(process.env.NEXT_PUBLIC_API_URL + "/posts"),
          fetch(process.env.NEXT_PUBLIC_API_URL + "/enquiry"),
        ]);
  
        const [blogsData, enquiriesData] = await Promise.all([
          blogRes.json(),
          enquiryRes.json(),
        ]);
  
        setBlogs(blogsData);
        setEnquiries(enquiriesData);
      } catch (error) {
        console.error("Error fetching data:", error);
        toast.error("Failed to load data.");
      } finally {
        setIsLoading(false);
      }
    };
  
    fetchData();
  }, []);

  useEffect(() => {
    // Log all cookies to see if the token is present
    console.log("All cookies:", document.cookie);

    // Get token from cookies
    const token = getCookie('token');
    console.log("Token found:", token);

    if (!token) {
      console.log("No token found, redirecting to login...");
      router.push('/login'); // Redirect to login page if no token
    }
  }, []);

  // Utility function to read cookies
  function getCookie(name) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) {
      return parts.pop().split(';').shift();
    }
    return null;
  }

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
        const res = await fetch(`/api/posts?id=${blog.id}`, {
          method: "DELETE",
        });
        const data = await res.json();
        // Replace with actual API call
        setBlogs(blogs.filter((b) => b.id !== blog.id));
        toast.success("Post Deleted successfully")
      } catch (error) {
        console.error("Error deleting blog:", error);
      }
    }
  };

  const handleSubmitBlog = async (newOrUpdatedBlog) => {
    try {
      if (currentBlog) {
        // Replace updated blog
        setBlogs((prevBlogs) =>
          prevBlogs.map((b) =>
            b._id === newOrUpdatedBlog._id ? newOrUpdatedBlog : b
          )
        );
      } else {
        // Add new blog
        setBlogs((prevBlogs) => [newOrUpdatedBlog, ...prevBlogs]);
      }
      setShowPopup(false);
      setCurrentBlog(null);
    } catch (error) {
      console.error("Error updating blog list:", error);
    }
  };
  

  const handleLogout = async () => {
    document.cookie = 'token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
    router.push('/login');
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
                  <div>
                  <DataTable
                    data={blogs}
                    onEdit={handleEditBlog}
                    onDelete={handleDeleteBlog}
                  />
                  </div>
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
            <ToastContainer position="top-right" autoClose={3000} />
    </>
  );
}
