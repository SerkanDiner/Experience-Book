'use client';

import { useEffect, useState } from 'react';
import { useUser } from '@clerk/nextjs';
import { Button, TextInput, Textarea, Select } from 'flowbite-react';
import { FaGlobe, FaUserAlt, FaBriefcase, FaMapMarkerAlt, FaLink } from 'react-icons/fa';

const industries = [
  'technology', 'food', 'hospitality', 'education', 'healthcare',
  'retail', 'construction', 'finance', 'transportation', 'art',
  'legal', 'sport'
];

export default function CompleteProfileForm() {
  const { user } = useUser();
  const [formData, setFormData] = useState({
    username: '',
    firstName: '',
    lastName: '',
    country: '',
    jobTitle: '',
    industry: '',
    languages: '',
    bio: '',
    website: '',
  });

  useEffect(() => {
    const fetchProfile = async () => {
      if (!user?.id) return;

      try {
        const res = await fetch(`/api/user/profile?clerkId=${user.id}`);
        if (!res.ok) return;

        const data = await res.json();

        setFormData({
          username: data.username || '',
          firstName: data.firstName || '',
          lastName: data.lastName || '',
          country: data.profile?.country || '',
          jobTitle: data.profile?.jobTitle || '',
          industry: data.profile?.industry || '',
          languages: data.profile?.languages?.join(', ') || '',
          bio: data.profile?.bio || '',
          website: data.profile?.website || '',
        });
      } catch (err) {
        console.error('❌ Failed to load profile:', err.message);
      }
    };

    fetchProfile();
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const res = await fetch('/api/user/profile', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        clerkId: user.id,
        ...formData,
        languages: formData.languages.split(',').map((l) => l.trim()),
      }),
    });

    if (res.ok) {
      alert('✅ Profile updated successfully!');
    } else {
      alert('❌ Error updating profile.');
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-2xl mx-auto bg-white dark:bg-zinc-900 p-8 rounded-2xl shadow-lg space-y-6"
    >
      <div className="text-center">
        <h2 className="text-2xl font-bold text-orange-500">✨ Complete Your Profile</h2>
        <p className="text-gray-500 dark:text-gray-400 mt-1 text-sm">
          Add your details to shine on your profile page.
        </p>
      </div>

      {/* Basic Info */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <TextInput
          name="username"
          placeholder="Username"
          icon={FaUserAlt}
          value={formData.username}
          onChange={handleChange}
          required
        />
        <TextInput
          name="jobTitle"
          placeholder="Job Title"
          icon={FaBriefcase}
          value={formData.jobTitle}
          onChange={handleChange}
          required
        />
        <TextInput
          name="firstName"
          placeholder="First Name"
          value={formData.firstName}
          onChange={handleChange}
        />
        <TextInput
          name="lastName"
          placeholder="Last Name"
          value={formData.lastName}
          onChange={handleChange}
        />
        <TextInput
          name="country"
          placeholder="Country"
          icon={FaMapMarkerAlt}
          value={formData.country}
          onChange={handleChange}
          required
        />
        <Select
          name="industry"
          value={formData.industry}
          onChange={handleChange}
          required
        >
          <option value="">Select Industry</option>
          {industries.map((ind) => (
            <option key={ind} value={ind}>
              {ind.charAt(0).toUpperCase() + ind.slice(1)}
            </option>
          ))}
        </Select>
      </div>

      {/* Language and Bio */}
      <div className="space-y-4">
        <TextInput
          name="languages"
          placeholder="Languages (comma separated)"
          icon={FaGlobe}
          value={formData.languages}
          onChange={handleChange}
        />
        <Textarea
          name="bio"
          placeholder="Short bio (max 300 chars)"
          maxLength={300}
          rows={3}
          value={formData.bio}
          onChange={handleChange}
        />
        <TextInput
          name="website"
          placeholder="Website (optional)"
          icon={FaLink}
          value={formData.website}
          onChange={handleChange}
        />
      </div>

      <div className="text-center">
        <Button type="submit" gradientDuoTone="purpleToPink" size="lg">
          Save Profile
        </Button>
      </div>
    </form>
  );
}
