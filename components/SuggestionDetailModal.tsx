import React, { useState, useEffect } from 'react';
import type { Suggestion, SuggestionDetails } from '../types';
import { getSuggestionDetails } from '../services/geminiService';
import { LoadingSpinner } from './LoadingSpinner';

// Helper function to render text with inline code snippets
const renderWithCodeSnippets = (text: string) => {
    if (!text) return text;
    const parts = text.split(/(`[^`]+`)/g);
    return parts.map((part, index) => {
        if (part.startsWith('`') && part.endsWith('`')) {
            return <code key={index} className="bg-gray-800 text-red-400 px-1.5 py-1 rounded-md text-xs font-mono">{part.slice(1, -1)}</code>;
        }
        return part;
    });
};

interface SuggestionDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  suggestion: Suggestion;
  repoUrl: string;
}

export const SuggestionDetailModal: React.FC<SuggestionDetailModalProps> = ({
  isOpen,
  onClose,
  suggestion,
  repoUrl,
}) => {
  const [details, setDetails] = useState<SuggestionDetails | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen && !details) { // Only fetch if modal is open and we don't have details yet
      const fetchDetails = async () => {
        setIsLoading(true);
        setError(null);
        try {
          const result = await getSuggestionDetails(suggestion, repoUrl);
          setDetails(result);
        } catch (err) {
          setError(err instanceof Error ? err.message : 'Failed to fetch details.');
        } finally {
          setIsLoading(false);
        }
      };
      fetchDetails();
    }
  }, [isOpen, suggestion, repoUrl, details]);
  
  // Re-render icons on detail load
  useEffect(() => {
    if(details && window.lucide) {
      window.lucide.createIcons();
    }
  }, [details]);


  if (!isOpen) {
    return null;
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 z-50 flex justify-center items-center p-4 transition-opacity duration-300">
      <div className="bg-black border border-gray-800 rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] flex flex-col animate-in fade-in-0 zoom-in-95">
        <header className="p-4 border-b border-gray-800 flex justify-between items-start flex-shrink-0">
          <div>
            <h3 className="text-xl font-semibold text-white">{suggestion.title}</h3>
            {suggestion.issueUrl ? (
                <p className="text-sm text-gray-400 mt-1">{renderWithCodeSnippets(suggestion.description)}</p>
            ) : (
                <span className="mt-2 inline-block text-xs font-medium text-gray-400 bg-gray-800 px-2 py-1 rounded-full">
                    AI Generated Recommendation
                </span>
            )}
          </div>
          <button onClick={onClose} className="p-1 rounded-full hover:bg-gray-800">
            <i data-lucide="x" className="w-6 h-6 text-gray-400" />
          </button>
        </header>
        
        <div className="p-6 overflow-y-auto">
          {isLoading && <div className="py-12"><LoadingSpinner /></div>}
          {error && <div className="text-red-400 text-center py-12">Error: {error}</div>}
          {details && (
            <div className="space-y-6">
              <div>
                <h4 className="font-semibold text-lg mb-2 flex items-center gap-2 text-white"><i data-lucide="git-branch" className="w-5 h-5"/> How to Get Started</h4>
                <ul className="list-disc list-inside space-y-1 pl-2 text-gray-300">
                  {details.howToStart.map((step, i) => <li key={i}>{renderWithCodeSnippets(step)}</li>)}
                </ul>
              </div>
              <div>
                <h4 className="font-semibold text-lg mb-2 flex items-center gap-2 text-white"><i data-lucide="code" className="w-5 h-5"/> Potential Files to Edit</h4>
                <ul className="list-disc list-inside space-y-1 pl-2 text-gray-300">
                  {details.filesToEdit.map((file, i) => <li key={i}><code className="bg-gray-800 px-1 py-0.5 rounded text-sm">{file}</code></li>)}
                </ul>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                    <h4 className="font-semibold text-lg mb-2 flex items-center gap-2 text-white"><i data-lucide="check-circle" className="w-5 h-5"/> Skills Needed</h4>
                    <div className="flex flex-wrap gap-2">
                        {details.skillsNeeded.map((skill, i) => <span key={i} className="bg-gray-800 text-gray-300 text-sm px-2 py-1 rounded">{skill}</span>)}
                    </div>
                </div>
                 <div>
                    <h4 className="font-semibold text-lg mb-2 flex items-center gap-2 text-white"><i data-lucide="clock" className="w-5 h-5"/> Estimated Time</h4>
                    <p className="text-gray-300">{details.estimatedHours} hours</p>
                </div>
              </div>

              {details.sources && details.sources.length > 0 && (
                 <div>
                    <h4 className="font-semibold text-lg mb-2 flex items-center gap-2 text-white"><i data-lucide="link" className="w-5 h-5"/> Helpful Sources</h4>
                     <ul className="space-y-2">
                        {details.sources.map((source, i) => (
                           <li key={i}>
                             <a href={source.uri} target="_blank" rel="noopener noreferrer" className="text-red-400 hover:underline break-all">
                               {source.title || source.uri}
                             </a>
                           </li>
                        ))}
                    </ul>
                </div>
              )}
            </div>
          )}
        </div>
        <footer className="p-4 border-t border-gray-800 flex justify-end items-center gap-3 flex-shrink-0">
            <button onClick={onClose} className="px-4 py-2 bg-gray-800 text-gray-200 rounded-md hover:bg-gray-700">
                Close
            </button>
            {suggestion.issueUrl && (
                <a
                    href={suggestion.issueUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-4 py-2 text-sm font-semibold text-white bg-red-600 rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                >
                    Contribute on GitHub <i data-lucide="arrow-up-right" className="w-4 h-4" />
                </a>
            )}
        </footer>
      </div>
    </div>
  );
};