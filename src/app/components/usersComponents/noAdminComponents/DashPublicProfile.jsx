'use client';

import { useUser } from '@clerk/nextjs';
import { useEffect, useState } from 'react';
import { TextInput, Button, Alert } from 'flowbite-react';
import { FaBriefcase, FaGlobe, FaLink, FaPen } from 'react-icons/fa';

const industries = [
  'technology', 'food', 'hospitality', 'education', 'healthcare',
  'retail', 'construction', 'finance', 'transportation',
  'arts', 'legal', 'sports',
];

const languages = [
  { code: 'en', label: 'English' },
  { code: 'tr', label: 'Turkish' },
  { code: 'es', label: 'Spanish' },
  { code: 'fr', label: 'French' },
  { code: 'de', label: 'German' },
];

export default function DashPublicProfile() {
  const { user } = useUser();
  const [formData, setFormData] = useState({
    name: '',
    industry: '',
    language: 'en',
    jobTitle: '',
    bio: '',
    isPublic: false,
    socialLinks: {
      linkedIn: '',
      twitter: '',
      github: ''
    }
  });
  const [profile, setProfile] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setIsLoading(true);
        const res = await fetch('/api/profile/create');
        if (res.ok) {
          const data = await res.json();
          setProfile(data);
          setFormData({
            name: data.name || '',
            industry: data.industry || '',
            language: data.language?.code || 'en',
            jobTitle: data.jobTitle || '',
            bio: data.bio || '',
            isPublic: data.isPublic || false,
            socialLinks: {
              linkedIn: data.socialLinks?.linkedIn || '',
              twitter: data.socialLinks?.twitter || '',
              github: data.socialLinks?.github || ''
            }
          });
        }
      } catch (err) {
        console.error('Error fetching profile:', err);
      } finally {
        setIsLoading(false);
      }
    };

    if (user) fetchProfile();
  }, [user]);

  useEffect(() => {
    if (successMessage) {
      const timeout = setTimeout(() => setSuccessMessage(''), 5000);
      return () => clearTimeout(timeout);
    }
  }, [successMessage]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (name.startsWith('socialLinks.')) {
      const field = name.split('.')[1];
      setFormData((prev) => ({
        ...prev,
        socialLinks: {
          ...prev.socialLinks,
          [field]: value
        }
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: type === 'checkbox' ? checked : value,
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const method = profile ? 'PATCH' : 'POST';
      const res = await fetch('/api/profile/create', {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Failed to save profile');

      setProfile(data.profile || data); // set updated or created profile
      setIsModalOpen(false);
      setError('');
      setSuccessMessage(profile ? 'Profile updated successfully!' : 'Profile created successfully!');
    } catch (err) {
      console.error('Profile save error:', err);
      setError(err.message || 'Error saving profile');
    }
  };

  const handleDelete = async () => {
    if (confirm('Are you sure you want to delete your public profile?')) {
      try {
        const res = await fetch('/api/profile/create', { method: 'DELETE' });
        if (!res.ok) throw new Error('Failed to delete profile');

        setProfile(null);
        setFormData({
          name: '',
          industry: '',
          language: 'en',
          jobTitle: '',
          bio: '',
          isPublic: false,
          socialLinks: {
            linkedIn: '',
            twitter: '',
            github: ''
          }
        });
        setSuccessMessage('Profile deleted successfully!');
      } catch (err) {
        console.error('Delete profile error:', err);
        setError('Error deleting profile');
      }
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-orange-400 border-b-4"></div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-4xl mx-auto min-h-screen bg-white dark:bg-gray-900 rounded-xl shadow-md">
      <h1 className="text-center text-3xl my-7 font-bold text-orange-400">Public Profile</h1>

      {successMessage && (
        <Alert color="success" className="mb-6 text-center">
          {successMessage}
        </Alert>
      )}

      {profile ? (
        <div className="space-y-6">
          {/* Profile Card */}
          <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-6 shadow-sm">
            <div className="flex justify-between items-center mb-4">
              <div>
                <h2 className="text-2xl font-bold text-gray-800 dark:text-white">{profile.name}</h2>
                <p className="text-gray-500 dark:text-gray-400">{profile.jobTitle}</p>
              </div>
              <span className={`px-2 py-1 text-xs font-semibold rounded-full ${profile.isPublic ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'}`}>
                {profile.isPublic ? 'Public' : 'Private'}
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-gray-700 dark:text-gray-300">
              <div className="flex items-center gap-2">
                <FaBriefcase className="text-orange-400" />
                <span className="capitalize">{profile.industry}</span>
              </div>
              <div className="flex items-center gap-2">
                <FaGlobe className="text-orange-400" />
                <span>{languages.find((l) => l.code === profile.language)?.label || 'Unknown'}</span>
              </div>
            </div>

            <div className="mt-4">
              <h3 className="text-sm font-medium text-gray-500 mb-1">About</h3>
              <p className="text-gray-800 dark:text-white whitespace-pre-line">{profile.bio}</p>
            </div>

            {profile.socialLinks && (
              <div className="mt-4 space-y-2">
                {profile.socialLinks.linkedIn && (
                  <a href={profile.socialLinks.linkedIn} target="_blank" className="text-blue-600 hover:underline flex items-center gap-2">
                    <FaLink /> LinkedIn
                  </a>
                )}
                {profile.socialLinks.twitter && (
                  <a href={profile.socialLinks.twitter} target="_blank" className="text-blue-400 hover:underline flex items-center gap-2">
                    <FaLink /> Twitter
                  </a>
                )}
                {profile.socialLinks.github && (
                  <a href={profile.socialLinks.github} target="_blank" className="text-gray-800 hover:underline flex items-center gap-2">
                    <FaLink /> GitHub
                  </a>
                )}
              </div>
            )}

            <div className="flex justify-end gap-4 mt-6">
              <Button color="failure" onClick={handleDelete}>Delete</Button>
              <Button color="info" onClick={() => setIsModalOpen(true)}>Edit</Button>
            </div>
          </div>
        </div>
      ) : (
        <div className="text-center py-12">
          <div className="text-gray-400 mb-6">
            <FaPen className="h-16 w-16 mx-auto" />
          </div>
          <h2 className="text-2xl font-semibold text-gray-800 dark:text-white mb-2">No Public Profile Yet</h2>
          <p className="text-gray-500 dark:text-gray-400 mb-6">Create a public profile to showcase yourself!</p>
          <Button onClick={() => setIsModalOpen(true)} color="success">
            Create Profile
          </Button>
        </div>
      )}

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg w-full max-w-lg overflow-y-auto max-h-[90vh] p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-800 dark:text-white">
                {profile ? 'Edit Profile' : 'Create Public Profile'}
              </h2>
              <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
                ✕
              </button>
            </div>

            {error && <Alert color="failure" className="mb-4">{error}</Alert>}

            <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
              <TextInput name="name" placeholder="Your Name" required value={formData.name} onChange={handleChange} />
              <TextInput name="jobTitle" placeholder="Your Job Title" required value={formData.jobTitle} onChange={handleChange} />
              <select name="industry" required value={formData.industry} onChange={handleChange} className="p-2 border rounded-md bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300">
                <option value="">Select Industry</option>
                {industries.map((ind) => <option key={ind} value={ind}>{ind.charAt(0).toUpperCase() + ind.slice(1)}</option>)}
              </select>
              <select name="language" required value={formData.language} onChange={handleChange} className="p-2 border rounded-md bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300">
                {languages.map((lang) => <option key={lang.code} value={lang.code}>{lang.label}</option>)}
              </select>
              <textarea name="bio" placeholder="Write a short bio" required rows="4" value={formData.bio} onChange={handleChange} className="p-2 border rounded-md bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300" />
              <TextInput name="socialLinks.linkedIn" placeholder="LinkedIn URL" value={formData.socialLinks.linkedIn} onChange={handleChange} />
              <TextInput name="socialLinks.twitter" placeholder="Twitter URL" value={formData.socialLinks.twitter} onChange={handleChange} />
              <TextInput name="socialLinks.github" placeholder="GitHub URL" value={formData.socialLinks.github} onChange={handleChange} />
              <div className="flex items-center gap-2">
                <input type="checkbox" name="isPublic" checked={formData.isPublic} onChange={handleChange} className="w-4 h-4" />
                <label className="text-gray-700 dark:text-gray-300">Make Profile Public</label>
              </div>
              <div className="flex justify-end gap-4 mt-4">
                <Button type="button" color="gray" onClick={() => setIsModalOpen(false)}>Cancel</Button>
                <Button type="submit" color="success">{profile ? 'Update' : 'Create'}</Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
