'use client';

import { useState } from 'react';
import { FaBookOpen, FaImages, FaComments, FaRegCommentDots } from 'react-icons/fa';
import CommentBox from '@/app/components/CommentBox';
import { useUser } from '@clerk/nextjs';
import { useRouter, usePathname } from 'next/navigation';

const tabs = [
  { label: 'Overview', icon: <FaBookOpen /> },
  { label: 'Gallery', icon: <FaImages /> },
  { label: 'Comments', icon: <FaComments /> },
  { label: 'Chat', icon: <FaRegCommentDots /> },
];

export default function PostTabs({ content, postId, image }) {
  const [currentTab, setTab] = useState('Overview');
  const { isSignedIn } = useUser();
  const router = useRouter();
  const pathname = usePathname(); // ✅ gets the current post page URL

  return (
    <div className="max-w-3xl mx-auto mt-10 px-4">
      {/* 🔘 Tab Navigation */}
      <div className="flex overflow-x-auto no-scrollbar justify-start sm:justify-center gap-2 sm:gap-4 border-b border-gray-200 dark:border-gray-700 pb-2">
        {tabs.map((tab) => (
          <button
            key={tab.label}
            onClick={() => setTab(tab.label)}
            className={`flex flex-col items-center sm:flex-row sm:gap-2 px-3 py-2 min-w-[80px] sm:min-w-fit rounded-md text-sm font-medium transition-all
              ${
                tab.label === currentTab
                  ? 'text-orange-600 dark:text-orange-400 border-b-2 border-orange-500 bg-orange-50 dark:bg-orange-500/10'
                  : 'text-gray-500 dark:text-gray-400 hover:text-orange-500 hover:bg-orange-50 dark:hover:bg-gray-800'
              }`}
          >
            <span className="text-lg">{tab.icon}</span>
            <span className="hidden sm:inline">{tab.label}</span>
          </button>
        ))}
      </div>

      {/* 📄 Tab Content */}
      <div className="mt-6">
        {currentTab === 'Overview' && (
          <article
            className="prose prose-base sm:prose-lg dark:prose-invert max-w-3xl mx-auto leading-7 sm:leading-8 text-gray-800 dark:text-gray-200"
            dangerouslySetInnerHTML={{ __html: content }}
          />
        )}

        {currentTab === 'Comments' && (
          <div className="max-w-2xl mx-auto">
            {isSignedIn ? (
              <CommentBox postId={postId} />
            ) : (
              <div className="border border-gray-300 dark:border-gray-700 p-4 rounded-md text-center">
                <p className="text-gray-600 dark:text-gray-300 mb-4">
                  Please <strong>sign in</strong> or <strong>sign up</strong> to view and write comments.
                </p>
                <button
                  onClick={() => router.push(`/sign-in?redirect_url=${pathname}`)}
                  className="px-4 py-2 bg-orange-500 text-white rounded hover:bg-orange-600 transition"
                >
                  Go to Sign In
                </button>
              </div>
            )}
          </div>
        )}

        {['Gallery', 'Chat'].includes(currentTab) && (
          <div className="text-center text-gray-500 dark:text-gray-400 py-10 text-base sm:text-lg italic">
            {currentTab} – Coming soon...
          </div>
        )}
      </div>
    </div>
  );
}
