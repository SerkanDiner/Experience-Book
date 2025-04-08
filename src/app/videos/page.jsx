import { connectToDB } from "@/lib/mongodb/mongoose";
import Video from "@/lib/models/video.model";
import { VideoIcon, UserCircle, Briefcase, Lightbulb } from "lucide-react";

export const dynamic = "force-dynamic";

const VideosPage = async () => {
  await connectToDB();
  const videos = await Video.find().sort({ createdAt: -1 });

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      {/* 🔹 Professional Header Section */}
      <div className="mb-12 text-center">
        <div className="flex items-center justify-center gap-3 mb-3 text-orange-500">
          <VideoIcon className="w-6 h-6" />
          <h1 className="text-3xl md:text-4xl font-semibold tracking-tight">
            Experience Book Video Library
          </h1>
        </div>

        <p className="text-base md:text-lg text-gray-600 dark:text-gray-400 max-w-3xl mx-auto leading-relaxed">
          Dive into real-world stories from professionals across various industries.
          Discover their career paths, challenges, turning points, and valuable insights — all in video format.
        </p>

        <div className="flex justify-center mt-6 gap-8 text-gray-500 dark:text-gray-400">
          <div className="flex items-center gap-2 text-sm md:text-base">
            <UserCircle className="w-5 h-5" /> Real People
          </div>
          <div className="flex items-center gap-2 text-sm md:text-base">
            <Briefcase className="w-5 h-5" /> Real Careers
          </div>
          <div className="flex items-center gap-2 text-sm md:text-base">
            <Lightbulb className="w-5 h-5" /> Real Insights
          </div>
        </div>
      </div>

      {/* 🔹 Video Cards Grid */}
      {videos.length === 0 ? (
        <p className="text-center text-gray-500 text-lg">
          No videos have been shared yet.
        </p>
      ) : (
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {videos.map((video) => (
            <div
              key={video._id}
              className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200"
            >
              <div className="aspect-video rounded-t overflow-hidden">
                <div
                  className="w-full h-full"
                  dangerouslySetInnerHTML={{ __html: video.embedCode }}
                />
              </div>

              <div className="p-4">
                <h2 className="text-lg font-semibold text-gray-800 dark:text-white mb-1 line-clamp-2">
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
