'use client';

import { useUser } from '@clerk/nextjs';
import { Alert, Button, FileInput, TextInput } from 'flowbite-react';
import { useRouter } from 'next/navigation';
import dynamic from 'next/dynamic';
import { useState } from 'react';
import 'react-quill-new/dist/quill.snow.css';
import { getDownloadURL, getStorage, ref, uploadBytesResumable } from 'firebase/storage';
import { app } from '@/firebase';
import { CircularProgressbar } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';

const industries = [
  'technology', 'food', 'hospitality', 'education', 'healthcare',
  'retail', 'construction', 'finance', 'transportation',
  'arts', 'legal', 'sports',
];

const ReactQuill = dynamic(() => import('react-quill-new'), { ssr: false });

export default function DashCreate() {
  const { isSignedIn, user, isLoaded } = useUser();
  const [file, setFile] = useState(null);
  const [imageUploadProgress, setImageUploadProgress] = useState(null);
  const [imageUploadError, setImageUploadError] = useState(null);
  const [formData, setFormData] = useState({});
  const [publishError, setPublishError] = useState(null);
  const router = useRouter();

  const handleUploadImage = async () => {
    if (!file) return setImageUploadError('Please select an image');
    try {
      setImageUploadError(null);
      const storage = getStorage(app);
      const fileName = `${Date.now()}-${file.name}`;
      const storageRef = ref(storage, fileName);
      const uploadTask = uploadBytesResumable(storageRef, file);

      uploadTask.on(
        'state_changed',
        (snapshot) => {
          const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          setImageUploadProgress(progress.toFixed(0));
        },
        () => {
          setImageUploadError('Image upload failed');
          setImageUploadProgress(null);
        },
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
            setImageUploadProgress(null);
            setImageUploadError(null);
            setFormData({ ...formData, image: downloadURL });
          });
        }
      );
    } catch {
      setImageUploadError('Image upload failed');
      setImageUploadProgress(null);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const requiredFields = ['author', 'jobTitle', 'location', 'summary', 'title', 'industry', 'content', 'image'];
    for (const field of requiredFields) {
      if (!formData[field]) {
        return setPublishError(`Please fill out the ${field} field.`);
      }
    }

    const cleanedData = {
      ...formData,
      author: formData.author.trim(),
      jobTitle: formData.jobTitle.trim(),
      location: formData.location.trim(),
    };

    try {
      const res = await fetch('/api/post/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...cleanedData,
          userMongoId: user.publicMetadata.userMongoId,
        }),
      });

      const data = await res.json();
      if (!res.ok) return setPublishError(data.message);

      setPublishError(null);
      router.push(`/post/${data.slug}`);
    } catch {
      setPublishError('Something went wrong');
    }
  };

  if (!isLoaded) return null;
  if (!isSignedIn || !user.publicMetadata?.isAdmin) {
    return <h1 className="text-center text-3xl my-7 font-semibold">You are not authorised to view this page</h1>;
  }

  return (
    <div className="p-6 max-w-4xl mx-auto min-h-screen bg-white dark:bg-gray-900 rounded-xl shadow-md">
      <h1 className="text-center text-3xl my-7 font-bold text-orange-400">Create a Post</h1>

      <form className="flex flex-col gap-6" onSubmit={handleSubmit}>
        {/* Author Info */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <TextInput
            type="text"
            placeholder="Written by (e.g. John Doe)"
            required
            value={formData.author || ''}
            onChange={(e) => setFormData({ ...formData, author: e.target.value })}
          />
          <TextInput
            type="text"
            placeholder="Job Title (e.g. UX Designer)"
            required
            value={formData.jobTitle || ''}
            onChange={(e) => setFormData({ ...formData, jobTitle: e.target.value })}
          />
          <TextInput
            type="text"
            placeholder="Location (e.g. London, UK)"
            required
            value={formData.location || ''}
            onChange={(e) => setFormData({ ...formData, location: e.target.value })}
          />
          <TextInput
            type="text"
            placeholder="Post Title"
            required
            value={formData.title || ''}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          />
        </div>

        {/* Summary */}
        <TextInput
          type="text"
          placeholder="Short summary (max 300 characters)"
          maxLength={300}
          required
          value={formData.summary || ''}
          onChange={(e) => setFormData({ ...formData, summary: e.target.value })}
        />

        {/* Industry Dropdown */}
        <div>
          <label className="block text-sm mb-1 font-medium text-orange-500">Select Industry *</label>
          <select
            required
            value={formData.industry || ''}
            onChange={(e) => setFormData({ ...formData, industry: e.target.value })}
            className="w-full p-2 border border-orange-300 rounded bg-white dark:bg-gray-800 dark:text-white"
          >
            <option value="" disabled>Choose an industry</option>
            {industries.map((ind) => (
              <option key={ind} value={ind}>{ind.charAt(0).toUpperCase() + ind.slice(1)}</option>
            ))}
          </select>
        </div>

        {/* Tags / Categories */}
        <div className="flex flex-col gap-2">
          <TextInput
            type="text"
            placeholder="Type a tag (e.g. frontend) and press Enter (max 5)"
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                const value = e.target.value.trim();
                if (
                  value &&
                  (!formData.categories || formData.categories.length < 5) &&
                  !formData.categories?.includes(value)
                ) {
                  const newCategories = formData.categories ? [...formData.categories, value] : [value];
                  setFormData({ ...formData, categories: newCategories });
                  e.target.value = '';
                }
              }
            }}
          />
          <div className="flex flex-wrap gap-2">
            {formData.categories?.map((cat, index) => (
              <div
                key={index}
                className="bg-orange-100 text-orange-600 px-3 py-1 rounded-full text-sm flex items-center gap-1"
              >
                {cat}
                <button
                  type="button"
                  className="text-orange-600 font-bold"
                  onClick={() => {
                    const updated = formData.categories.filter((c) => c !== cat);
                    setFormData({ ...formData, categories: updated });
                  }}
                >
                  ×
                </button>
              </div>
            ))}
          </div>
          {formData.categories?.length >= 5 && (
            <p className="text-xs text-red-500 mt-1">
              You can only add up to 5 tags.
            </p>
          )}
        </div>

        {/* Image Upload */}
        <div className="border-4 border-dotted border-orange-300 p-4 flex flex-col md:flex-row justify-between items-center gap-4">
          <FileInput
            accept="image/*"
            onChange={(e) => setFile(e.target.files[0])}
            required
          />
          <Button
            type="button"
            gradientDuoTone="purpleToBlue"
            size="sm"
            onClick={handleUploadImage}
            disabled={imageUploadProgress}
          >
            {imageUploadProgress ? (
              <div className="w-16 h-16">
                <CircularProgressbar value={imageUploadProgress} text={`${imageUploadProgress}%`} />
              </div>
            ) : 'Upload Image'}
          </Button>
        </div>
        {imageUploadError && <Alert color="failure">{imageUploadError}</Alert>}
        {formData.image && (
          <img src={formData.image} alt="uploaded" className="w-full h-72 object-cover rounded" />
        )}

        {/* Rich Text Content */}
        <ReactQuill
          theme="snow"
          placeholder="Write your experience..."
          className="h-72 mb-12 bg-white dark:bg-gray-800 rounded"
          required
          value={formData.content || ''}
          onChange={(value) => setFormData({ ...formData, content: value })}
        />

        <Button type="submit" className="bg-orange-400 hover:bg-orange-500 text-white py-2 text-lg rounded-md">
          Publish
        </Button>

        {publishError && <Alert color="failure" className="mt-4">{publishError}</Alert>}
      </form>
    </div>
  );
}
