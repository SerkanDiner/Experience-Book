'use client';

import { useState, useEffect } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import {
  FaLinkedin,
  FaTwitter,
  FaGithub,
  FaUser,
  FaBook,
  FaComments,
  FaShareAlt,
} from 'react-icons/fa';
import QuestionForm from '@/app/components/QuestionForm';
import QuestionList from '@/app/components/Questionlist';
import { useUser } from '@clerk/nextjs';

export default function ClientProfilePage({ profile }) {
  const { user } = useUser();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const tabFromUrl = searchParams.get('tab');
  const [activeTab, setActiveTab] = useState(tabFromUrl || 'About');
  const [newProfileQuestion, setNewProfileQuestion] = useState(null);

  const formattedDate = profile.createdAt
    ? new Date(profile.createdAt).toLocaleDateString()
    : 'Unknown';

  const tabs = [
    { label: 'About', icon: <FaUser className="text-orange-400" /> },
    { label: 'Experiences', icon: <FaBook className="text-orange-400" /> },
    { label: 'Q&A', icon: <FaComments className="text-orange-400" /> },
    { label: 'Social', icon: <FaShareAlt className="text-orange-400" /> },
  ];

  // Sync tab to URL when changed
  const handleTabClick = (tabLabel) => {
    setActiveTab(tabLabel);
    const url = new URL(window.location.href);
    url.searchParams.set('tab', tabLabel);
    window.history.replaceState({}, '', url);
  };

  return (
    <main className="max-w-6xl mx-auto px-4 pb-20">
      {/* 🟧 Profile Banner */}
      <div className="relative bg-gradient-to-br from-orange-400 to-yellow-300 dark:from-orange-500 dark:to-yellow-500 py-16 px-8 text-white text-center rounded-t-3xl shadow-md">
        <div className="absolute top-4 right-6 text-xs text-orange-100 font-mono">
          🗓️ Joined: {formattedDate}
        </div>
        <div className="w-32 h-32 mx-auto mb-4 rounded-full border-4 border-white overflow-hidden shadow-lg">
          <img
            src={`https://ui-avatars.com/api/?name=${encodeURIComponent(profile.name)}&background=orange&color=fff&size=512`}
            alt={profile.name}
            className="object-cover w-full h-full"
          />
        </div>
        <h1 className="text-4xl font-extrabold drop-shadow">{profile.name}</h1>
        <p className="mt-1 text-sm italic opacity-90">{profile.jobTitle}</p>
        <span className="inline-block mt-3 bg-white text-orange-500 text-xs font-semibold px-4 py-1 rounded-full uppercase shadow">
          {profile.industry}
        </span>
        {profile.languages?.length > 0 && (
          <p className="mt-2 text-xs text-orange-100 italic">
            🌐 Speaks: {profile.languages.join(', ')}
          </p>
        )}
      </div>

      {/* 📄 Main Card */}
      <article className="bg-white dark:bg-gray-900 border border-orange-200 dark:border-orange-800 shadow-lg rounded-b-3xl overflow-hidden transition">
        <div className="px-6 sm:px-10 pt-6 pb-12">
          {/* 🗂 Tab Menu */}
          <nav className="flex justify-center gap-6 sm:gap-10 mb-8 border-b border-orange-100 dark:border-orange-700">
            {tabs.map((tab) => (
              <button
                key={tab.label}
                onClick={() => handleTabClick(tab.label)}
                className={`pb-2 flex items-center gap-2 font-semibold text-sm sm:text-base transition-all duration-200 ${
                  activeTab === tab.label
                    ? 'border-b-2 border-orange-500 text-orange-500'
                    : 'text-gray-500 dark:text-gray-400 hover:text-orange-400'
                }`}
              >
                {tab.icon}
                {tab.label}
              </button>
            ))}
          </nav>

          {/* 🔀 Tab Content */}
          <section className="min-h-[350px]">
            {activeTab === 'About' && (
              <div className="max-w-2xl mx-auto px-4">
                {profile.bio ? (
                  <div className="bg-orange-50 dark:bg-zinc-800 border-l-4 border-orange-400 p-6 rounded-lg shadow-sm text-center">
                    <h3 className="text-lg font-semibold text-orange-500 mb-3">
                      About {profile.name?.split(' ')[0] || 'this user'}
                    </h3>
                    <p className="text-gray-800 dark:text-gray-200 text-base leading-relaxed italic whitespace-pre-line">
                      “{profile.bio}”
                    </p>
                  </div>
                ) : (
                  <p className="text-center text-gray-500 dark:text-gray-400 italic">
                    This user has not shared a bio yet.
                  </p>
                )}
              </div>
            )}

            {activeTab === 'Experiences' && (
              <div className="text-center text-gray-700 dark:text-gray-300 px-4 py-10 space-y-4">
                <h3 className="text-xl font-semibold text-orange-400">No Experiences Yet</h3>
                <p>
                  <span className="font-medium">{profile.name?.split(' ')[0] || 'This user'}</span>{' '}
                  hasn’t shared any career stories yet.
                </p>
              </div>
            )}

            {activeTab === 'Q&A' && (
              <div className="max-w-2xl mx-auto px-4 py-8 bg-white dark:bg-zinc-900 shadow-md rounded-xl border border-orange-200 dark:border-orange-800">
                <h2 className="text-2xl font-bold text-orange-400 mb-4 text-center">Ask a Question</h2>
                {user ? (
                  <div className="mb-6">
                    <QuestionForm
                      profileId={profile._id}
                      profileUserId={profile.userId}
                      onNewQuestion={setNewProfileQuestion}
                    />
                  </div>
                ) : (
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-6 text-center italic">
                    Please{' '}
                    <Link
                      href={`/sign-in?redirect_url=${pathname}?tab=${activeTab}`}
                      className="text-orange-500 font-medium hover:underline transition duration-300"
                    >
                      sign in
                    </Link>{' '}
                    to ask a question.
                  </p>
                )}
                <div className="border-t pt-6 mt-6 border-gray-200 dark:border-gray-700">
                  <h3 className="text-xl font-semibold text-center text-gray-800 dark:text-gray-200 mb-4">
                    Previous Questions
                  </h3>
                  <QuestionList
                    profileId={profile._id}
                    currentUserId={user?.id}
                    profileUserId={profile.clerkId}
                    isAdmin={user?.publicMetadata?.isAdmin}
                    newQuestion={newProfileQuestion}
                  />
                </div>
              </div>
            )}

            {activeTab === 'Social' && (
              <div className="max-w-md mx-auto bg-white dark:bg-zinc-900 shadow-md rounded-xl border border-orange-200 dark:border-orange-800 p-6 mt-6">
                <h2 className="text-xl font-bold text-center text-orange-400 mb-4">
                  Connect with {profile.name?.split(' ')[0] || 'this user'}
                </h2>
                <div className="space-y-4 text-center">
                  {profile.socialLinks?.linkedIn && (
                    <a
                      href={profile.socialLinks.linkedIn}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-center gap-3 text-blue-700 hover:text-blue-800 transition text-lg"
                    >
                      <FaLinkedin className="text-2xl" />
                      <span className="font-medium">LinkedIn</span>
                    </a>
                  )}
                  {profile.socialLinks?.twitter && (
                    <a
                      href={profile.socialLinks.twitter}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-center gap-3 text-blue-400 hover:text-blue-500 transition text-lg"
                    >
                      <FaTwitter className="text-2xl" />
                      <span className="font-medium">Twitter</span>
                    </a>
                  )}
                  {profile.socialLinks?.github && (
                    <a
                      href={profile.socialLinks.github}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-center gap-3 text-gray-800 dark:text-gray-200 hover:text-black dark:hover:text-white transition text-lg"
                    >
                      <FaGithub className="text-2xl" />
                      <span className="font-medium">GitHub</span>
                    </a>
                  )}
                  {!profile.socialLinks?.linkedIn &&
                    !profile.socialLinks?.twitter &&
                    !profile.socialLinks?.github && (
                      <p className="text-gray-500 italic">No social links shared yet.</p>
                    )}
                </div>
              </div>
            )}
          </section>
        </div>
      </article>
    </main>
  );
}
