import PostCard from '@/app/components/PostCard';
import { connect } from '@/lib/mongodb/mongoose';
import Post from '@/lib/models/post.model';

export default async function IndustryPage({ params }) {
  await connect();
  const posts = await Post.find({ industry: params.slug });

  const plainPosts = posts.map(post => JSON.parse(JSON.stringify(post)));

  return (
    <div className="max-w-7xl mx-auto px-6 py-14">
      {/* 🧡 Heading Section */}
      <div className="text-center mb-12">
        <h1 className="text-4xl font-extrabold text-orange-500 capitalize">
          {params.slug.replace(/-/g, ' ')} Industry
        </h1>
        <p className="text-gray-600 dark:text-gray-300 mt-3 max-w-2xl mx-auto text-sm sm:text-base">
          Discover real-life journeys and success stories from people working in the {params.slug.replace(/-/g, ' ')} industry. Learn from their challenges, tips, and career paths to shape your own future.
        </p>
      </div>

      {/* 📄 Posts */}
      {plainPosts.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {plainPosts.map(post => (
            <PostCard key={post._id} post={post} />
          ))}
        </div>
      ) : (
        <div className="text-center py-20">
          <p className="text-lg text-gray-500 dark:text-gray-400">
            No shared experiences yet in this industry.
          </p>
          <p className="text-sm text-gray-400 mt-1">
            Be the first to inspire others by sharing your story!
          </p>
        </div>
      )}
    </div>
  );
}
