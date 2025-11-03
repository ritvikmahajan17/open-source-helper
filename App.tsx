import React, { useState, useCallback, useMemo } from "react";
import { RepoInput } from "./components/RepoInput";
import { ResultsDashboard } from "./components/ResultsDashboard";
import { LoadingSpinner } from "./components/LoadingSpinner";
import { ParticlesBackground } from "./components/ParticlesBackground";
import { Plane } from "lucide-react";
import type { RepoAnalysis } from "./types";
import { analyzeRepo } from "./services/geminiService";

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

function App() {
  const [repoAnalysis, setRepoAnalysis] = useState<RepoAnalysis | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Get 3 random repos on component mount
  const suggestedRepos = useMemo(() => getRandomRepos(SUGGESTED_REPOS), []);

  const handleAnalyze = useCallback(async (repoUrl: string) => {
    if (!repoUrl) return;

    // GA4 Event: User clicked analyze button
    if (window.gtag) {
      window.gtag('event', 'analyze_button_clicked', {
        event_category: 'engagement',
        event_label: repoUrl,
        repo_url: repoUrl
      });
    }

    setIsLoading(true);
    setError(null);
    setRepoAnalysis(null);
    try {
      const analysis = await analyzeRepo(repoUrl);
      setRepoAnalysis(analysis);

      // GA4 Event: Analysis successfully loaded
      if (window.gtag) {
        window.gtag('event', 'analysis_loaded', {
          event_category: 'engagement',
          event_label: repoUrl,
          repo_url: repoUrl,
          repo_name: analysis.repoName
        });
      }
    } catch (err) {
      console.error(err);
      let errorMessage =
        err instanceof Error
          ? err.message
          : "An unknown error occurred. Please check the console.";
      if (errorMessage.includes("API rate limit exceeded")) {
        errorMessage =
          "GitHub API rate limit exceeded. Please try again later.";
      }
      setError(errorMessage);

      // GA4 Event: Analysis failed
      if (window.gtag) {
        window.gtag('event', 'analysis_failed', {
          event_category: 'error',
          event_label: errorMessage,
          repo_url: repoUrl
        });
      }
    } finally {
      setIsLoading(false);
    }
  }, []);

  const handleReset = () => {
    setRepoAnalysis(null);
    setError(null);
  };

  return (
    <>
      <ParticlesBackground />
      <div className="min-h-screen text-white font-sans">
        <header className="py-4 px-6 border-b border-gray-800">
          <div className="container mx-auto flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Plane className="w-6 h-6 text-red-500" />
              <h1 className="text-xl font-serif font-semibold">Repo Pilot</h1>
            </div>
            <div className="flex items-center gap-4">
              <a
                href="https://www.producthunt.com/products/repo-pilot-2?embed=true&utm_source=badge-featured&utm_medium=badge&utm_source=badge-repo-pilot-2"
                target="_blank"
                rel="noopener noreferrer"
                className="transition-opacity hover:opacity-80 hidden sm:block"
              >
                <img
                  src="https://api.producthunt.com/widgets/embed-image/v1/featured.svg?post_id=1033368&theme=dark&t=1762028477291"
                  alt="Repo Pilot - Your guide to open-source contributions. | Product Hunt"
                  style={{ width: "150px", height: "32px" }}
                  width="150"
                  height="32"
                />
              </a>
              <p className="text-sm text-gray-400 hidden sm:block">
                Your guide to open-source contributions.
              </p>
            </div>
          </div>
        </header>
        <main className="container mx-auto p-4 md:p-6 lg:p-8">
          {!repoAnalysis && !isLoading && (
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
          )}

          {isLoading && <LoadingSpinner />}

          {error && (
            <div
              className="max-w-2xl mx-auto my-8 text-center bg-red-900/30 border border-red-500 text-red-200 px-4 py-3 rounded-lg"
              role="alert"
            >
              <strong className="font-bold">Error: </strong>
              <span className="block sm:inline">{error}</span>
              <button
                onClick={handleReset}
                className="ml-4 bg-red-600 hover:bg-red-700 text-white font-bold py-1 px-3 rounded-lg transition-colors text-sm"
              >
                Try Again
              </button>
            </div>
          )}

          {repoAnalysis && (
            <div>
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-3xl font-bold">{repoAnalysis.repoName}</h2>
                <button
                  onClick={handleReset}
                  className="border border-white hover:bg-gray-800 text-white font-bold py-2 px-4 rounded-lg transition-colors"
                >
                  Analyze Another Repo
                </button>
              </div>
              <ResultsDashboard analysis={repoAnalysis} />
            </div>
          )}
        </main>
      </div>
    </>
  );
}

export default App;
