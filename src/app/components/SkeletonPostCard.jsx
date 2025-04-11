export default function SkeletonPostCard() {
    return (
      <div className="animate-pulse bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg p-4 shadow">
        <div className="h-48 bg-gray-200 dark:bg-gray-700 rounded mb-4" />
        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-2" />
        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-2/4" />
      </div>
    );
  }
  