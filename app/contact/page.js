"use client";

import { useState, useEffect } from "react";

export default function Contact() {
  const [inputs, setInputs] = useState({});
  const [message, setMessage] = useState("");

  useEffect(() => {
    const today = new Date().toISOString().split('T')[0];
    setInputs((prevState) => ({
      ...prevState,
      date: today, 
    }));
  }, []);

  const handleChange = (e) => {
    setInputs((state) => {
      return { ...state, [e.target.name]: e.target.value };
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    fetch(process.env.NEXT_PUBLIC_API_URL + "/enquiry", {
      method: "POST",
      body: JSON.stringify(inputs),
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((res) => res.json())
      .then((res) => {
        setMessage(res.message);
        setInputs({});
        setTimeout(() => {
          setMessage("");
        }, 5000);
      });
  };

  return (
    <main className="container mx-auto mt-5 px-4 py-6 flex justify-center flex-col gap-4">
      <h2 className="text-4xl font-bold mb-4">Contact Us</h2>
      <form className="w-full max-w-lg" onSubmit={handleSubmit}>
        <div className="flex items-center mb-4">
          <label htmlFor="name" className="w-1/4">
            Name:
          </label>
          <input
            onChange={handleChange}
            required
            name="name"
            type="text"
            id="name"
            value={inputs.name ?? ""}
            className="border rounded px-2 py-1 w-3/4"
          />
        </div>
        <div className="flex items-center mb-4">
          <label htmlFor="email" className="w-1/4">
            Email:
          </label>
          <input
            name="email"
            required
            value={inputs.email ?? ""}
            onChange={handleChange}
            type="email"
            id="email"
            className="border rounded px-2 py-1 w-3/4"
          />
        </div>
        <div className="flex items-center mb-4">
          <label htmlFor="message" className="w-1/4">
            Message:
          </label>
          <textarea
            required
            name="message"
            onChange={handleChange}
            value={inputs.message ?? ""}
            id="message"
            className="border rounded px-2 py-1 w-3/4"
            rows="4"
          ></textarea>
        </div>
        
        {/* Hidden Date Field */}
        <input
          type="hidden"
          name="date"
          value={inputs.date} // The value of the hidden field will be today's date
        />

        <button
          type="submit"
          className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded"
        >
          Submit
        </button>
      </form>
      {message && <p>{message}</p>}
    </main>
  );
}
