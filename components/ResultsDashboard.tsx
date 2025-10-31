import React, { useState } from 'react';
import type { RepoAnalysis, LanguageUsage, Contributor, Suggestion } from '../types';
import { SuggestionCard } from './SuggestionCard';
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

// Sub-component for individual stat cards
const InfoCard: React.FC<{icon: React.ReactElement<React.SVGProps<SVGSVGElement>>, title: string, value: string | number}> = ({icon, title, value}) => (
    <div className="bg-black border border-gray-800 p-6 rounded-lg flex items-center gap-4">
        <div className="bg-red-900/30 p-3 rounded-full text-red-400">
            {React.cloneElement(icon, { className: 'w-6 h-6' })}
        </div>
        <div>
            <p className="text-sm text-gray-400">{title}</p>
            <p className="text-2xl font-bold text-white">{value.toLocaleString()}</p>
        </div>
    </div>
);

// Sub-component for language usage list
const LanguageUsageList: React.FC<{languages: LanguageUsage[]}> = ({languages}) => (
    <ul className="space-y-3 w-full">
        {languages.slice(0, 5).map((lang) => (
            <li key={lang.name} className="flex items-center gap-3 text-sm">
                <LanguageIcon language={lang.name} className="w-5 h-5 text-gray-400 flex-shrink-0" />
                <span className="font-medium text-white flex-grow">{lang.name}</span>
                <span className="font-semibold text-gray-400">{lang.percentage}%</span>
            </li>
        ))}
    </ul>
);

// Sub-component for top contributors list
const TopContributorsList: React.FC<{contributors: Contributor[]}> = ({contributors}) => (
    <ul className="space-y-3">
        {contributors.slice(0, 5).map(c => (
            <li key={c.login} className="flex items-center gap-3">
                <img src={c.avatar_url} alt={c.login} className="w-10 h-10 rounded-full" />
                <div>
                  <a href={c.html_url} target="_blank" rel="noopener noreferrer" className="font-medium text-white hover:underline">
                      {c.login}
                  </a>
                </div>
            </li>
        ))}
    </ul>
);

// Sub-component for contribution guidelines
const HowToContribute: React.FC<{guidelines: string[]}> = ({guidelines}) => (
    <div>
        <ul className="space-y-3">
            {guidelines.map((step, index) => (
                <li key={index} className="flex items-start gap-3">
                    <i data-lucide="check-circle-2" className="w-5 h-5 text-red-500 mt-1 flex-shrink-0" />
                    <span className="text-gray-300">{renderWithCodeSnippets(step)}</span>
                </li>
            ))}
        </ul>
    </div>
);

interface ResultsDashboardProps {
  analysis: RepoAnalysis;
}

type DifficultyTab = 'Easy' | 'Medium' | 'Hard';

export const ResultsDashboard: React.FC<ResultsDashboardProps> = ({ analysis }) => {
  const [activeTab, setActiveTab] = useState<DifficultyTab>('Easy');

  const getSuggestionsForTab = (tab: DifficultyTab): Suggestion[] => {
    switch (tab) {
      case 'Easy':
        return analysis.easySuggestions || [];
      case 'Medium':
        return analysis.mediumSuggestions || [];
      case 'Hard':
        return analysis.hardSuggestions || [];
      default:
        return [];
    }
  };

  const currentSuggestions = getSuggestionsForTab(activeTab);

  return (
    <div className="space-y-8">
      {/* Header Stats */}
       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <InfoCard icon={<i data-lucide="star"></i>} title="Stars" value={analysis.stars} />
          <InfoCard icon={<i data-lucide="git-fork"></i>} title="Forks" value={analysis.forks} />
          <InfoCard icon={<i data-lucide="alert-circle"></i>} title="Open Issues" value={analysis.totalOpenIssues} />
          <InfoCard icon={<i data-lucide="users"></i>} title="Total Contributors" value={analysis.totalContributors} />
      </div>
      
      {/* Description */}
      <div className="bg-black border border-gray-800 p-6 rounded-lg">
          <p className="text-gray-300">{analysis.description}</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
             {/* How to Contribute */}
              <div className="bg-black border border-gray-800 p-6 rounded-lg">
                  <div className="flex items-center gap-3 mb-4">
                      <i data-lucide="book-marked" className="w-6 h-6 text-red-400" />
                      <h3 className="text-xl font-semibold text-white">How to Contribute</h3>
                  </div>
                  <HowToContribute guidelines={analysis.contributionGuidelines} />
              </div>

              {/* Contribution Ideas with Tabs */}
              <div>
                <div className="flex items-center gap-3 mb-4">
                    <i data-lucide="lightbulb" className="w-6 h-6 text-red-400" />
                    <h3 className="text-2xl font-bold text-white">Contribution Ideas</h3>
                </div>

                {/* Difficulty Tabs */}
                <div className="flex gap-2 mb-6 border-b border-gray-800">
                  {(['Easy', 'Medium', 'Hard'] as DifficultyTab[]).map((tab) => {
                    const count = getSuggestionsForTab(tab).length;
                    return (
                      <button
                        key={tab}
                        onClick={() => setActiveTab(tab)}
                        className={`px-6 py-3 font-semibold transition-all relative ${
                          activeTab === tab
                            ? 'text-red-400'
                            : 'text-gray-400 hover:text-gray-200'
                        }`}
                      >
                        {tab}
                        {count > 0 && (
                          <span className={`ml-2 text-xs px-2 py-0.5 rounded-full ${
                            activeTab === tab
                              ? 'bg-red-900/30 text-red-400'
                              : 'bg-gray-800 text-gray-400'
                          }`}>
                            {count}
                          </span>
                        )}
                        {activeTab === tab && (
                          <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-red-400"></div>
                        )}
                      </button>
                    );
                  })}
                </div>

                {/* Suggestions Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {currentSuggestions.length > 0 ? (
                    currentSuggestions.map((suggestion, index) => (
                      <SuggestionCard 
                        key={index} 
                        suggestion={suggestion} 
                        repoUrl={`https://github.com/${analysis.repoName}`} 
                      />
                    ))
                  ) : (
                    <div className="col-span-2 text-center py-12 bg-black border border-gray-800 rounded-lg">
                      <i data-lucide="inbox" className="w-12 h-12 text-gray-600 mx-auto mb-3" />
                      <p className="text-gray-400">No {activeTab.toLowerCase()} issues found for this repository.</p>
                      <p className="text-gray-500 text-sm mt-2">Try selecting a different difficulty level.</p>
                    </div>
                  )}
                </div>
              </div>
          </div>

          <div className="lg:col-span-1 space-y-8">
              {/* Languages */}
              <div className="bg-black border border-gray-800 p-6 rounded-lg">
                <h3 className="text-xl font-semibold mb-4 text-white">Languages</h3>
                <LanguageUsageList languages={analysis.languagesUsed} />
              </div>

              {/* Top Contributors */}
              <div className="bg-black border border-gray-800 p-6 rounded-lg">
                <h3 className="text-xl font-semibold mb-4 text-white">Top Contributors</h3>
                <TopContributorsList contributors={analysis.topContributors} />
              </div>
          </div>
      </div>
    </div>
  );
};