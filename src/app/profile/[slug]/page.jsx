import { getProfileBySlug } from '@/lib/actions/getProfileBySlug';
import { notFound } from 'next/navigation';

export async function generateMetadata({ params }) {
  const profile = await getProfileBySlug(params.slug);

  if (!profile) {
    return { title: 'Profile Not Found' };
  }

  return {
    title: `${profile.name} | ExperienceBook`,
    description: profile.bio,
  };
}

export default async function PublicProfilePage({ params }) {
  const profile = await getProfileBySlug(params.slug);

  if (!profile) {
    notFound();
  }

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-md mt-10">
      <div className="flex flex-col items-center">
        <h1 className="text-3xl font-bold text-gray-800">{profile.name}</h1>
        <p className="text-gray-500">{profile.jobTitle}</p>
        <p className="text-sm text-gray-400 mt-1 capitalize">{profile.industry}</p>
        <div className="mt-4 text-center text-gray-700">
          <p>{profile.bio}</p>
        </div>

        {/* Optional: Social Links */}
        <div className="flex gap-4 mt-6">
          {profile.socialLinks?.linkedIn && (
            <a href={profile.socialLinks.linkedIn} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
              LinkedIn
            </a>
          )}
          {profile.socialLinks?.twitter && (
            <a href={profile.socialLinks.twitter} target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline">
              Twitter
            </a>
          )}
          {profile.socialLinks?.github && (
            <a href={profile.socialLinks.github} target="_blank" rel="noopener noreferrer" className="text-gray-800 hover:underline">
              GitHub
            </a>
          )}
        </div>
      </div>
    </div>
  );
}
