// src/app/loading.jsx

export default function Loading() {
    return (
      <div className="min-h-screen flex items-center justify-center text-center">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-orange-500 mr-3"></div>
        <p className="text-lg font-semibold text-orange-500">Loading page...</p>
      </div>
    );
  }
  