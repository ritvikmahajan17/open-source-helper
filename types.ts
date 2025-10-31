export interface Suggestion {
  title: string;
  description: string;
  complexity: 'Easy' | 'Medium' | 'Hard';
  tags: string[];
  issueUrl?: string;
}

export interface LanguageUsage {
  name: string;
  percentage: number;
}

export interface Contributor {
    login: string;
    avatar_url: string;
    html_url: string;
}

export interface RepoAnalysis {
  repoName: string;
  description: string;
  stars: number;
  forks: number;
  totalOpenIssues: number;
  totalContributors: number;
  languagesUsed: LanguageUsage[];
  topContributors: Contributor[];
  contributionGuidelines: string[];
  lowHangingFruit: Suggestion[]; // This name is kept for consistency with the service
  easySuggestions: Suggestion[];
  mediumSuggestions: Suggestion[];
  hardSuggestions: Suggestion[];
}

export interface SuggestionDetails {
  howToStart: string[];
  filesToEdit: string[];
  skillsNeeded: string[];
  estimatedHours: number;
  sources?: Array<{
    uri: string;
    title: string;
  }>;
}
