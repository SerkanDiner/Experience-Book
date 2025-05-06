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
    <main className="max-w-6xl mx-auto px-4 sm:px-8 pb-20">
      <article className="bg-white dark:bg-gray-900 shadow-2xl rounded-3xl overflow-hidden border border-orange-200 dark:border-orange-800 transition-all duration-300">

        {/* Header */}
        <div className="relative bg-gradient-to-br from-orange-500 to-yellow-400 dark:from-orange-700 dark:to-yellow-600 py-14 px-8 text-center text-white">
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
          <h1 className="text-4xl font-extrabold tracking-tight drop-shadow-md">{profile.name}</h1>
          <p className="mt-1 text-md italic opacity-90">{profile.jobTitle}</p>
          <span className="mt-3 inline-block bg-white text-orange-600 text-xs font-semibold px-4 py-1 rounded-full uppercase shadow">
            {profile.industry}
          </span>
        </div>

        {/* Tabs */}
        <div className="px-6 sm:px-10 pt-6">
          <div className="flex justify-center gap-4 sm:gap-8 mb-6 text-sm sm:text-base font-semibold border-b border-orange-200 dark:border-orange-700">
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

          {/* Tab Content */}
          <div className="mt-6 text-center px-2 sm:px-8">
            {activeTab === 'About' && (
              <>
                <p className="text-gray-800 dark:text-gray-300 text-base sm:text-lg whitespace-pre-line mb-6 leading-relaxed">
                  {profile.bio}
                </p>
                <div className="text-sm text-gray-600 dark:text-gray-400 space-y-2">
                  <div>🌍 <strong>Language:</strong> {profile.language?.label}</div>
                  <div>🔗 <strong>URL:</strong> <code className="text-xs text-gray-500">/profile/{profile.slug}</code></div>
                </div>
              </>
            )}

            {activeTab === 'Experiences' && (
              <div className="text-gray-500 dark:text-gray-400 italic">
                No experiences published yet.
              </div>
            )}

            {activeTab === 'Q&A' && (
              <div className="text-left max-w-2xl mx-auto">
                {user ? (
                  <QuestionForm
                  profileId={profile._id}
                  profileUserId={profile.userId} // ✅ This is needed for self-check
                  onNewQuestion={setNewProfileQuestion}
                />
                
                ) : (
                  <p className="text-sm text-gray-500 dark:text-gray-400 mb-4 text-center">
                    Please sign in to ask a question.
                  </p>
                )}

            <QuestionList
              profileId={profile._id}
              currentUserId={user?.id}
              profileUserId={profile.userId} // 👈 this is critical
              isAdmin={user?.publicMetadata?.isAdmin}
              newQuestion={newProfileQuestion}
            />


              </div>
            )}

            {activeTab === 'Social' && (
              <div className="flex justify-center gap-8 mt-4 text-3xl">
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
