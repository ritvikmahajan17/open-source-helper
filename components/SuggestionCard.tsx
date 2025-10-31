import React, { useState } from 'react';
import type { Suggestion } from '../types';
import { SuggestionDetailModal } from './SuggestionDetailModal';
import { LanguageIcon } from './LanguageIcon';

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

interface SuggestionCardProps {
  suggestion: Suggestion;
  repoUrl: string;
}

const complexityClasses = {
  Easy: 'bg-green-900/30 border-green-700 text-green-300',
  Medium: 'bg-yellow-900/30 border-yellow-700 text-yellow-300',
  Hard: 'bg-red-900/30 border-red-700 text-red-300',
};

const Tag: React.FC<{ text: string }> = ({ text }) => {
  // Simple check to see if the tag is a known language
  const isLanguage = ['typescript', 'javascript', 'js', 'python', 'go', 'rust', 'java', 'html', 'css', 'c++', 'c#', 'php', 'ruby', 'shell', 'swift', 'kotlin', 'scala'].includes(text.toLowerCase());
  
  return (
    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full font-medium bg-gray-800 text-gray-300">
      {isLanguage ? <LanguageIcon language={text} className="w-3 h-3 mr-1.5" /> : <i data-lucide="tag" className="w-3 h-3 mr-1.5" />}
      {text}
    </span>
  );
};


export const SuggestionCard: React.FC<SuggestionCardProps> = ({ suggestion, repoUrl }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <div className="bg-black border border-gray-800 rounded-lg p-6 flex flex-col hover:border-gray-700 transition-colors duration-200">
        <h4 className="text-lg font-semibold mb-2 text-white">{suggestion.title}</h4>
        <p className="text-gray-300 text-sm mb-4 flex-grow line-clamp-3">{renderWithCodeSnippets(suggestion.description)}</p>
        
        <div className="flex flex-wrap gap-2 text-xs mb-4">
            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full font-medium border ${complexityClasses[suggestion.complexity]}`}>
                {suggestion.complexity}
            </span>
            {suggestion.tags.map(tag => <Tag key={tag} text={tag} />)}
        </div>

        <div className="mt-auto flex justify-between items-center">
            <button
                onClick={() => setIsModalOpen(true)}
                className="text-sm font-semibold text-gray-300 hover:text-white"
            >
                View Details
            </button>
            {suggestion.issueUrl ? (
                <a 
                    href={suggestion.issueUrl} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-red-600 rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                >
                    Contribute
                    <i data-lucide="arrow-up-right" className="w-4 h-4" />
                </a>
            ) : (
                <span className="text-xs font-medium text-gray-400 bg-gray-800 px-2 py-1 rounded-full">
                    AI Suggestion
                </span>
            )}
        </div>
      </div>
      {isModalOpen && (
        <SuggestionDetailModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          suggestion={suggestion}
          repoUrl={repoUrl}
        />
      )}
    </>
  );
};