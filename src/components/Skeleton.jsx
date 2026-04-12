import React from 'react';

export const ProductSkeleton = () => (
  <div className="bg-white rounded-3xl border border-gray-100 overflow-hidden flex flex-col h-full animate-pulse">
    <div className="bg-gray-200 pt-[100%] w-full"></div>
    <div className="p-5 flex flex-col flex-grow space-y-3">
      <div className="h-4 bg-gray-200 rounded-full w-3/4"></div>
      <div className="h-3 bg-gray-100 rounded-full w-full"></div>
      <div className="h-3 bg-gray-100 rounded-full w-5/6"></div>
      <div className="flex justify-between items-center mt-auto pt-3 border-t border-gray-50">
        <div className="h-6 bg-gray-200 rounded-lg w-16"></div>
        <div className="h-8 bg-gray-200 rounded-xl w-20"></div>
      </div>
    </div>
  </div>
);

export const CategorySkeleton = () => (
  <div className="flex flex-col items-center animate-pulse">
    <div className="w-full aspect-square bg-gray-200 rounded-2xl mb-2"></div>
    <div className="h-3 bg-gray-100 rounded-full w-12"></div>
  </div>
);
