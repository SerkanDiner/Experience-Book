'use client';

import { notFound } from 'next/navigation';
import { FaLinkedin, FaTwitter, FaGithub } from 'react-icons/fa';
import { useState } from 'react';
import Image from 'next/image';

export const metadata = {
  title: 'Experience Book - User Profile',
  description: 'Explore real user profiles and their shared experiences.',
};

export const dynamic = 'force-dynamic';

export default async function PublicProfilePage({ params }) {
  const slug = params?.slug;
  if (!slug) notFound();

  let profile = null;

  try {
    const res = await fetch(`${process.env.URL}/api/profile/get`, {
      method: 'POST',
      cache: 'no-store',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ slug }),
    });

    const data = await res.json();
    profile = data?.profile;
  } catch (err) {
    console.error('❌ Failed to fetch profile:', err);
    notFound();
  }

  if (!profile || !profile.isPublic) {
    notFound();
  }

  const formattedDate = profile.createdAt
    ? new Date(profile.createdAt).toLocaleDateString()
    : 'Unknown';

  const [activeTab, setActiveTab] = useState('About');

  return (
    <main className="max-w-5xl mx-auto px-4 pb-20">
      <article className="bg-white dark:bg-gray-900 shadow-lg rounded-3xl overflow-hidden border border-orange-100 dark:border-orange-800">

        {/* Header */}
        <div className="relative bg-gradient-to-br from-orange-400 to-orange-600 py-12 px-8 text-center text-white">
          <div className="absolute top-4 right-4 text-xs text-orange-100">Joined: {formattedDate}</div>
          <div className="w-28 h-28 mx-auto mb-4 rounded-full border-4 border-white overflow-hidden shadow-lg">
            <img
              src={`https://ui-avatars.com/api/?name=${encodeURIComponent(profile.name)}&background=orange&color=fff&size=512`}
              alt={profile.name}
              className="object-cover w-full h-full"
            />
          </div>
          <h1 className="text-4xl font-bold drop-shadow-sm">{profile.name}</h1>
          <p className="mt-1 text-sm italic opacity-90">{profile.jobTitle}</p>
          <span className="mt-2 inline-block bg-white text-orange-500 text-xs font-semibold px-4 py-1 rounded-full capitalize shadow-sm">
            {profile.industry}
          </span>
        </div>

        {/* Tabs */}
        <div className="px-8 pt-6">
          <div className="flex justify-center gap-6 mb-4 text-sm font-semibold border-b border-orange-200 dark:border-orange-700">
            {['About', 'Experiences', 'Q&A', 'Social'].map((tab) => (
              <button
                key={tab}
                className={`pb-2 transition duration-200 ease-in-out hover:text-orange-500 ${
                  activeTab === tab
                    ? 'border-b-2 border-orange-500 text-orange-600'
                    : 'text-gray-500 dark:text-gray-400'
                }`}
                onClick={() => setActiveTab(tab)}
              >
                {tab}
              </button>
            ))}
          </div>

          <div className="mt-6 text-center">
            {activeTab === 'About' && (
              <>
                <p className="text-gray-700 dark:text-gray-300 text-base whitespace-pre-line mb-4 leading-relaxed">
                  {profile.bio}
                </p>
                <div className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
                  <div>🌍 Language: <span className="font-medium">{profile.language?.label}</span></div>
                  <div>🔗 URL: <code className="text-xs text-gray-500">/profile/{profile.slug}</code></div>
                </div>
              </>
            )}

            {activeTab === 'Experiences' && (
              <div className="text-gray-500 dark:text-gray-400 italic">
                {/* Replace this placeholder */}
                No experiences published yet.
              </div>
            )}

            {activeTab === 'Q&A' && (
              <div className="text-gray-500 dark:text-gray-400 italic">
                {/* Replace this placeholder */}
                No questions or answers yet.
              </div>
            )}

            {activeTab === 'Social' && (
              <div className="flex justify-center gap-6 mt-2 text-2xl">
                {profile.socialLinks?.linkedIn && (
                  <a
                    href={profile.socialLinks.linkedIn}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-700 hover:text-blue-800 transition"
                  >
                    <FaLinkedin />
                  </a>
                )}
                {profile.socialLinks?.twitter && (
                  <a
                    href={profile.socialLinks.twitter}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-400 hover:text-blue-500 transition"
                  >
                    <FaTwitter />
                  </a>
                )}
                {profile.socialLinks?.github && (
                  <a
                    href={profile.socialLinks.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gray-800 hover:text-gray-900 transition"
                  >
                    <FaGithub />
                  </a>
                )}
              </div>
            )}
          </div>
        </div>
      </article>
    </main>
  );
}
