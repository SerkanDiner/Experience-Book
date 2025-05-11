'use client';

import { SignIn } from '@clerk/nextjs';

export default function SignInPage() {
  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      {/* 🧭 Left Info Panel */}
      <div className="w-full md:w-1/2 bg-orange-50 dark:bg-gray-900 flex items-center justify-center p-10">
        <div className="max-w-md text-center md:text-left">
          <h1 className="text-4xl font-extrabold text-orange-500 mb-4">
            Welcome to Experience Book
          </h1>
          <p className="text-gray-700 dark:text-gray-300 text-lg mb-6">
            Share your real career journey and learn from others.
          </p>
          <ul className="list-disc list-inside text-gray-600 dark:text-gray-400 space-y-2 text-sm">
            <li>🔍 Discover real-world job experiences</li>
            <li>📊 Vote on reviews and gain XP</li>
            <li>📝 Share your own anonymous story</li>
            <li>🏆 Earn credibility and inspire others</li>
          </ul>
          <p className="mt-6 text-gray-500 dark:text-gray-500 text-xs">
            Your journey starts here. One story can change a life – maybe yours.
          </p>
        </div>
      </div>

      {/* 🔐 Right Sign-In Panel */}
      <div className="w-full md:w-1/2 flex items-center justify-center p-6 bg-orange-50 dark:bg-gray-900">
        <div className="w-full max-w-sm">
          <SignIn />
        </div>
      </div>
    </div>
  );
}
