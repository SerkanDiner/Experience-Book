// src/app/loading.jsx
import { FaSpinner } from 'react-icons/fa';

export default function Loading() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center text-center bg-white dark:bg-gray-900">
      <FaSpinner className="animate-spin text-orange-500 text-5xl mb-4" />
      <p className="text-lg font-semibold text-gray-700 dark:text-gray-200">
        Experience...
      </p>
    </div>
  );
}