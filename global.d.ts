// TypeScript declarations for global types

interface Window {
  gtag?: (
    command: 'event' | 'config' | 'js',
    targetId: string,
    config?: {
      event_category?: string;
      event_label?: string;
      repo_url?: string;
      repo_name?: string;
      [key: string]: any;
    }
  ) => void;
}
