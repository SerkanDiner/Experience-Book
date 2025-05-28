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
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      {/* 🧡 Intro Section */}
      <section className="mb-14 text-center">
        <div className="flex justify-center items-center gap-3 text-orange-500 mb-3">
          <VideoIcon className="w-6 h-6" />
          <h1 className="text-3xl sm:text-4xl font-bold">Experience Book Video Library</h1>
        </div>
        <h2 className="text-sm uppercase text-orange-400 tracking-wide font-semibold mt-2 mb-3">
          Visual Stories That Inspire
        </h2>
        <p className="text-base text-gray-600 dark:text-gray-400 max-w-3xl mx-auto leading-relaxed">
          Watch professionals talk about their real career experiences. From interviews to day-in-the-life clips, this library is designed to help you discover new paths, understand real roles, and get inspired — visually.
        </p>

        <div className="flex flex-wrap justify-center gap-6 mt-6 text-gray-500 dark:text-gray-400">
          <div className="flex items-center gap-2 text-sm sm:text-base">
            <UserCircle className="w-5 h-5 text-orange-400" />
            Real People
          </div>
          <div className="flex items-center gap-2 text-sm sm:text-base">
            <Briefcase className="w-5 h-5 text-orange-400" />
            Real Careers
          </div>
          <div className="flex items-center gap-2 text-sm sm:text-base">
            <Lightbulb className="w-5 h-5 text-orange-400" />
            Visual Insights
          </div>
        </div>
      </section>

      {/* 🎥 Video Grid */}
      {videos.length === 0 ? (
        <p className="text-center text-gray-500 dark:text-gray-400 text-base sm:text-lg">
          No videos have been shared yet.
        </p>
      ) : (
        <section className="grid gap-10 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
          {videos.map((video) => (
            <div
              key={video._id}
              className="bg-white dark:bg-gray-900 rounded-2xl shadow-md hover:shadow-lg transition-shadow duration-300 border border-orange-100 dark:border-orange-700 overflow-hidden"
            >
              {/* 🔺 Video Player */}
              <div className="relative w-full pt-[56.25%]">
                <ReactPlayer
                  url={video.url}
                  width="100%"
                  height="100%"
                  className="absolute top-0 left-0"
                  controls
                />
              </div>

              {/* 📄 Video Details */}
              <div className="p-5">
                <h2 className="text-lg font-bold text-gray-800 dark:text-white mb-2 line-clamp-2">
                  {video.title}
                </h2>
                {video.description && (
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-3 line-clamp-3">
                    {video.description}
                  </p>
                )}

                {video.industry && (
                  <span className="text-xs inline-block bg-orange-100 text-orange-600 px-3 py-1 rounded-full capitalize">
                    {video.industry}
                  </span>
                )}
              </div>
            </div>
          ))}
        </section>
      )}
    </main>
  );
};

export default VideosPage;
