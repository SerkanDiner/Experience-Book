'use client';

import { useUser } from '@clerk/nextjs';
import { Alert, Button, FileInput, TextInput } from 'flowbite-react';
import { useRouter } from 'next/navigation';
import dynamic from 'next/dynamic';
import { useEffect, useState } from 'react';
import 'react-quill-new/dist/quill.snow.css';
import { getDownloadURL, getStorage, ref, uploadBytesResumable } from 'firebase/storage';
import { app } from '@/firebase';
import { CircularProgressbar } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import { FaBriefcase, FaMapMarkerAlt } from 'react-icons/fa';

const industries = [
  'technology', 'food', 'hospitality', 'education', 'healthcare',
  'retail', 'construction', 'finance', 'transportation',
  'arts', 'legal', 'sports',
];

const ReactQuill = dynamic(() => import('react-quill-new'), { ssr: false });

export default function DashCreate() {
  const { isSignedIn, user, isLoaded } = useUser();
  const router = useRouter();

  const [file, setFile] = useState(null);
  const [imageUploadProgress, setImageUploadProgress] = useState(null);
  const [imageUploadError, setImageUploadError] = useState(null);
  const [formData, setFormData] = useState({});
  const [publishError, setPublishError] = useState(null);
  const [hasPost, setHasPost] = useState(false);
  const isAdmin = user?.publicMetadata?.isAdmin;

  useEffect(() => {
    const checkPost = async () => {
      try {
        const res = await fetch(`/api/post/check?userId=${user.publicMetadata.userMongoId}`);
        const data = await res.json();
        if (data.count >= 1) {
          setHasPost(true);
        }
      } catch (err) {
        console.error('Error checking post:', err);
      }
    };

    if (isLoaded && isSignedIn && !isAdmin) {
      checkPost();
    }
  }, [isLoaded, isSignedIn, user, isAdmin]);

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
  if (!isSignedIn) {
    return <h1 className="text-center text-3xl my-7 font-semibold">You are not authorised to view this page</h1>;
  }

  // ✅ Block non-admins with existing post
  if (!isAdmin && hasPost) {
    return (
      <div className="text-center py-20">
        <h1 className="text-3xl font-semibold text-orange-500">You’ve already shared your story!</h1>
        <p className="text-gray-600 dark:text-gray-300 mt-2">
          You can edit or delete your existing post, but only one story is allowed per person.
        </p>
      </div>
    );
  }

  // 📝 Your existing full form remains here (unchanged)
  return (
    <div className="p-6 max-w-4xl mx-auto min-h-screen bg-white dark:bg-gray-900 rounded-xl shadow-md">
      {/* Keep your form content here */}
    </div>
  );
}
