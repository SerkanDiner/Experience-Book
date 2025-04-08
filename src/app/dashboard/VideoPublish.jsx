"use client";

import { useState } from "react";

const VideoPublish = () => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [embedCode, setEmbedCode] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSuccessMsg("");

    try {
      const res = await fetch("/api/videos", {
        method: "POST",
        headers: {
          "Content-Type": "application/json", // ✅ Required!
        },
        body: JSON.stringify({ title, description, embedCode }),
      });

      if (!res.ok) {
        const text = await res.text();
        throw new Error(text);
      }

      setSuccessMsg("✅ Video submitted successfully!");
      setTitle("");
      setDescription("");
      setEmbedCode("");
    } catch (err) {
      console.error("❌ Error:", err.message);
      alert("Something went wrong: " + err.message);
    }

    setIsSubmitting(false);
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold text-orange-500 mb-6">🎥 Publish a YouTube Video</h1>

      {successMsg && (
        <div className="mb-4 p-3 text-green-700 bg-green-100 border border-green-300 rounded">
          {successMsg}
        </div>
      )}

      <form
        onSubmit={handleSubmit}
        className="space-y-6 bg-white dark:bg-gray-900 p-6 rounded-lg shadow-lg border border-gray-100 dark:border-gray-800"
      >
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Video Title
          </label>
          <input
            type="text"
            placeholder="e.g., My Tech Journey"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-orange-400 dark:bg-gray-800 dark:text-white dark:border-gray-700"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Short Description
          </label>
          <textarea
            placeholder="Tell us what this video is about..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded h-24 resize-none focus:outline-none focus:ring-2 focus:ring-orange-400 dark:bg-gray-800 dark:text-white dark:border-gray-700"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            YouTube Embed Code
          </label>
          <textarea
            placeholder={`Paste iframe code here, like:\n<iframe src="..." ...></iframe>`}
            value={embedCode}
            onChange={(e) => setEmbedCode(e.target.value)}
            required
            className="w-full p-3 border border-gray-300 rounded h-28 resize-none focus:outline-none focus:ring-2 focus:ring-orange-400 dark:bg-gray-800 dark:text-white dark:border-gray-700"
          />
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className={`w-full py-3 text-white font-semibold rounded transition ${
            isSubmitting
              ? "bg-orange-300 cursor-not-allowed"
              : "bg-orange-400 hover:bg-orange-500"
          }`}
        >
          {isSubmitting ? "Publishing..." : "Publish Video"}
        </button>
      </form>
    </div>
  );
};

export default VideoPublish;
