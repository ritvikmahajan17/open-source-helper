import React, { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { RepoInput } from "../components/RepoInput";

// Suggested repositories pool
const SUGGESTED_REPOS = [
  {
    name: "React",
    url: "https://github.com/facebook/react",
    description: "A declarative, efficient JavaScript library for building user interfaces",
    category: "Popular"
  },
  {
    name: "VS Code",
    url: "https://github.com/microsoft/vscode",
    description: "Visual Studio Code - open source code editor",
    category: "Popular"
  },
  {
    name: "Next.js",
    url: "https://github.com/vercel/next.js",
    description: "The React Framework for Production",
    category: "Popular"
  },
  {
    name: "TensorFlow",
    url: "https://github.com/tensorflow/tensorflow",
    description: "An Open Source Machine Learning Framework",
    category: "ML/AI"
  },
  {
    name: "Node.js",
    url: "https://github.com/nodejs/node",
    description: "JavaScript runtime built on Chrome's V8 engine",
    category: "Popular"
  },
  {
    name: "Vue.js",
    url: "https://github.com/vuejs/vue",
    description: "Progressive JavaScript Framework",
    category: "Popular"
  },
  {
    name: "Tailwind CSS",
    url: "https://github.com/tailwindlabs/tailwindcss",
    description: "A utility-first CSS framework for rapid UI development",
    category: "Beginner-Friendly"
  },
  {
    name: "FastAPI",
    url: "https://github.com/tiangolo/fastapi",
    description: "Modern, fast web framework for building APIs with Python",
    category: "Beginner-Friendly"
  },
  {
    name: "TypeScript",
    url: "https://github.com/microsoft/TypeScript",
    description: "Superset of JavaScript that compiles to clean JavaScript",
    category: "Popular"
  },
  {
    name: "Axios",
    url: "https://github.com/axios/axios",
    description: "Promise-based HTTP client for browser and Node.js",
    category: "Beginner-Friendly"
  }
];

// Helper function to get 3 random repos
const getRandomRepos = (repos: typeof SUGGESTED_REPOS, count: number = 3) => {
  const shuffled = [...repos].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
};

interface HomeProps {
  onAnalyze: (repoUrl: string) => Promise<void>;
  isLoading: boolean;
}

export function Home({ onAnalyze, isLoading }: HomeProps) {
  const navigate = useNavigate();

  // Get 3 random repos on component mount
  const suggestedRepos = useMemo(() => getRandomRepos(SUGGESTED_REPOS), []);

  const handleAnalyze = async (repoUrl: string) => {
    await onAnalyze(repoUrl);
  };

  return (
    <div className="max-w-4xl mx-auto text-center mt-12 sm:mt-20">
      <h2 className="text-4xl font-bold tracking-tight sm:text-6xl mb-4 font-serif">
        Find Your Next Contribution
      </h2>
      <p className="text-lg text-gray-300 mb-8">
        Enter a public GitHub repository URL to get an AI-powered
        analysis of contribution opportunities, from documentation fixes
        to "good first issues."
      </p>
      <RepoInput onAnalyze={handleAnalyze} isLoading={isLoading} />

      {/* Suggested Repositories */}
      <div className="mt-8 mb-12">
        <h3 className="text-sm font-semibold text-gray-400 mb-4 uppercase tracking-wide">
          Or try these popular repositories
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {suggestedRepos.map((repo) => (
            <button
              key={repo.url}
              onClick={() => handleAnalyze(repo.url)}
              disabled={isLoading}
              className="bg-gray-900/50 border border-gray-800 rounded-lg p-4 text-left hover:border-red-500 hover:bg-gray-900/70 transition-all disabled:opacity-50 disabled:cursor-not-allowed group"
            >
              <div className="flex items-start justify-between mb-2">
                <h4 className="text-lg font-bold text-white group-hover:text-red-500 transition-colors">
                  {repo.name}
                </h4>
                <span className="text-xs px-2 py-1 rounded-full bg-red-500/10 text-red-400 border border-red-500/20">
                  {repo.category}
                </span>
              </div>
              <p className="text-sm text-gray-400 leading-relaxed">
                {repo.description}
              </p>
            </button>
          ))}
        </div>
      </div>

      {/* How It Works - 3 Steps */}
      <div className="mt-16 mb-12">
        <h3 className="text-2xl font-bold text-gray-400 mb-12 tracking-wide uppercase text-sm">
          How It Works
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-left">
          {/* Step 1 */}
          <div className="relative p-8">
            <div className="text-6xl font-bold text-red-500/20 mb-4 font-serif">
              01
            </div>
            <h4 className="text-xl font-bold text-white mb-3 tracking-tight">
              Paste Repository URL
            </h4>
            <p className="text-gray-400 leading-relaxed">
              Drop in any public GitHub repo link. We'll fetch all the
              essential data instantly.
            </p>
          </div>

          {/* Step 2 */}
          <div className="relative p-8">
            <div className="text-6xl font-bold text-red-500/20 mb-4 font-serif">
              02
            </div>
            <h4 className="text-xl font-bold text-white mb-3 tracking-tight">
              AI-Powered Analysis
            </h4>
            <p className="text-gray-400 leading-relaxed">
              Our AI categorizes issues by difficulty and suggests
              contribution ideas tailored for you.
            </p>
          </div>

          {/* Step 3 */}
          <div className="relative p-8">
            <div className="text-6xl font-bold text-red-500/20 mb-4 font-serif">
              03
            </div>
            <h4 className="text-xl font-bold text-white mb-3 tracking-tight">
              Start Contributing
            </h4>
            <p className="text-gray-400 leading-relaxed">
              Pick an issue matching your skill level and dive in with
              actionable guidance.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
