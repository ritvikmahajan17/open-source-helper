import type { RepoAnalysis } from '../types';

export const DEMO_ANALYSIS: RepoAnalysis = {
  repoName: 'axios/axios',
  description: 'Promise-based HTTP client for the browser and node.js',
  stars: 105234,
  forks: 10842,
  totalOpenIssues: 234,
  totalContributors: 558,
  languagesUsed: [
    { name: 'JavaScript', percentage: 94.2 },
    { name: 'TypeScript', percentage: 5.8 }
  ],
  topContributors: [
    {
      login: 'jasonsaayman',
      avatar_url: 'https://avatars.githubusercontent.com/u/4814473?v=4',
      html_url: 'https://github.com/jasonsaayman'
    },
    {
      login: 'mzabriskie',
      avatar_url: 'https://avatars.githubusercontent.com/u/199035?v=4',
      html_url: 'https://github.com/mzabriskie'
    },
    {
      login: 'nickuraltsev',
      avatar_url: 'https://avatars.githubusercontent.com/u/6316432?v=4',
      html_url: 'https://github.com/nickuraltsev'
    },
    {
      login: 'DigitalBrainJS',
      avatar_url: 'https://avatars.githubusercontent.com/u/12586868?v=4',
      html_url: 'https://github.com/DigitalBrainJS'
    },
    {
      login: 'chinesedfan',
      avatar_url: 'https://avatars.githubusercontent.com/u/1736154?v=4',
      html_url: 'https://github.com/chinesedfan'
    }
  ],
  contributionGuidelines: [
    'Fork the repository and create a feature branch from `main`',
    'Run `npm install` to install dependencies',
    'Make your changes and add tests in the `test/` directory',
    'Run `npm test` to ensure all tests pass',
    'Update documentation if you\'re adding new features',
    'Submit a pull request with a clear description of changes'
  ],
  easySuggestions: [
    {
      title: 'Improve TypeScript type definitions for error responses',
      description: 'Add more specific types for different error scenarios to improve developer experience when handling errors in TypeScript projects.',
      complexity: 'Easy',
      tags: ['typescript', 'types', 'documentation', 'good-first-issue']
    },
    {
      title: 'Add more examples to README for common use cases',
      description: 'Expand the README with practical examples showing request/response interceptors, cancellation tokens, and custom instance configuration.',
      complexity: 'Easy',
      tags: ['documentation', 'examples', 'good-first-issue']
    },
    {
      title: 'Fix typos and grammar in API documentation',
      description: 'Review and correct spelling mistakes and grammatical errors throughout the documentation files.',
      complexity: 'Easy',
      tags: ['documentation', 'good-first-issue']
    },
    {
      title: 'Update outdated dependencies in package.json',
      description: 'Several dev dependencies are outdated and could be safely updated to their latest versions for better security and performance.',
      complexity: 'Easy',
      tags: ['maintenance', 'dependencies']
    }
  ],
  mediumSuggestions: [
    {
      title: 'Add support for request retry with exponential backoff',
      description: 'Implement a configurable retry mechanism that automatically retries failed requests with exponential backoff strategy.',
      complexity: 'Medium',
      tags: ['enhancement', 'feature', 'reliability']
    },
    {
      title: 'Improve error handling for network timeouts',
      description: 'Enhance timeout error messages to distinguish between connection timeouts and response timeouts, providing clearer debugging information.',
      complexity: 'Medium',
      tags: ['error-handling', 'enhancement']
    },
    {
      title: 'Add progress tracking for file uploads',
      description: 'Implement progress event handlers for multipart form uploads to enable upload progress bars in applications.',
      complexity: 'Medium',
      tags: ['enhancement', 'feature', 'upload']
    },
    {
      title: 'Create migration guide for v0.x to v1.x users',
      description: 'Write comprehensive documentation to help users migrate from older versions, highlighting breaking changes and providing code examples.',
      complexity: 'Medium',
      tags: ['documentation', 'migration']
    }
  ],
  hardSuggestions: [
    {
      title: 'Implement HTTP/2 support for modern browsers',
      description: 'Add support for HTTP/2 protocol to improve performance with multiplexing and server push capabilities while maintaining backward compatibility.',
      complexity: 'Hard',
      tags: ['enhancement', 'performance', 'protocol']
    },
    {
      title: 'Refactor core adapter system for better extensibility',
      description: 'Redesign the adapter architecture to make it easier for developers to create custom adapters for different environments (e.g., React Native, Electron).',
      complexity: 'Hard',
      tags: ['refactoring', 'architecture', 'extensibility']
    },
    {
      title: 'Add comprehensive caching layer with cache invalidation',
      description: 'Implement a sophisticated caching system with configurable strategies (TTL, LRU) and smart cache invalidation based on HTTP headers.',
      complexity: 'Hard',
      tags: ['enhancement', 'performance', 'caching']
    }
  ],
  lowHangingFruit: []
};
