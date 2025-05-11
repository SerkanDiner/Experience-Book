'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { FaFileAlt, FaBriefcase, FaUsers, FaShoppingBag } from 'react-icons/fa';
import PostCard from '@/app/components/postComponents/PostCard';
import ProfileCard from '@/app/components/profile/ProfileCard';

export default function IndustryTabs({ posts, industry, slug }) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const tabFromURL = searchParams.get('tab');
  const [activeTab, setActiveTab] = useState(tabFromURL || 'posts');
  const [profiles, setProfiles] = useState([]);
  const [loadingProfiles, setLoadingProfiles] = useState(false);

  const tabs = [
    { id: 'posts', label: 'Posts', icon: <FaFileAlt size={16} /> },
    { id: 'jobs', label: 'Jobs', icon: <FaBriefcase size={16} /> },
    { id: 'users', label: 'Users', icon: <FaUsers size={16} /> },
    { id: 'products', label: 'Products', icon: <FaShoppingBag size={16} /> },
  ];

  const handleTabClick = (tabId) => {
    setActiveTab(tabId);
    const params = new URLSearchParams(searchParams);
    params.set('tab', tabId);
    router.push(`?${params.toString()}`, { scroll: false });
  };

  useEffect(() => {
    if (activeTab === 'users') {
      setLoadingProfiles(true);
      fetch(`/api/profile/byIndustry?industry=${slug}`)
        .then((res) => res.json())
        .then((data) => setProfiles(data))
        .catch((err) => console.error('❌ Failed to load profiles:', err))
        .finally(() => setLoadingProfiles(false));
    }
  }, [activeTab, slug]);

  return (
    <div className="mt-10">
      {/* SEO-Friendly Tabs */}
      <div className="flex flex-wrap justify-center gap-3 mb-10">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => handleTabClick(tab.id)}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-semibold transition-all duration-200 border shadow-sm
              ${
                activeTab === tab.id
                  ? 'bg-orange-500 text-white border-orange-600 shadow-lg scale-105'
                  : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border-gray-300 hover:bg-orange-50'
              }`}
          >
            {tab.icon}
            <span>{tab.label}</span>
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div>
        {activeTab === 'posts' && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {posts.map((post, index) => (
              <PostCard key={post._id} post={post} index={index} />
            ))}
          </div>
        )}

        {activeTab === 'jobs' && (
          <div className="text-center text-gray-600 dark:text-gray-400 py-10">
            🚧 Jobs section coming soon...
          </div>
        )}

        {activeTab === 'users' && (
          <>
            {loadingProfiles ? (
              <div className="text-center text-gray-500 dark:text-gray-400 py-10">
                Loading profiles...
              </div>
            ) : profiles.length === 0 ? (
              <div className="text-center text-gray-500 dark:text-gray-400 py-10">
                No public profiles in this industry yet.
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                {profiles.map((profile) => (
                  <ProfileCard key={profile._id} profile={profile} />
                ))}
              </div>
            )}
          </>
        )}

        {activeTab === 'products' && (
          <div className="text-center text-gray-600 dark:text-gray-400 py-10">
            🚧 Products for this industry coming soon...
          </div>
        )}
      </div>
    </div>
  );
}
