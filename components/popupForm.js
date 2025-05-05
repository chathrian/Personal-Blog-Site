import React, { useState, useEffect } from "react";

const PopupForm = ({ onClose, onSubmit, initialData }) => {
  const [stateData, setStateData] = useState({
    title: initialData ? initialData.title : "",
    description: initialData ? initialData.description : "",
    image: initialData ? initialData.image : "", // Initialize with an empty string instead of null
    date: initialData
      ? initialData.created_at
      : new Date().toISOString().split("T")[0],
  });

  useEffect(() => {
    if (initialData) {
      setStateData({
        title: initialData.title,
        description: initialData.description,
        image: initialData.image,
        date: initialData.created_at,
      });
    }
  }, [initialData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setStateData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setStateData((prev) => ({
        ...prev,
        image: file, 
      }));
    }
  };
  

  async function handleSubmit(event) {
    event.preventDefault();
  
    const formData = new FormData();
    formData.append("title", stateData.title);
    formData.append("description", stateData.description);
    formData.append("date", stateData.date);
    if (stateData.image) {
      formData.append("image", stateData.image); // the actual File
    }
  
    try {
      const response = await fetch("http://localhost:3000/api/posts", {
        method: "POST",
        body: formData,
      });
  
      if (!response.ok) {
        let errorMessage = "An unknown error occurred";
        try {
          const errorData = await response.json();
          errorMessage = errorData.message || errorMessage;
        } catch {
          // JSON parsing failed
        }
        throw new Error(errorMessage);
      }
  
      const contentType = response.headers.get("content-type");
      if (contentType && contentType.includes("application/json")) {
        const result = await response.json();
        console.log(result.message);
        alert("Post submitted successfully!");
      } else {
        alert("Post submitted successfully!");
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      alert(`Error: ${error.message}`);
    }
  }
  
  

  return (
    <div className="fixed inset-0 backdrop-blur-xs flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full p-3 max-w-1/3 animate-fade-in">
        <div className="flex justify-between items-center p-4 border-b">
          <h2 className="text-xl font-semibold text-gray-800">
            {initialData ? "Edit Blog" : "Add Blog"}
          </h2>
          <button
            className="text-gray-500 hover:text-gray-700 text-2xl"
            onClick={onClose}
          >
            &times;
          </button>
        </div>

        {/* Form container with scrollable content */}
        <form
          onSubmit={handleSubmit}
          className="p-4 overflow-y-auto max-h-[70vh]"
        >
          <div className="mb-4">
            <label
              htmlFor="title"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Title
            </label>
            <input
              type="text"
              id="title"
              name="title"
              value={stateData.title} // Bind stateData.title
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          <div className="mb-4">
            <label
              htmlFor="description"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Description
            </label>
            <textarea
              id="description"
              name="description"
              value={stateData.description} // Bind stateData.description
              onChange={handleChange}
              rows="4"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          <div className="mb-4">
            <label
              htmlFor="image"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Image
            </label>
            <input
              type="file"
              id="image"
              name="image"
              onChange={handleImageChange}
              accept="image/*"
              className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
            />
            {stateData.image && typeof stateData.image === "string" && (
              <img
                src={stateData.image}
                alt="Current Image"
                className="mt-2 w-24 h-24 object-cover"
              />
            )}
          </div>
          <div className="mb-6">
            <label
              htmlFor="date"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Date
            </label>
            <input
              type="date"
              id="date"
              name="date"
              value={stateData.date} // Bind stateData.date
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          <div className="flex justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              Submit
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PopupForm;
