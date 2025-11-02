import React, { useState, useCallback } from "react";
import { RepoInput } from "./components/RepoInput";
import { ResultsDashboard } from "./components/ResultsDashboard";
import { LoadingSpinner } from "./components/LoadingSpinner";
import { ParticlesBackground } from "./components/ParticlesBackground";
import { Plane } from "lucide-react";
import type { RepoAnalysis } from "./types";
import { analyzeRepo } from "./services/geminiService";

function App() {
  const [repoAnalysis, setRepoAnalysis] = useState<RepoAnalysis | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

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

              {/* User Reviews / Testimonials */}
              <div className="mt-20 mb-16">
                <h3 className="text-2xl font-bold text-gray-400 mb-12 tracking-wide uppercase text-sm text-center">
                  What Developers Are Saying
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
                  {/* Twitter-style Review 1 */}
                  <div className="bg-gray-900/50 border border-gray-800 rounded-lg p-6 hover:border-gray-700 transition-colors">
                    <div className="flex items-start gap-3 mb-4">
                      <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold">
                        SK
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <h4 className="font-bold text-white">Sarah Kim</h4>
                          <span className="text-blue-400">
                            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                              <path d="M22.46 6c-.85.38-1.78.64-2.75.76 1-.6 1.76-1.55 2.12-2.68-.93.55-1.96.95-3.06 1.17-.88-.94-2.13-1.53-3.51-1.53-2.66 0-4.81 2.16-4.81 4.81 0 .38.04.75.13 1.1-4-.2-7.54-2.12-9.91-5.04-.42.72-.66 1.55-.66 2.44 0 1.67.85 3.14 2.14 4-.79-.03-1.53-.24-2.18-.6v.06c0 2.33 1.66 4.28 3.86 4.72-.4.11-.83.17-1.27.17-.31 0-.62-.03-.92-.08.62 1.94 2.42 3.35 4.55 3.39-1.67 1.31-3.77 2.09-6.05 2.09-.39 0-.78-.02-1.17-.07 2.18 1.4 4.77 2.21 7.55 2.21 9.06 0 14-7.5 14-14 0-.21 0-.42-.02-.63.96-.69 1.8-1.56 2.46-2.55z"/>
                            </svg>
                          </span>
                        </div>
                        <p className="text-sm text-gray-500">@sarahkim_dev</p>
                      </div>
                    </div>
                    <p className="text-gray-300 leading-relaxed">
                      Just found my first open source contribution using Repo Pilot! 🎉 The AI analysis made it so easy to find beginner-friendly issues. Game changer for new contributors! 🚀
                    </p>
                    <div className="mt-4 text-sm text-gray-500">
                      <span>via Twitter</span>
                    </div>
                  </div>

                  {/* LinkedIn-style Review 2 */}
                  <div className="bg-gray-900/50 border border-gray-800 rounded-lg p-6 hover:border-gray-700 transition-colors">
                    <div className="flex items-start gap-3 mb-4">
                      <div className="w-12 h-12 rounded-full bg-gradient-to-br from-green-500 to-teal-600 flex items-center justify-center text-white font-bold">
                        MJ
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <h4 className="font-bold text-white">Marcus Johnson</h4>
                          <span className="text-blue-600">
                            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                              <path d="M19 0h-14c-2.76 0-5 2.24-5 5v14c0 2.76 2.24 5 5 5h14c2.76 0 5-2.24 5-5v-14c0-2.76-2.24-5-5-5zm-11 19h-3v-10h3v10zm-1.5-11.27c-.97 0-1.75-.79-1.75-1.76s.78-1.75 1.75-1.75 1.75.78 1.75 1.75-.79 1.76-1.75 1.76zm13.5 11.27h-3v-5.6c0-3.37-4-3.12-4 0v5.6h-3v-10h3v1.77c1.4-2.6 7-2.79 7 2.48v5.75z"/>
                            </svg>
                          </span>
                        </div>
                        <p className="text-sm text-gray-500">Senior Developer at TechCorp</p>
                      </div>
                    </div>
                    <p className="text-gray-300 leading-relaxed">
                      Repo Pilot has transformed how I onboard junior developers to open source. The categorization by difficulty level is brilliant. Highly recommend! 💯
                    </p>
                    <div className="mt-4 text-sm text-gray-500">
                      <span>via LinkedIn</span>
                    </div>
                  </div>

                  {/* Reddit-style Review 3 */}
                  <div className="bg-gray-900/50 border border-gray-800 rounded-lg p-6 hover:border-gray-700 transition-colors">
                    <div className="flex items-start gap-3 mb-4">
                      <div className="w-12 h-12 rounded-full bg-gradient-to-br from-orange-500 to-red-600 flex items-center justify-center text-white font-bold">
                        AP
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <h4 className="font-bold text-white">u/alexcodes</h4>
                          <span className="text-orange-500">
                            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                              <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/>
                            </svg>
                          </span>
                        </div>
                        <p className="text-sm text-gray-500">r/opensource</p>
                      </div>
                    </div>
                    <p className="text-gray-300 leading-relaxed">
                      Been lurking in open source for years, too intimidated to contribute. Repo Pilot finally gave me the confidence to make my first PR. Thanks devs! 🙏
                    </p>
                    <div className="mt-4 text-sm text-gray-500">
                      <span>via Reddit</span>
                    </div>
                  </div>

                  {/* Twitter-style Review 4 */}
                  <div className="bg-gray-900/50 border border-gray-800 rounded-lg p-6 hover:border-gray-700 transition-colors">
                    <div className="flex items-start gap-3 mb-4">
                      <div className="w-12 h-12 rounded-full bg-gradient-to-br from-pink-500 to-purple-600 flex items-center justify-center text-white font-bold">
                        EP
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <h4 className="font-bold text-white">Elena Petrova</h4>
                          <span className="text-blue-400">
                            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                              <path d="M22.46 6c-.85.38-1.78.64-2.75.76 1-.6 1.76-1.55 2.12-2.68-.93.55-1.96.95-3.06 1.17-.88-.94-2.13-1.53-3.51-1.53-2.66 0-4.81 2.16-4.81 4.81 0 .38.04.75.13 1.1-4-.2-7.54-2.12-9.91-5.04-.42.72-.66 1.55-.66 2.44 0 1.67.85 3.14 2.14 4-.79-.03-1.53-.24-2.18-.6v.06c0 2.33 1.66 4.28 3.86 4.72-.4.11-.83.17-1.27.17-.31 0-.62-.03-.92-.08.62 1.94 2.42 3.35 4.55 3.39-1.67 1.31-3.77 2.09-6.05 2.09-.39 0-.78-.02-1.17-.07 2.18 1.4 4.77 2.21 7.55 2.21 9.06 0 14-7.5 14-14 0-.21 0-.42-.02-.63.96-.69 1.8-1.56 2.46-2.55z"/>
                            </svg>
                          </span>
                        </div>
                        <p className="text-sm text-gray-500">@elena_codes</p>
                      </div>
                    </div>
                    <p className="text-gray-300 leading-relaxed">
                      As a bootcamp grad, finding my first contributions felt impossible. Repo Pilot changed that overnight. Already submitted 3 PRs! 🔥
                    </p>
                    <div className="mt-4 text-sm text-gray-500">
                      <span>via Twitter</span>
                    </div>
                  </div>

                  {/* Dev.to-style Review 5 */}
                  <div className="bg-gray-900/50 border border-gray-800 rounded-lg p-6 hover:border-gray-700 transition-colors">
                    <div className="flex items-start gap-3 mb-4">
                      <div className="w-12 h-12 rounded-full bg-gradient-to-br from-yellow-500 to-orange-600 flex items-center justify-center text-white font-bold">
                        RC
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <h4 className="font-bold text-white">Raj Chandra</h4>
                          <span className="text-purple-500">
                            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                              <path d="M7.42 10.05c-.18-.16-.46-.23-.84-.23H6l.02 2.44.04 2.45.56-.02c.41 0 .63-.07.83-.26.24-.24.26-.36.26-2.2 0-1.91-.02-1.96-.29-2.18zM0 4.94v14.12h24V4.94H0zM8.56 15.3c-.44.58-1.06.77-2.53.77H4.71V8.53h1.4c1.67 0 2.16.18 2.6.9.27.43.29.6.32 2.57.05 2.23-.02 2.73-.47 3.3zm5.09-5.47h-2.47v1.77h1.52v1.28l-.72.04-.75.03v1.77l1.22.03 1.2.04v1.28h-1.6c-1.53 0-1.6-.01-1.87-.3l-.3-.28v-3.16c0-3.02.01-3.18.25-3.48.23-.31.25-.31 1.88-.31h1.64v1.3zm4.68 5.45c-.17.43-.64.79-1 .79-.18 0-.45-.15-.67-.39-.32-.32-.45-.63-.82-2.08l-.9-3.39-.45-1.67h.76c.4 0 .75.02.75.05 0 .06 1.16 4.54 1.26 4.83.04.15.32-.7.73-2.3l.66-2.52.74-.04c.4-.02.73 0 .73.04 0 .14-1.67 6.38-1.8 6.68z"/>
                            </svg>
                          </span>
                        </div>
                        <p className="text-sm text-gray-500">Full Stack Developer</p>
                      </div>
                    </div>
                    <p className="text-gray-300 leading-relaxed">
                      The AI suggestions are spot-on! Found issues that perfectly match my skill level. This tool should be mandatory for anyone starting in open source.
                    </p>
                    <div className="mt-4 text-sm text-gray-500">
                      <span>via Dev.to</span>
                    </div>
                  </div>

                  {/* Twitter-style Review 6 */}
                  <div className="bg-gray-900/50 border border-gray-800 rounded-lg p-6 hover:border-gray-700 transition-colors">
                    <div className="flex items-start gap-3 mb-4">
                      <div className="w-12 h-12 rounded-full bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center text-white font-bold">
                        TW
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <h4 className="font-bold text-white">Taylor Wu</h4>
                          <span className="text-blue-400">
                            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                              <path d="M22.46 6c-.85.38-1.78.64-2.75.76 1-.6 1.76-1.55 2.12-2.68-.93.55-1.96.95-3.06 1.17-.88-.94-2.13-1.53-3.51-1.53-2.66 0-4.81 2.16-4.81 4.81 0 .38.04.75.13 1.1-4-.2-7.54-2.12-9.91-5.04-.42.72-.66 1.55-.66 2.44 0 1.67.85 3.14 2.14 4-.79-.03-1.53-.24-2.18-.6v.06c0 2.33 1.66 4.28 3.86 4.72-.4.11-.83.17-1.27.17-.31 0-.62-.03-.92-.08.62 1.94 2.42 3.35 4.55 3.39-1.67 1.31-3.77 2.09-6.05 2.09-.39 0-.78-.02-1.17-.07 2.18 1.4 4.77 2.21 7.55 2.21 9.06 0 14-7.5 14-14 0-.21 0-.42-.02-.63.96-.69 1.8-1.56 2.46-2.55z"/>
                            </svg>
                          </span>
                        </div>
                        <p className="text-sm text-gray-500">@taylorwu_dev</p>
                      </div>
                    </div>
                    <p className="text-gray-300 leading-relaxed">
                      Repo Pilot helped me contribute to my favorite projects! The analysis saves hours of browsing through issues. 10/10 would recommend 👏
                    </p>
                    <div className="mt-4 text-sm text-gray-500">
                      <span>via Twitter</span>
                    </div>
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
