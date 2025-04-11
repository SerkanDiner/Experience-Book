// ✅ Static Metadata (SEO-Friendly)
export const metadata = {
  title: 'Experience Book - Real Stories',
  description: 'Read inspiring real-life career experiences from real people.',
};

// ✅ Move config before dynamic import to avoid conflict
export const dynamicSetting = 'force-dynamic';
 'force-dynamic';

import Image from 'next/image';
import { notFound } from 'next/navigation';
import LikeButton from '@/app/components/LikeButton';
import ShareButton from '@/app/components/ShareButton';
import Link from 'next/link';
import dynamic from 'next/dynamic';

// ✅ Lazy load heavy components for performance
const PostTabs = dynamic(() => import('@/app/components/PostTabs'), {
  loading: () => <div className="p-6">Loading post content...</div>,
});

const RecentPosts = dynamic(() => import('@/app/components/RecentPosts'), {
  loading: () => <div className="p-6">Loading related posts...</div>,
});

export default async function PostPage({ params }) {
  const slug = params?.slug;

  if (!slug) notFound();

  let post;

  try {
    const response = await fetch(`${process.env.URL}/api/post/get`, {
      method: 'POST',
      cache: 'no-store', // ✅ Always get latest content
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ slug }),
    });

    const data = await response.json();
    post = data?.posts?.[0];
  } catch (error) {
    console.error('❌ Error fetching post:', error);
  }

  if (!post) notFound();

  return (
    <main className="p-4 flex flex-col max-w-6xl mx-auto min-h-screen">
      {/* 🧡 Header Section */}
      <section className="flex flex-col items-center justify-center text-center px-4 pt-10 pb-6 border-b border-gray-200 dark:border-gray-800">
        <h1 className="text-2xl sm:text-4xl font-extrabold font-serif text-gray-900 dark:text-white max-w-2xl leading-tight mb-4">
          {post.title}
        </h1>

        {/* 🏷️ Tags */}
        <div className="flex flex-wrap justify-center gap-2 mb-4">
          {Array.isArray(post.categories) &&
            post.categories.map((category, index) => (
              <Link key={index} href={`/search?category=${category}`}>
                <span className="text-xs bg-orange-100 text-orange-600 px-3 py-1 rounded-full font-semibold hover:bg-orange-200 transition cursor-pointer">
                  {category}
                </span>
              </Link>
            ))}
        </div>

        {/* 📅 Meta Info */}
        <div className="flex justify-center items-center flex-wrap gap-3 text-xs sm:text-sm text-gray-500 dark:text-gray-400 mb-6">
          <span>{new Date(post.createdAt).toLocaleDateString()}</span>
          <span className="italic">
            {(post.content?.length / 1000).toFixed(0)} mins read
          </span>
          <LikeButton postId={post._id} initialLikes={post.likes || 0} />
          <ShareButton title={post.title} likes={post.likes} avatar={post.image} />
        </div>

        {/* 🖼️ Image & Info Card */}
        <div className="w-full max-w-3xl rounded-xl overflow-hidden shadow-md mb-6 border border-gray-200 dark:border-gray-800">
          <Image
            src={post.image}
            alt={post.title}
            width={1200}
            height={600}
            placeholder="blur"
            blurDataURL="/placeholder.jpg"
            priority={true} // ✅ Boost LCP
            className="w-full object-cover rounded-t-lg"
          />

          <div className="bg-gray-50 dark:bg-gray-800 px-6 py-4 text-sm text-gray-700 dark:text-gray-300 text-left border-t border-gray-200 dark:border-gray-700">
            <p><span className="font-semibold text-orange-500">Name:</span> {post.author}</p>
            <p><span className="font-semibold text-orange-500">Job Title:</span> {post.jobTitle}</p>
            <p><span className="font-semibold text-orange-500">Location:</span> {post.location}</p>
          </div>
        </div>
      </section>

      {/* 📑 Tabbed Content (Main Post Body) */}
      <PostTabs content={post.content} postId={post._id} image={post.image} />

      {/* 📰 Related / Recent Posts */}
      <div className="mt-14 px-4">
        <RecentPosts limit={3} />
      </div>
    </main>
  );
}
