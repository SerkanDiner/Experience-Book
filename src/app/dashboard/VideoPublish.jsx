"use client";

import { useState } from "react";
import ReactPlayer from "react-player";

const VideoPublish = () => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [url, setUrl] = useState("");
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
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ title, description, url }),
      });

      if (!res.ok) {
        const text = await res.text();
        throw new Error(text);
      }

      setSuccessMsg("✅ Video submitted successfully!");
      setTitle("");
      setDescription("");
      setUrl("");
    } catch (err) {
      console.error("❌ Error:", err.message);
      alert("Something went wrong: " + err.message);
    }

    setIsSubmitting(false);
  };

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-3xl font-bold text-center text-orange-500 mb-10">
        🎥 Share Your Video Experience
      </h1>

      {successMsg && (
        <div className="mb-6 p-3 text-green-700 bg-green-100 border border-green-300 rounded text-center">
          {successMsg}
        </div>
      )}





                {/* 👁️ Live Preview */}
                <div className="mt-10 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 shadow-md p-6 rounded-xl">
                  <h2 className="text-xl font-semibold text-gray-700 dark:text-white mb-4 flex items-center gap-2">
                    👁️ Live Preview
                  </h2>

                  <div className="rounded-xl overflow-hidden border border-gray-300 dark:border-gray-700 shadow-sm">
                    {/* 🎬 Video Player */}
                    <div className="w-full aspect-video bg-black">
                      {url && ReactPlayer.canPlay(url) && (
                        <ReactPlayer
                          url={url}
                          width="100%"
                          height="100%"
                          controls
                          className="react-player"
                        />
                      )}
                    </div>

                    {/* 📄 Title & Description */}
                    <div className="p-4">
                      <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-1 truncate">
                        {title || "Video title will appear here..."}
                      </h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-3">
                        {description || "Description will appear here..."}
                      </p>
                    </div>
                  </div>
                </div>




          {/* 📝 Form */}
          <form
                  onSubmit={handleSubmit}
                  className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 shadow-md p-6 rounded-xl space-y-6"
                >
                  <h2 className="text-xl font-semibold text-gray-700 dark:text-white flex items-center gap-2">
                    🎯 Fill Out the Video Info
                  </h2>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Title
                    </label>
                    <input
                      type="text"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      placeholder="e.g., My Journey into Tech"
                      required
                      className="w-full p-3 border rounded-md dark:bg-gray-800 dark:border-gray-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-orange-400"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Description
                    </label>
                    <textarea
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      placeholder="Short description about the video"
                      className="w-full p-3 border rounded-md h-24 resize-none dark:bg-gray-800 dark:border-gray-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-orange-400"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      YouTube / Vimeo URL
                    </label>
                    <input
                      type="url"
                      value={url}
                      onChange={(e) => setUrl(e.target.value)}
                      placeholder="https://youtube.com/watch?v=123..."
                      required
                      className="w-full p-3 border rounded-md dark:bg-gray-800 dark:border-gray-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-orange-400"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className={`w-full py-3 text-white font-semibold rounded-md transition ${
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
