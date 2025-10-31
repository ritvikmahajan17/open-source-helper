import React from 'react';

export const LoadingSpinner: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center my-12">
      <div className="w-16 h-16 border-4 border-red-500 border-solid rounded-full animate-spin border-t-transparent"></div>
      <p className="mt-4 text-lg text-gray-300">Analyzing repository... this may take a moment.</p>
    </div>
  );
};