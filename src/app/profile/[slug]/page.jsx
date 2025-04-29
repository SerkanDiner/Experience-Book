import { notFound } from 'next/navigation';
import { FaLinkedin, FaTwitter, FaGithub } from 'react-icons/fa';
import Image from 'next/image';

// Metadata
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

  return (
    <main className="max-w-4xl mx-auto px-4 pb-20">
      <article className="bg-white dark:bg-gray-900 shadow-xl rounded-2xl overflow-hidden">
        
        {/* Header */}
        <div className="bg-gradient-to-r from-orange-400 to-orange-500 py-10 px-6 text-center text-white">
          <div className="w-24 h-24 mx-auto mb-4 rounded-full border-4 border-white overflow-hidden shadow">
            <img
              src={`https://ui-avatars.com/api/?name=${encodeURIComponent(profile.name)}&background=orange&color=fff&size=512`}
              alt={profile.name}
              className="object-cover w-full h-full"
            />
          </div>
          <h1 className="text-3xl font-bold">{profile.name}</h1>
          <p className="mt-1 text-sm">{profile.jobTitle}</p>
          <span className="mt-2 inline-block bg-white text-orange-500 text-xs font-semibold px-3 py-1 rounded-full capitalize">
            {profile.industry}
          </span>
          <div className="text-xs mt-2 text-orange-100">Joined: {formattedDate}</div>
        </div>

        {/* Body */}
        <div className="px-6 py-8 text-center">
          <p className="text-gray-700 dark:text-gray-300 text-sm whitespace-pre-line mb-6">
            {profile.bio}
          </p>

          {/* Language & Slug Info */}
          <div className="flex flex-col sm:flex-row justify-center items-center gap-4 text-gray-600 text-sm mb-6">
            <div>🌍 Language: <span className="font-medium">{profile.language?.label}</span></div>
            <div>🔗 URL: <span className="text-xs text-gray-500">/profile/{profile.slug}</span></div>
          </div>

          {/* Social Links */}
          <div className="flex justify-center gap-6 mt-4">
            {profile.socialLinks?.linkedIn && (
              <a
                href={profile.socialLinks.linkedIn}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-700 hover:text-blue-800 text-2xl"
              >
                <FaLinkedin />
              </a>
            )}
            {profile.socialLinks?.twitter && (
              <a
                href={profile.socialLinks.twitter}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-400 hover:text-blue-500 text-2xl"
              >
                <FaTwitter />
              </a>
            )}
            {profile.socialLinks?.github && (
              <a
                href={profile.socialLinks.github}
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-800 hover:text-gray-900 text-2xl"
              >
                <FaGithub />
              </a>
            )}
          </div>
        </div>
      </article>
    </main>
  );
}
