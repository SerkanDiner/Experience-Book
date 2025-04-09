'use client';

import { useEffect, useState } from 'react';
import ReactPlayer from 'react-player';
import { VideoIcon, UserCircle, Briefcase, Lightbulb } from 'lucide-react';

const VideosPage = () => {
  const [videos, setVideos] = useState([]);

  useEffect(() => {
    const fetchVideos = async () => {
      try {
        const res = await fetch('/api/videos');
        const data = await res.json();
        setVideos(data);
      } catch (err) {
        console.error('Error fetching videos:', err);
      }
    };

    fetchVideos();
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* 🔹 Header */}
      <div className="mb-12 text-center">
        <div className="flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-3 mb-4 text-orange-500">
          <VideoIcon className="w-6 h-6" />
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-semibold tracking-tight">
            Experience Book Video Library
          </h1>
        </div>
        <p className="text-sm sm:text-base md:text-lg text-gray-600 dark:text-gray-400 max-w-3xl mx-auto leading-relaxed">
          Dive into real-world stories from professionals across various industries.
        </p>
        <div className="flex flex-col sm:flex-row justify-center mt-6 gap-4 sm:gap-8 text-gray-500 dark:text-gray-400 text-sm sm:text-base">
          <div className="flex items-center gap-2">
            <UserCircle className="w-5 h-5" />
            <span>Real People</span>
          </div>
          <div className="flex items-center gap-2">
            <Briefcase className="w-5 h-5" />
            <span>Real Careers</span>
          </div>
          <div className="flex items-center gap-2">
            <Lightbulb className="w-5 h-5" />
            <span>Real Insights</span>
          </div>
        </div>
      </div>

      {/* 🔹 Video Cards */}
      {videos.length === 0 ? (
        <p className="text-center text-gray-500 dark:text-gray-400 text-base sm:text-lg">
          No videos have been shared yet.
        </p>
      ) : (
        <div className="grid gap-6 sm:gap-8 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
          {videos.map((video) => (
            <div
              key={video._id}
              className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl shadow-sm hover:shadow-md transition-shadow duration-200"
            >
              <div className="relative w-full pt-[56.25%] rounded-t-xl overflow-hidden">
                <ReactPlayer
                  url={video.url}
                  width="100%"
                  height="100%"
                  className="absolute top-0 left-0"
                  controls
                />
              </div>
              <div className="p-4">
                <h2 className="text-base sm:text-lg font-semibold text-gray-800 dark:text-white mb-1 line-clamp-2">
                  {video.title}
                </h2>
                {video.description && (
                  <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-3">
                    {video.description}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default VideosPage;
