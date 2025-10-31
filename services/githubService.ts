import type { LanguageUsage, Contributor } from "../types";

const GITHUB_API_BASE = "https://api.github.com";

interface RepoUrlParts {
  owner: string;
  repo: string;
}

/**
 * Parses a GitHub repository URL to extract the owner and repository name.
 * @param url - The full GitHub URL (e.g., https://github.com/facebook/react).
 * @returns An object containing the owner and repo.
 * @throws Will throw an error if the URL is not a valid GitHub repository URL.
 */
export function parseRepoUrl(url: string): RepoUrlParts {
  try {
    const urlObj = new URL(url);
    if (urlObj.hostname !== "github.com") {
      throw new Error("Not a GitHub URL");
    }
    const pathParts = urlObj.pathname.split("/").filter(Boolean);
    if (pathParts.length < 2) {
      throw new Error("Invalid GitHub repository URL path");
    }
    const [owner, repo] = pathParts;
    return { owner, repo: repo.replace(".git", "") };
  } catch (error) {
    console.error("Invalid URL:", url, error);
    throw new Error(
      "Invalid GitHub repository URL. Please use a format like https://github.com/owner/repo"
    );
  }
}

/**
 * Helper function to make requests to the GitHub API.
 * Handles basic error cases like 404 and rate limiting.
 * @param endpoint - The API endpoint to fetch (e.g., /repos/owner/repo).
 * @returns The JSON response from the API, or null if a 404 occurs.
 */
async function githubApiFetch(endpoint: string) {
  const response = await fetch(`${GITHUB_API_BASE}${endpoint}`, {
    headers: {
      Accept: "application/vnd.github.v3+json",
    },
  });
  if (!response.ok) {
    if (response.status === 404) {
      return null; // Don't throw for 404s, just return null for optional files
    }
    if (response.status === 403) {
      const rateLimitReset = response.headers.get("x-ratelimit-reset");
      const resetDate = rateLimitReset
        ? new Date(parseInt(rateLimitReset, 10) * 1000).toLocaleTimeString()
        : "later";
      throw new Error(
        `GitHub API rate limit exceeded. Please try again after ${resetDate}.`
      );
    }
    throw new Error(
      `GitHub API request failed for ${endpoint}: ${response.statusText}`
    );
  }
  return response.json();
}

/**
 * Fetches the content of a file from a repository.
 * @param owner - The repository owner.
 * @param repo - The repository name.
 * @param path - The path to the file.
 * @returns The decoded file content as a string.
 */
async function getContent(
  owner: string,
  repo: string,
  path: string
): Promise<string> {
  const data = await githubApiFetch(`/repos/${owner}/${repo}/contents/${path}`);
  if (data && data.content) {
    // Content is base64 encoded
    return atob(data.content);
  }
  return "";
}

/**
 * Fetches and aggregates all necessary data for a given GitHub repository.
 * @param repoUrl - The URL of the repository to analyze.
 * @returns A promise that resolves to an object containing aggregated repo data.
 */
export async function getRepoData(repoUrl: string) {
  const { owner, repo } = parseRepoUrl(repoUrl);
  const repoName = `${owner}/${repo}`;

  // Use Promise.all to fetch core data in parallel
  const [repoDetails, languages, contributors, issues] = await Promise.all([
    githubApiFetch(`/repos/${owner}/${repo}`),
    githubApiFetch(`/repos/${owner}/${repo}/languages`),
    githubApiFetch(`/repos/${owner}/${repo}/contributors?per_page=10`),
    githubApiFetch(`/repos/${owner}/${repo}/issues?state=open&per_page=100`),
  ]);

  if (!repoDetails) {
    throw new Error(`Repository ${repoName} not found or is private.`);
  }

  // Fetch content files separately as they might not exist and we don't want to fail the whole batch
  const [readmeMd, contributingMd] = await Promise.all([
    getContent(owner, repo, "README.md").catch(() => ""),
    getContent(owner, repo, "CONTRIBUTING.md").catch(() => ""),
  ]);

  // Process Languages to get percentages
  const totalBytes = Object.values(languages || {}).reduce(
    (acc: number, val: unknown) => acc + (typeof val === "number" ? val : 0),
    0
  );
  const languagesUsed: LanguageUsage[] =
    totalBytes > 0
      ? Object.entries(languages)
          .map(([name, bytes]) => ({
            name,
            percentage: parseFloat(
              (((bytes as number) / totalBytes) * 100).toFixed(1)
            ),
          }))
          .sort((a, b) => b.percentage - a.percentage)
      : [];

  const topContributors: Contributor[] = (contributors || []).map((c: any) => ({
    login: c.login,
    avatar_url: c.avatar_url,
    html_url: c.html_url,
  }));

  // To get an accurate total contributor count without fetching all pages,
  // we can make a small request and inspect the 'Link' header for the last page number.
  const contributorsCountResponse = await fetch(
    `${GITHUB_API_BASE}/repos/${owner}/${repo}/contributors?per_page=1&anon=1`
  );
  let totalContributors = 0;
  const linkHeader = contributorsCountResponse.headers.get("link");
  if (linkHeader) {
    const lastPageMatch = linkHeader.match(/<.*?page=(\d+)>; rel="last"/);
    if (lastPageMatch) {
      totalContributors = parseInt(lastPageMatch[1], 10);
    } else if (contributors) {
      totalContributors = contributors.length; // Only one page
    }
  } else if (contributors) {
    totalContributors = contributors.length; // No link header, must be one page
  }

  // Filter out pull requests from issues (PRs have a pull_request property)
  const filteredIssues = (issues || []).filter(
    (issue: any) => !issue.pull_request
  );

  console.log(filteredIssues.length, "open issues fetched");
  console.log(repoDetails, "repo details");

  return {
    repoName: repoDetails.full_name,
    description: repoDetails.description,
    stars: repoDetails.stargazers_count,
    forks: repoDetails.forks_count,
    totalOpenIssues: filteredIssues.length,
    languagesUsed,
    topContributors,
    totalContributors:
      totalContributors > 0 ? totalContributors : (contributors || []).length,
    readmeMd,
    contributingMd,
    issues: filteredIssues,
  };
}
