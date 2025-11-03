import React, { useState, useCallback } from "react";
import { Routes, Route, useNavigate } from "react-router-dom";
import { LoadingSpinner } from "./components/LoadingSpinner";
import { ParticlesBackground } from "./components/ParticlesBackground";
import { Plane } from "lucide-react";
import type { RepoAnalysis } from "./types";
import { analyzeRepo } from "./services/geminiService";
import { DEMO_ANALYSIS } from "./data/demoAnalysis";
import { Home } from "./pages/Home";
import { Results } from "./pages/Results";

function App() {
  const navigate = useNavigate();
  const [repoAnalysis, setRepoAnalysis] = useState<RepoAnalysis | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isDemoMode, setIsDemoMode] = useState(false);

  const handleAnalyze = useCallback(async (repoUrl: string) => {
    if (!repoUrl) return;

    // Exit demo mode if active
    if (isDemoMode) {
      setIsDemoMode(false);
    }

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

      // Navigate to results page
      navigate('/results');
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
  }, [isDemoMode, navigate]);

  const handleReset = () => {
    setRepoAnalysis(null);
    setError(null);
    setIsDemoMode(false);
    navigate('/');
  };

  const handleExitDemoMode = () => {
    setRepoAnalysis(null);
    setIsDemoMode(false);

    // GA4 Event: Demo mode exited
    if (window.gtag) {
      window.gtag('event', 'demo_mode_exited', {
        event_category: 'engagement',
        event_label: 'banner_cta'
      });
    }

    navigate('/');
  };

  const handleViewExample = () => {
    setRepoAnalysis(DEMO_ANALYSIS);
    setIsDemoMode(true);
    setError(null);

    // GA4 Event: View example button clicked
    if (window.gtag) {
      window.gtag('event', 'view_example_clicked', {
        event_category: 'engagement',
        event_label: 'navbar'
      });
    }

    navigate('/results');
  };

  return (
    <>
      <ParticlesBackground />
      <div className="min-h-screen text-white font-sans">
        <header className="py-4 px-6 border-b border-gray-800">
          <div className="container mx-auto flex items-center justify-between">
            <div className="flex items-center gap-3 cursor-pointer" onClick={() => navigate('/')}>
              <Plane className="w-6 h-6 text-red-500" />
              <h1 className="text-xl font-serif font-semibold">Repo Pilot</h1>
            </div>
            <div className="flex items-center gap-4">
              <button
                onClick={handleViewExample}
                className="text-sm text-gray-300 hover:text-red-400 transition-colors font-medium"
              >
                View Example
              </button>
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
          {isLoading ? (
            <LoadingSpinner />
          ) : (
            <>
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

              <Routes>
                <Route
                  path="/"
                  element={<Home onAnalyze={handleAnalyze} isLoading={isLoading} />}
                />
                <Route
                  path="/results"
                  element={
                    <Results
                      analysis={repoAnalysis}
                      isDemoMode={isDemoMode}
                      onExitDemoMode={handleExitDemoMode}
                    />
                  }
                />
              </Routes>
            </>
          )}
        </main>
      </div>
    </>
  );
}

export default App;
