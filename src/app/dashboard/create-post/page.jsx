"use client";
import { useUser } from '@clerk/nextjs';
import { Alert, Button, FileInput, TextInput } from 'flowbite-react';
import { useRouter } from 'next/navigation';
import dynamic from 'next/dynamic';
import { useState } from 'react';
import 'react-quill-new/dist/quill.snow.css';

import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from 'firebase/storage';
import { app } from '@/firebase';

import { CircularProgressbar } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';

const ReactQuill = dynamic(() => import('react-quill-new'), { ssr: false });

export default function CreatePostPage() {
  const { isSignedIn, user, isLoaded } = useUser();
  const [file, setFile] = useState(null);
  const [imageUploadProgress, setImageUploadProgress] = useState(null);
  const [imageUploadError, setImageUploadError] = useState(null);
  const [formData, setFormData] = useState({});
  const [publishError, setPublishError] = useState(null);
  const router = useRouter();
  console.log(formData);

  const handleUpdloadImage = async () => {
    try {
      if (!file) {
        setImageUploadError('Please select an image');
        return;
      }
      setImageUploadError(null);
      const storage = getStorage(app);
      const fileName = new Date().getTime() + '-' + file.name;
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
    } catch (error) {
      setImageUploadError('Image upload failed');
      setImageUploadProgress(null);
      console.log(error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/post/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          userMongoId: user.publicMetadata.userMongoId,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setPublishError(data);
        return;
      }
      setPublishError(null);
      router.push(`/post/${data.slug}`);
    } catch {
      setPublishError('Something went wrong');
    }
  };

  if (!isLoaded) return null;

  if (isSignedIn && user.publicMetadata.isAdmin) {
    return (
      <div className='p-3 max-w-3xl mx-auto min-h-screen'>
        <h1 className='text-center text-3xl my-7 font-semibold'>
          Create a post
        </h1>

        <form className='flex flex-col gap-4' onSubmit={handleSubmit}>
          <div className='flex flex-col sm:flex-row gap-4 justify-between'>
            {/* Title */}
            <div className='w-full sm:w-1/2'>
              <TextInput
                type='text'
                placeholder='Title'
                required
                id='title'
                className='w-full'
                onChange={(e) =>
                  setFormData({ ...formData, title: e.target.value })
                }
              />
            </div>

            {/* Categories */}
            <div className='w-full sm:w-1/2 flex flex-col gap-2'>
              <TextInput
                type='text'
                placeholder='Type a category and press Enter (max 5)'
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    const value = e.target.value.trim();
                    if (
                      value &&
                      (!formData.categories || formData.categories.length < 5) &&
                      !formData.categories?.includes(value)
                    ) {
                      const newCategories = formData.categories
                        ? [...formData.categories, value]
                        : [value];
                      setFormData({ ...formData, categories: newCategories });
                      e.target.value = '';
                    }
                  }
                }}
              />
              <div className='flex flex-wrap gap-2'>
                {formData.categories?.map((cat, index) => (
                  <div
                    key={index}
                    className='bg-teal-200 px-3 py-1 rounded-full text-sm flex items-center gap-1'
                  >
                    {cat}
                    <button
                      type='button'
                      className='text-red-600 font-bold'
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
                <p className='text-xs text-red-500 mt-1'>
                  You can only add up to 5 categories.
                </p>
              )}
            </div>
          </div>

          {/* Image Upload */}
          <div className='flex gap-4 items-center justify-between border-4 border-teal-500 border-dotted p-3'>
            <FileInput
              type='file'
              accept='image/*'
              onChange={(e) => setFile(e.target.files[0])}
            />
            <Button
              type='button'
              gradientDuoTone='purpleToBlue'
              size='sm'
              outline
              onClick={handleUpdloadImage}
              disabled={imageUploadProgress}
            >
              {imageUploadProgress ? (
                <div className='w-16 h-16'>
                  <CircularProgressbar
                    value={imageUploadProgress}
                    text={`${imageUploadProgress || 0}%`}
                  />
                </div>
              ) : (
                'Upload Image'
              )}
            </Button>
          </div>

          {/* Error or Image Preview */}
          {imageUploadError && <Alert color='failure'>{imageUploadError}</Alert>}
          {formData.image && (
            <img
              src={formData.image}
              alt='upload'
              className='w-full h-72 object-cover'
            />
          )}

          {/* Content */}
          <ReactQuill
            theme='snow'
            placeholder='Write Something...'
            className='h-72 mb-12'
            required
            onChange={(value) =>
              setFormData({ ...formData, content: value })
            }
          />

          {/* Submit */}
          <Button type='submit' gradientDuoTone='purpleToPink'>
            Publish
          </Button>

          {/* Submission Error */}
          {publishError && (
            <Alert className='mt-4' color='failure'>
              {publishError}
            </Alert>
          )}
        </form>
      </div>
    );
  } else {
    return (
      <h1 className='text-center text-3xl my-7 font-semibold'>
        You are not authorised to view this page
      </h1>
    );
  }
}
