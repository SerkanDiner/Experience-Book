'use client';

import { useUser } from '@clerk/nextjs';
import Link from 'next/link';

export default function SharePagePlaceholder() {
  const { isSignedIn, user } = useUser();
  const isAdmin = user?.publicMetadata?.isAdmin;

  if (isSignedIn && isAdmin) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-6 bg-white dark:bg-gray-900">
        <h1 className="text-4xl font-bold text-orange-500 mb-6">Admin Panel</h1>
        <p className="text-gray-600 dark:text-gray-300 text-lg mb-4">You're signed in as an admin.</p>
        <Link href="/dashboard?tab=create-post" className="text-orange-400 hover:underline">
          Go to Share Experience Form
        </Link>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-6 bg-white dark:bg-gray-900">
      <h1 className="text-4xl font-bold text-orange-500 mb-6">🚧 Coming Soon!</h1>
      <p className="text-gray-600 dark:text-gray-300 text-lg text-center max-w-xl mb-6">
        We’re working hard to make it possible for everyone to share their career journeys! Soon you'll be able to
        inspire others by telling your story.
      </p>
      {!isSignedIn && (
        <Link href="/sign-in" className="bg-orange-400 hover:bg-orange-500 text-white px-6 py-2 rounded-full font-semibold transition">
          Sign in to Get Notified
        </Link>
      )}
    </div>
  );
}
