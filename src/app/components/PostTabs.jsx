'use client';

import { useState } from 'react';

export default function PostTabs({ content }) {
  const [currentTab, setTab] = useState('Overview');

  return (
    <div className="max-w-3xl mx-auto mt-8 px-4">
      <div className="flex justify-center gap-2 sm:gap-4 border-b border-gray-200 dark:border-gray-700">
        {['Overview', 'Gallery', 'Comments', 'Chat'].map((tab) => (
          <button
            key={tab}
            onClick={() => setTab(tab)}
            className={`py-2 px-4 text-sm sm:text-base font-medium transition-all duration-200 ${
              tab === currentTab
                ? 'border-b-2 border-orange-500 text-orange-600 dark:text-orange-400'
                : 'text-gray-500 dark:text-gray-400 hover:text-orange-500'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      <div className="mt-6">
        {currentTab === 'Overview' && (
          <article
            className="prose prose-lg dark:prose-invert max-w-3xl mx-auto leading-8 text-gray-800 dark:text-gray-200"
            dangerouslySetInnerHTML={{ __html: content }}
          />
        )}

        {['Gallery', 'Comments', 'Chat'].includes(currentTab) && (
          <div className="text-center text-gray-500 dark:text-gray-400 py-10 text-lg italic">
            {currentTab} – Coming soon...
          </div>
        )}
      </div>
    </div>
  );
}
