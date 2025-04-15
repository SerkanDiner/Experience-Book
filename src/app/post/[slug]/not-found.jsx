import Link from 'next/link';
import { FaExclamationTriangle } from 'react-icons/fa';

export default function NotFound() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center text-center px-4 py-12 bg-white dark:bg-gray-900">
      <FaExclamationTriangle className="text-orange-500 text-6xl mb-4" />

      <h1 className="text-4xl font-bold text-orange-600 mb-2">Page Not Found</h1>
      <p className="text-gray-600 dark:text-gray-300 max-w-xl mb-6">
        Sorry, the page you’re looking for doesn’t exist or was removed.
      </p>

      <Link
        href="/"
        className="inline-block px-5 py-2 bg-orange-500 text-white rounded-full shadow hover:bg-orange-600 transition"
      >
        Go to Home
      </Link>
    </main>
  );
}
