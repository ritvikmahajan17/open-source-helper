import React, { useState, FormEvent } from 'react';

interface RepoInputProps {
  onAnalyze: (repoUrl: string) => void;
  isLoading: boolean;
}

export const RepoInput: React.FC<RepoInputProps> = ({ onAnalyze, isLoading }) => {
  const [repoUrl, setRepoUrl] = useState('');

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    onAnalyze(repoUrl);
  };

  return (
    <div>
      <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-2">
        <input
          type="url"
          value={repoUrl}
          onChange={(e) => setRepoUrl(e.target.value)}
          placeholder="e.g., https://github.com/facebook/react"
          className="flex-grow px-4 py-2 text-base text-white bg-black border border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
          required
          disabled={isLoading}
        />
        <button
          type="submit"
          className="px-6 py-2 text-base font-semibold text-white bg-red-600 rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:bg-red-800 disabled:cursor-not-allowed"
          disabled={isLoading}
        >
          {isLoading ? 'Analyzing...' : 'Analyze'}
        </button>
      </form>
      <p className="text-center text-sm text-gray-400 mt-3">
        Enter a public GitHub repository URL.
      </p>
    </div>
  );
};
