import React from "react";
import { Lightbulb } from "lucide-react";

interface DemoModeBannerProps {
  onAnalyzeOwn: () => void;
}

export const DemoModeBanner: React.FC<DemoModeBannerProps> = ({
  onAnalyzeOwn,
}) => {
  return (
    <div className="bg-gradient-to-r from-red-900/20 to-orange-900/20 border-t-4 border-red-500 p-4 rounded-lg mb-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="bg-red-500/20 p-2 rounded-full flex-shrink-0">
            <Lightbulb className="w-5 h-5 text-red-400" />
          </div>
          <div>
            <p className="font-semibold text-white">
              Demo Mode: Viewing Example Analysis
            </p>
            <p className="text-sm text-gray-300">
              This is a sample analysis to show you how Repo Pilot works
            </p>
          </div>
        </div>
        <button
          onClick={onAnalyzeOwn}
          className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg font-semibold transition whitespace-nowrap"
        >
          Analyze Your Own Repo
        </button>
      </div>
    </div>
  );
};
