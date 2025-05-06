'use client';

import { useState } from 'react';
import { FaLinkedin, FaTwitter, FaGithub } from 'react-icons/fa';
import QuestionForm from '@/app/components/QuestionForm';
import QuestionList from '@/app/components/Questionlist';
import { useUser } from '@clerk/nextjs';

export default function ClientProfilePage({ profile }) {
  const [activeTab, setActiveTab] = useState('About');
  const [newProfileQuestion, setNewProfileQuestion] = useState(null);
  const { user } = useUser();

  const formattedDate = profile.createdAt
    ? new Date(profile.createdAt).toLocaleDateString()
    : 'Unknown';

  return (
    <main className="max-w-5xl mx-auto px-4 pb-20">
      {/* 🟧 Gradient Header */}
      <div className="relative bg-gradient-to-br from-orange-400 to-yellow-300 dark:from-orange-500 dark:to-yellow-500 py-14 px-8 text-center text-white rounded-t-3xl">
        <div className="absolute top-4 right-6 text-xs text-orange-100 font-mono">
          🗓️ Joined: {formattedDate}
        </div>
        <div className="w-32 h-32 mx-auto mb-4 rounded-full border-4 border-white overflow-hidden shadow-xl">
          <img
            src={`https://ui-avatars.com/api/?name=${encodeURIComponent(profile.name)}&background=orange&color=fff&size=512`}
            alt={profile.name}
            className="object-cover w-full h-full"
          />
        </div>
        <h1 className="text-4xl font-extrabold drop-shadow">{profile.name}</h1>
        <p className="mt-1 italic text-sm opacity-90">{profile.jobTitle}</p>
        <span className="mt-3 inline-block bg-white text-orange-500 text-xs font-semibold px-4 py-1 rounded-full uppercase shadow">
          {profile.industry}
        </span>
      </div>

      {/* 🧾 Main Card */}
      <article className="bg-white dark:bg-gray-900 shadow-2xl rounded-b-3xl overflow-hidden border border-orange-200 dark:border-orange-800 transition-all duration-300">
        <div className="px-6 sm:px-10 pt-8 pb-12">
          {/* 🗂 Tabs */}
          <div className="flex justify-center gap-6 sm:gap-10 mb-8 text-sm sm:text-base font-semibold border-b border-orange-200 dark:border-orange-700">
            {['About', 'Experiences', 'Q&A', 'Social'].map((tab) => (
              <button
                key={tab}
                className={`pb-2 transition-all duration-200 hover:text-orange-400 ${
                  activeTab === tab
                    ? 'border-b-2 border-orange-400 text-orange-500'
                    : 'text-gray-500 dark:text-gray-400'
                }`}
                onClick={() => setActiveTab(tab)}
              >
                {tab}
              </button>
            ))}
          </div>

          {/* 🧠 Tab Content */}
          <div className="min-h-[350px] transition-all duration-300 ease-in-out">
            {activeTab === 'About' && (
              <p className="text-gray-800 dark:text-gray-300 text-base sm:text-lg whitespace-pre-line leading-relaxed text-center">
                {profile.bio || 'This user has not shared a bio yet.'}
              </p>
            )}

            {activeTab === 'Experiences' && (
              <div className="text-center text-gray-700 dark:text-gray-300 px-4 py-10 space-y-4">
                <h3 className="text-xl font-semibold text-orange-400">No Experiences Yet</h3>
                <p>
                  <span className="font-medium">{profile.name?.split(' ')[0] || 'This user'}</span> hasn’t shared any career stories yet.
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400 max-w-xl mx-auto">
                  They work as a <span className="text-orange-400">{profile.jobTitle}</span> in{' '}
                  <span className="capitalize">{profile.industry}</span>. Stay tuned for updates!
                </p>
                {profile.bio && (
                  <blockquote className="italic text-sm text-gray-400 max-w-xl mx-auto border-l-4 border-orange-300 pl-4 mt-4">
                    “{profile.bio}”
                  </blockquote>
                )}
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
                    Please <span className="text-orange-500 font-medium">sign in</span> to ask a question.
                  </p>
                )}
                <div className="border-t pt-6 mt-6 border-gray-200 dark:border-gray-700">
                  <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-4 text-center">
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
          </div>
        </div>
      </article>
    </main>
  );
}
