'use client';

import { Tabs } from 'flowbite-react';
import { Briefcase, Award, Mail } from 'lucide-react';
import PostCard from '@/app/components/PostCard';

export default function UserTabs({ posts, gamification }) {
  return (
    <Tabs className="text-sm sm:text-base">

      <Tabs.Item title="Experiences" icon={Briefcase}>
        {posts.length > 0 ? (
          <div className="grid sm:grid-cols-2 gap-4 mt-4">
            {posts.map((post) => (
              <PostCard key={post._id} post={post} />
            ))}
          </div>
        ) : (
          <p className="text-center text-gray-500 text-sm mt-4">
            This user hasn’t shared any stories yet.
          </p>
        )}
      </Tabs.Item>

      <Tabs.Item title="Gamification" icon={Award}>
        {gamification ? (
          <div className="text-center mt-4">
            <p className="text-orange-500 font-bold text-lg">Level {gamification.level}</p>
            <p className="text-sm text-gray-500 dark:text-gray-400">XP: {gamification.xp}</p>
            {gamification.badges?.length > 0 && (
              <div className="flex flex-wrap justify-center gap-2 mt-3">
                {gamification.badges.map((badge, index) => (
                  <span
                    key={index}
                    className="text-xs bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full font-medium"
                  >
                    {badge}
                  </span>
                ))}
              </div>
            )}
          </div>
        ) : (
          <p className="text-center text-gray-500 text-sm mt-4">
            No gamification data available.
          </p>
        )}
      </Tabs.Item>

      <Tabs.Item title="Contact" icon={Mail}>
        <div className="text-center mt-4">
          <p className="text-gray-600 dark:text-gray-300">
            For privacy reasons, direct contact is limited.
          </p>
          <p className="text-sm mt-2 text-gray-400 dark:text-gray-500">
            If you want to ask a question or get mentorship, use the 'Ask Question' or 'Request Mentorship' button on their stories.
          </p>
        </div>
      </Tabs.Item>
    </Tabs>
  );
}
