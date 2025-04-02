import CallToAction from '@/app/components/CallToAction';
import RecentPosts from '@/app/components/RecentPosts';
import { Button } from 'flowbite-react';
import Link from 'next/link';
import LikeButton from '@/app/components/LikeButton';
import PostTabs from '@/app/components/PostTabs'; // 👈 Add this

export default async function PostPage({ params }) {
  let post = null;
  try {
    const result = await fetch(`${process.env.URL}/api/post/get`, {
      method: 'POST',
      body: JSON.stringify({ slug: params.slug }),
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

      {/* Title */}
      <h1 className="text-3xl sm:text-4xl font-extrabold text-center font-serif max-w-3xl mx-auto text-gray-900 dark:text-white mt-10 leading-snug">
        {post.title}
      </h1>

      {/* Tags */}
      <div className="flex flex-wrap justify-center gap-2 mt-4 mb-2">
        {Array.isArray(post.categories) &&
          post.categories.map((category, index) => (
            <Link key={index} href={`/search?category=${category}`}>
              <span className="text-xs bg-orange-100 text-orange-600 px-3 py-1 rounded-full font-medium hover:bg-orange-200 transition cursor-pointer">
                {category}
              </span>
            </Link>
          ))}
      </div>

      {/* Meta */}
      <div className="flex justify-center items-center flex-wrap gap-3 text-sm text-gray-500 dark:text-gray-400 mb-6">
        <span>{new Date(post.createdAt).toLocaleDateString()}</span>
        <span className="italic">
          {(post.content?.length / 1000).toFixed(0)} mins read
        </span>
        <LikeButton initialLikes={post.likes || 0} />
      </div>

      {/* Image */}
      <div className="w-full flex justify-center items-center mb-10">
        <div className="w-full max-w-4xl bg-white dark:bg-gray-900 rounded-xl overflow-hidden shadow-md p-2">
          <img
            src={post.image}
            alt={post.title}
            loading="lazy"
            className="w-full max-h-[550px] object-contain rounded-lg"
          />
        </div>
      </div>

      {/* Tabs Section */}
      <PostTabs content={post.content} />

      {/* Call to Action */}
      <div className="max-w-4xl mx-auto w-full mt-14 px-4">
        <CallToAction />
      </div>

      {/* Related Posts */}
      <div className="mt-14 px-4">
        <RecentPosts limit={3} />
      </div>
    </main>
  );
}
