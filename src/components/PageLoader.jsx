import React from 'react';

const PageLoader = () => {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center p-4">
      <div className="relative w-20 h-20 mb-4">
        {/* Skeleton spinner */}
        <div className="absolute inset-0 border-4 border-gray-100 rounded-full"></div>
        <div className="absolute inset-0 border-4 border-green-500 rounded-full border-t-transparent animate-spin"></div>
      </div>
      <h2 className="text-xl font-bold text-gray-900 tracking-tight animate-pulse">Loading Store...</h2>
    </div>
  );
};

export default PageLoader;
