import Image from 'next/image';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import nextDynamic from 'next/dynamic';

import { HiOfficeBuilding, HiArrowLeft, HiArrowRight } from 'react-icons/hi';
import LikeButton from '@/app/components/LikeButton';
import ShareButton from '@/app/components/postComponents/ShareButton';
import { industryInfo } from '@/constants/industryData';

export const metadata = {
  title: 'Experience Book - Real Stories',
  description: 'Read inspiring real-life career experiences from real people.',
};

export const dynamic = 'force-dynamic';

const RecentPosts = nextDynamic(() => import('@/app/components/RecentPosts'), {
  loading: () => <div className="p-6">Loading related posts...</div>,
});

function calculateReadingTime(text) {
  const wordsPerMinute = 200;
  const words = text.trim().split(/\s+/).length;
  return `${Math.ceil(words / wordsPerMinute)} min read`;
}

export default async function PostPage({ params }) {
  const slug = params?.slug;
  if (!slug) notFound();

  let post;
  let previousPost;
  let nextPost;

  try {
    const response = await fetch(`${process.env.URL}/api/post/get`, {
      method: 'POST',
      cache: 'no-store',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ slug }),
    });

    const data = await response.json();
    post = data?.posts?.[0];

    if (post) {
      // Fetch the previous and next posts based on the current post's ID
      const prevAndNextResponse = await fetch(`${process.env.URL}/api/post/prev-next`, {
        method: 'POST',
        cache: 'no-store',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ currentPostId: post._id }),
      });

      if (prevAndNextResponse.ok && prevAndNextResponse.headers.get('content-type')?.includes('application/json')) {
        const prevAndNextData = await prevAndNextResponse.json();
        previousPost = prevAndNextData?.previous;
        nextPost = prevAndNextData?.next;
      } else {
        console.error('Error fetching previous/next posts:', await prevAndNextResponse.text());
      }
    }
  } catch (error) {
    console.error('❌ Error fetching post or next/previous posts:', error);
  }

  if (!post) notFound();

  const readingTime = calculateReadingTime(post.content || '');
  const industry = industryInfo[post.industry?.toLowerCase()];
  const industryBg = industry?.theme?.bg || 'bg-orange-500';
  const industryText = industry?.theme?.text || 'text-white';

  return (
    <main className="max-w-5xl mx-auto px-4 pb-20">
      {/* 🧭 Breadcrumb */}
      <nav className="text-sm text-gray-500 dark:text-gray-400 my-6">
        <Link href="/" className="hover:underline">Home</Link> &gt;{' '}
        <Link href="/post" className="hover:underline">Experiences</Link> &gt;{' '}
        <span className="font-semibold">{post.title}</span>
      </nav>

      <article className="bg-white dark:bg-gray-900 shadow-lg rounded-2xl overflow-hidden">
        {/* 📝 Title and Meta Info */}
        <div className="bg-gradient-to-r from-orange-100 via-white to-orange-100 dark:from-orange-900 dark:via-gray-900 dark:to-orange-900 py-6 sm:py-10 px-5 text-center relative">
          {/* 🟧 Industry Badge */}
          {industry && (
            <Link
              href={`/industry/${post.industry?.toLowerCase()}`}
              className="absolute left-5 top-5 no-underline"
              aria-label={`View more in ${industry.title}`}
            >
              <span
                className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full border shadow-md text-sm font-semibold text-white transition-all duration-200 hover:brightness-110 ${industry?.theme?.bg || 'bg-orange-500'}`}
              >
                <HiOfficeBuilding className="text-white text-base" />
                <span className="capitalize">{industry.title}</span>
              </span>
            </Link>
          )}

          <h1 className="text-2xl sm:text-4xl font-bold text-gray-900 dark:text-white leading-snug mb-4 max-w-xl mx-auto">
            {post.title}
          </h1>

          {/* 🏷️ Meta Info */}
          <div className="flex flex-wrap justify-center items-center gap-2 sm:gap-4 text-xs sm:text-sm text-gray-600 dark:text-gray-400 mb-3">
            <span>📅 {new Date(post.createdAt).toLocaleDateString()}</span>
            <span>⏱️ {readingTime}</span>
            {post.language && <span>🌐 {post.language.toUpperCase()}</span>}
          </div>

          {/* 👤 Author Info */}
          <div className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">
            Written by <span className="font-semibold">{post.author || "Experience Book Team"}</span> • {post.location || "London"}
          </div>
        </div>

        {/* 🖼 Post Image */}
        {post.image && (
          <div className="relative w-full h-48 sm:h-72 md:h-[400px] overflow-hidden">
            <Image
              src={post.image}
              alt={post.title}
              fill
              className="object-cover rounded-b-2xl shadow-inner"
              placeholder="blur"
              blurDataURL="/placeholder.jpg"
            />
          </div>
        )}

        {/* 📖 Article Content */}
        <section className="prose dark:prose-invert prose-lg px-6 sm:px-10 pt-10 pb-12 max-w-none relative">
          {/* 📤 Sticky Share Button */}
          <div className="hidden md:block sticky top-24 float-right ml-4">
            <ShareButton title={post.title} likes={post.likes} avatar={post.image} />
          </div>

          {/* ✍️ Introduction */}
          <h2 className="text-2xl font-bold mb-4">Introduction</h2>
          <div dangerouslySetInnerHTML={{ __html: post.content }} />

          {/* ❤️ Like Button */}
          <div className="mt-10 flex justify-center">
            <LikeButton postId={post._id} initialLikes={post.likes || 0} />
          </div>
        </section>
      </article>

      {/* 📰 Related Posts */}
      <div className="mt-20">
        <h2 className="text-2xl font-bold text-center text-gray-800 dark:text-white mb-6">
          More Stories
        </h2>
        <RecentPosts limit={3} />
      </div>

      {/* ⬅️ Previous and Next Post Links */}
        <div className="flex justify-between mt-10">
          {previousPost && previousPost.slug && (
  <Link
    href={`/post/${previousPost.slug}`}
    className="flex items-center gap-3 text-lg font-semibold text-orange-600 hover:text-orange-800 dark:text-white dark:hover:text-gray-300 py-2 px-4 rounded-md transition duration-200 ease-in-out"
  >
    <HiArrowLeft className="text-xl" /> 
    <span>
      Previous Post :  {previousPost.title.length > 40 ? `${previousPost.title.slice(0, 40)}...` : previousPost.title}
    </span> 
    <span className="text-sm text-gray-500"></span>
  </Link>
)}

          {nextPost && nextPost.slug && (
            <Link
              href={`/post/${nextPost.slug}`}
              className="flex items-center gap-3 text-lg font-semibold text-orange-600 hover:text-orange-800 dark:text-white dark:hover:text-gray-300 py-2 px-4 rounded-md transition duration-200 ease-in-out"
            >
              <span>Next Post : {nextPost.title.length > 40 ? `${nextPost.title.slice(0, 40)}...` : nextPost.title}</span> <span className="text-sm text-gray-500"></span> <HiArrowRight className="text-xl" />
            </Link>
          )}
        </div>


    </main>
  );
}
