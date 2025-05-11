'use client';

import { SignUp } from '@clerk/nextjs';

export default function SignUpPage() {
  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      {/* 📘 Left Information Panel */}
      <div className="w-full md:w-1/2 bg-orange-50 dark:bg-gray-900 flex items-center justify-center p-10">
        <div className="max-w-md text-center md:text-left">
          <h1 className="text-4xl font-extrabold text-orange-500 mb-4">
            Join Experience Book
          </h1>
          <p className="text-gray-700 dark:text-gray-300 text-lg mb-6">
            Be part of a community sharing real, raw, and inspiring career stories.
          </p>
          <ul className="list-disc list-inside text-gray-600 dark:text-gray-400 space-y-2 text-sm">
            <li>✍️ Share your journey anonymously</li>
            <li>💬 Connect through questions & feedback</li>
            <li>🏅 Earn XP and badges by engaging</li>
            <li>🌍 Help others choose their path wisely</li>
          </ul>
          <p className="mt-6 text-gray-500 dark:text-gray-500 text-xs">
            One experience can spark someone’s future. Let yours be the one.
          </p>
        </div>
      </div>

      {/* 🔐 Right Sign-Up Form */}
      <div className="w-full md:w-1/2 flex items-center justify-center p-6 bg-orange-50 dark:bg-gray-900">
        <div className="w-full max-w-sm">
          <SignUp />
        </div>
      </div>
    </div>
  );
}
