import React from "react";
import { useNavigate } from "react-router-dom";
import { ResultsDashboard } from "../components/ResultsDashboard";
import { DemoModeBanner } from "../components/DemoModeBanner";
import type { RepoAnalysis } from "../types";

interface ResultsProps {
  analysis: RepoAnalysis | null;
  isDemoMode: boolean;
  onExitDemoMode: () => void;
}

export function Results({ analysis, isDemoMode, onExitDemoMode }: ResultsProps) {
  const navigate = useNavigate();

  if (!analysis) {
    navigate('/');
    return null;
  }

  const handleReset = () => {
    navigate('/');
  };

  return (
    <div>
      {isDemoMode && (
        <DemoModeBanner onAnalyzeOwn={onExitDemoMode} />
      )}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-bold">{analysis.repoName}</h2>
        <button
          onClick={handleReset}
          className="border border-white hover:bg-gray-800 text-white font-bold py-2 px-4 rounded-lg transition-colors"
        >
          Analyze Another Repo
        </button>
      </div>
      <ResultsDashboard analysis={analysis} />
    </div>
  );
}
