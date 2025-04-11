import Link from 'next/link';

export default function NotFound() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center text-center p-6">
      <h1 className="text-4xl font-bold text-orange-600 mb-4">Post Not Found</h1>
      <p className="text-gray-600 dark:text-gray-300 mb-6">
        Sorry, the post you’re looking for doesn’t exist or was removed.
      </p>
      <Link href="/">
        <span className="px-4 py-2 bg-orange-500 text-white rounded hover:bg-orange-600 transition">
          Go to Home
        </span>
      </Link>
    </main>
  );
}
