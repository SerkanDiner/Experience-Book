import { getProfileBySlug } from '@/lib/actions/getProfileBySlug';
import { notFound } from 'next/navigation';
import { FaLinkedin, FaTwitter, FaGithub } from 'react-icons/fa';

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

  if (!profile || !profile.isPublic) {
    notFound();
  }

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100 px-4">
      <div className="max-w-2xl w-full bg-white rounded-xl shadow-md p-8 text-center">
        {/* Profile Picture */}
        <div className="flex justify-center mb-4">
          <div className="w-28 h-28 rounded-full border-4 border-orange-400 overflow-hidden">
            {/* No user-uploaded image yet, so showing default avatar */}
            <img
              src="https://ui-avatars.com/api/?name=Serkan+Diner&background=orange&color=fff&size=512"
              alt={profile.name}
              className="w-full h-full object-cover"
            />
          </div>
        </div>

        {/* Name */}
        <h1 className="text-3xl font-bold text-gray-800">{profile.name}</h1>

        {/* Job Title */}
        <p className="text-orange-500 text-sm font-medium mt-1">{profile.jobTitle}</p>

        {/* Industry Badge */}
        <span className="inline-block mt-2 bg-orange-100 text-orange-600 text-xs font-semibold px-3 py-1 rounded-full">
          {profile.industry}
        </span>

        {/* Bio */}
        <div className="mt-6 text-gray-600 text-sm whitespace-pre-line">
          {profile.bio}
        </div>

        {/* Social Links */}
        <div className="flex justify-center gap-6 mt-8">
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
    </div>
  );
}
