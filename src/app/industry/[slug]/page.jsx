import PostCard from '@/app/components/PostCard';
import { connect } from '@/lib/mongodb/mongoose';
import Post from '@/lib/models/post.model';
import { industryInfo } from '@/constants/industryData';
import IndustryOverview from '@/app/components/IndustryOverview';
import IndustrySelect from '@/app/components/IndustrySelect';
import Link from 'next/link';
import { FaArrowLeft, FaArrowRight } from 'react-icons/fa';

export default async function IndustryPage({ params }) {
  await connect();

  const posts = await Post.find({ industry: params.slug, status: 'approved' });
  const plainPosts = posts.map(post => JSON.parse(JSON.stringify(post)));

  const industry = industryInfo[params.slug];
  const industryKeys = Object.keys(industryInfo);
  const currentIndex = industryKeys.indexOf(params.slug);

  const prevIndustry = industryKeys[currentIndex - 1];
  const nextIndustry = industryKeys[currentIndex + 1];

  return (
    <div className="max-w-7xl mx-auto px-6 py-14">
      {/* 🔶 Industry Info */}
      <IndustryOverview industry={industry} fallbackSlug={params.slug} />

      {/* 🔽 Dropdown to Jump */}
      <IndustrySelect currentSlug={params.slug} />

      {/* 📄 Posts */}
      {plainPosts.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {plainPosts.map((post) => (
            <PostCard key={post._id} post={post} />
          ))}
        </div>
      ) : (
        <div className="text-center py-20">
          <p className="text-lg text-gray-500 dark:text-gray-400">
            No shared experiences yet in this industry.
          </p>
          <p className="text-sm text-gray-400 mt-1 mb-6">
            Be the first to inspire others by sharing your story!
          </p>
          <a
            href="/share"
            className="inline-block bg-orange-400 hover:bg-orange-500 text-white font-semibold px-6 py-2 rounded-full transition"
          >
            Share Your Experience
          </a>
        </div>
      )}

      {/* ⏮️ Navigation */}
      <div className="flex flex-col sm:flex-row justify-between items-center mt-16 gap-4">
        {/* 🔙 Previous Button */}
        {prevIndustry ? (
          <Link
            href={`/industry/${prevIndustry}`}
            className="flex items-center gap-2 px-5 py-2 rounded bg-white dark:bg-gray-900 text-orange-600 border border-orange-400 hover:bg-orange-100 transition"
          >
            <FaArrowLeft />
            {industryInfo[prevIndustry]?.title || prevIndustry}
          </Link>
        ) : <div />}

        {/* ➡️ Next Button */}
        {nextIndustry ? (
          <Link
            href={`/industry/${nextIndustry}`}
            className="flex items-center gap-2 px-5 py-2 rounded bg-white dark:bg-gray-900 text-orange-600 border border-orange-400 hover:bg-orange-100 transition"
          >
            {industryInfo[nextIndustry]?.title || nextIndustry}
            <FaArrowRight />
          </Link>
        ) : <div />}
      </div>
    </div>
  );
}
