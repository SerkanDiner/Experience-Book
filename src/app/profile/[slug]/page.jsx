'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { FaLinkedin, FaTwitter, FaGithub, FaBriefcase, FaLanguage, FaGlobe } from 'react-icons/fa';

export default function PublicProfilePage() {
  const { slug } = useParams();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!slug) return;

    const fetchProfile = async () => {
      try {
        const res = await fetch(`/api/profile/get/${slug}`);
        if (!res.ok) {
          setProfile(null);
        } else {
          const data = await res.json();
          setProfile(data);
        }
      } catch (err) {
        console.error('Failed to load profile:', err);
        setProfile(null);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [slug]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-100">
        <div className="text-gray-500">Loading profile...</div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-100">
        <div className="text-center text-gray-600">
          <h2 className="text-2xl font-bold mb-2">Profile Not Found</h2>
          <p>This profile may be private or does not exist.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-100 min-h-screen py-10 px-4">
      <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-lg overflow-hidden">
        {/* Header Section */}
        <div className="bg-gradient-to-r from-orange-400 to-orange-500 p-8 flex flex-col items-center text-white">
          <div className="w-28 h-28 rounded-full bg-white overflow-hidden mb-4 border-4 border-white">
            <img
              src={`https://ui-avatars.com/api/?name=${encodeURIComponent(profile.name)}&background=orange&color=fff&size=512`}
              alt={profile.name}
              className="w-full h-full object-cover"
            />
          </div>
          <h1 className="text-3xl font-bold">{profile.name}</h1>
          <p className="flex items-center gap-2 mt-1 text-sm">
            <FaBriefcase />
            {profile.jobTitle}
          </p>
          <span className="mt-2 inline-block bg-white text-orange-600 text-xs font-semibold px-3 py-1 rounded-full capitalize">
            {profile.industry}
          </span>
        </div>

        {/* Body Section */}
        <div className="p-6 space-y-4">
          {/* Bio */}
          <div className="text-gray-700 text-sm whitespace-pre-line text-center">
            {profile.bio}
          </div>

          {/* Language & Slug */}
          <div className="flex flex-col md:flex-row justify-center items-center gap-6 mt-4 text-gray-600 text-sm">
            <div className="flex items-center gap-2">
              <FaLanguage className="text-orange-500" />
              {profile.language?.label}
            </div>
            <div className="flex items-center gap-2">
              <FaGlobe className="text-orange-500" />
              <span className="text-xs">/profile/{profile.slug}</span>
            </div>
          </div>

          {/* Social Links */}
          <div className="flex justify-center gap-6 mt-6">
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
    </div>
  );
}
