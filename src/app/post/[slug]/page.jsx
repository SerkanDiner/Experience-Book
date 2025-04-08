import CallToAction from '@/app/components/CallToAction';
import RecentPosts from '@/app/components/RecentPosts';
import { Button } from 'flowbite-react';
import Link from 'next/link';
import LikeButton from '@/app/components/LikeButton';
import PostTabs from '@/app/components/PostTabs';
import CommentBox from '@/app/components/CommentBox'; // ✅ CommentBox import (Clerk handles user)
import ShareButton from '@/app/components/ShareButton'; // ✅ add this import

// ✅ Main Post Page Component
export default async function PostPage({ params }) {
  const slug = params?.slug || '';
  let post = null;

  try {
    const result = await fetch(`${process.env.URL}/api/post/get`, {
      method: 'POST',
      body: JSON.stringify({ slug }),
      cache: 'no-store',
      headers: { 'Content-Type': 'application/json' },
    });
    const data = await result.json();
    post = data.posts?.[0];
  } catch (error) {
    post = { title: 'Failed to load post' };
  }

  if (!post || post.title === 'Failed to load post') {
    return (
      <main className="p-4 flex flex-col max-w-6xl mx-auto min-h-screen">
        <h2 className="text-3xl mt-10 p-3 text-center font-serif max-w-2xl mx-auto lg:text-4xl">
          Post not found
        </h2>
      </main>
    );
  }

  return (
    <main className="p-4 flex flex-col max-w-6xl mx-auto min-h-screen">

      {/* 🌟 Post Header Section */}
      <section className="flex flex-col items-center justify-center text-center px-4 pt-10 pb-6 border-b border-gray-200 dark:border-gray-800">
        {/* Title */}
        <h1 className="text-2xl sm:text-4xl font-extrabold font-serif text-gray-900 dark:text-white max-w-2xl leading-tight mb-4">
          {post.title}
        </h1>

        {/* Tags */}
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

        {/* Meta Info: date, read time, like, share */}
        <div className="flex justify-center items-center flex-wrap gap-3 text-xs sm:text-sm text-gray-500 dark:text-gray-400 mb-6">
          <span>{new Date(post.createdAt).toLocaleDateString()}</span>
          <span className="italic">
            {(post.content?.length / 1000).toFixed(0)} mins read
          </span>
          <LikeButton postId={post._id} initialLikes={post.likes || 0} />
          <ShareButton title={post.title} likes={post.likes} avatar={post.image} />
        </div>

        {/* Hero Image */}
        <div className="w-full max-w-3xl rounded-xl overflow-hidden shadow-md mb-6 border border-gray-200 dark:border-gray-800">
        <img
            src={post.image}
            alt={post.title}
            loading="lazy"
            className="w-full object-cover max-h-[400px] sm:max-h-[500px]"
          />
        </div>
      </section>

      {/* 🧹 Tabs Section */}
      <PostTabs content={post.content} postId={post._id} image={post.image} />

      {/* 📰 Related Posts */}
      <div className="mt-14 px-4">
        <RecentPosts limit={3} />
      </div>
    </main>
  );
}
