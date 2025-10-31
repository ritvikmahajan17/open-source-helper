import { GoogleGenAI, Type } from "@google/genai";
import { getRepoData, parseRepoUrl } from "./githubService";
import type { RepoAnalysis, Suggestion, SuggestionDetails } from "../types";

// Per guidelines, API key is from environment variables
// Fix: Use the correct Gemini API initialization.
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const analysisSchema = {
  type: Type.OBJECT,
  properties: {
    contributionGuidelines: {
      type: Type.ARRAY,
      description:
        "A bulleted list summarizing the key steps to contribute, based on the CONTRIBUTING.md and general best practices. For example: 'Fork the repository', 'Create a new branch (git checkout -b feature/AmazingFeature)', 'Commit your changes', 'Push to the branch', 'Open a Pull Request'.",
      items: { type: Type.STRING },
    },
    lowHangingFruit: {
      type: Type.ARRAY,
      description:
        "A list of 3-5 specific, actionable contribution ideas suitable for new contributors. These should be a mix of 'good first issue' style tasks, documentation improvements, and simple code fixes. Do not just list existing issues; generate new, creative ideas based on the repo's purpose.",
      items: {
        type: Type.OBJECT,
        properties: {
          title: {
            type: Type.STRING,
            description:
              "A short, descriptive title for the contribution idea.",
          },
          description: {
            type: Type.STRING,
            description:
              "A detailed but concise explanation of the task, why it's needed, and what the outcome should be. Should be around 2-3 sentences.",
          },
          complexity: {
            type: Type.STRING,
            description: "Estimated complexity: 'Easy', 'Medium', or 'Hard'.",
          },
          tags: {
            type: Type.ARRAY,
            items: { type: Type.STRING },
            description:
              "A list of relevant tags, like 'Documentation', 'Bug Fix', 'UI', 'Refactor', or a primary programming language.",
          },
        },
        required: ["title", "description", "complexity", "tags"],
      },
    },
  },
  required: ["contributionGuidelines", "lowHangingFruit"],
};

const issueCategorizationSchema = {
  type: Type.OBJECT,
  properties: {
    easy: {
      type: Type.ARRAY,
      description: "Top 3-5 easy issues suitable for beginners",
      items: {
        type: Type.OBJECT,
        properties: {
          title: { type: Type.STRING },
          description: { type: Type.STRING },
          complexity: { type: Type.STRING },
          tags: {
            type: Type.ARRAY,
            items: { type: Type.STRING },
          },
          issueUrl: { type: Type.STRING },
        },
        required: ["title", "description", "complexity", "tags", "issueUrl"],
      },
    },
    medium: {
      type: Type.ARRAY,
      description: "Top 3-5 medium difficulty issues",
      items: {
        type: Type.OBJECT,
        properties: {
          title: { type: Type.STRING },
          description: { type: Type.STRING },
          complexity: { type: Type.STRING },
          tags: {
            type: Type.ARRAY,
            items: { type: Type.STRING },
          },
          issueUrl: { type: Type.STRING },
        },
        required: ["title", "description", "complexity", "tags", "issueUrl"],
      },
    },
    hard: {
      type: Type.ARRAY,
      description: "Top 3-5 hard/challenging issues",
      items: {
        type: Type.OBJECT,
        properties: {
          title: { type: Type.STRING },
          description: { type: Type.STRING },
          complexity: { type: Type.STRING },
          tags: {
            type: Type.ARRAY,
            items: { type: Type.STRING },
          },
          issueUrl: { type: Type.STRING },
        },
        required: ["title", "description", "complexity", "tags", "issueUrl"],
      },
    },
  },
  required: ["easy", "medium", "hard"],
};

export async function analyzeRepo(repoUrl: string): Promise<RepoAnalysis> {
  // 1. Fetch data from GitHub
  const githubData = await getRepoData(repoUrl);

  // 2. Prepare prompts for both Gemini API calls
  const repoAnalysisPrompt = `
    Analyze the following GitHub repository to identify contribution opportunities for a new open-source contributor.

    **Repository:** ${githubData.repoName}
    **Description:** ${githubData.description}
    **Languages:** ${githubData.languagesUsed.map((l) => l.name).join(", ")}

    **README.md Summary:**
    ${githubData.readmeMd.substring(0, 2000)}...

    **CONTRIBUTING.md Summary:**
    ${
      githubData.contributingMd
        ? githubData.contributingMd.substring(0, 2000) + "..."
        : "Not provided."
    }

    **Recent Open Issues (for context, do not just copy them):**
    ${githubData.issues
      .slice(0, 10)
      .map((i: any) => `- ${i.title}`)
      .join("\n")}
    
    Based on this information, provide a structured analysis in JSON format.
    The analysis should include:
    1.  **contributionGuidelines**: A simplified, step-by-step summary of how to contribute. If no CONTRIBUTING.md is present, generate standard steps (fork, branch, commit, PR).
    2.  **lowHangingFruit**: A list of 3-5 specific, actionable "good first issues" or "low-hanging fruit" contribution ideas. These should be creative and based on the repository's purpose, not just re-stating existing issues. For example, suggest improving documentation, adding a specific test case, or refactoring a small piece of code.
  `;

  const issueCategorizationPrompt =
    githubData.issues.length > 0
      ? `
      Analyze the following GitHub issues and categorize them by complexity level.
      
      **Repository:** ${githubData.repoName}
      **Languages:** ${githubData.languagesUsed.map((l) => l.name).join(", ")}
      
      **Open Issues:**
      ${githubData.issues
        .map(
          (issue: any, idx: number) =>
            `${idx + 1}. Title: ${issue.title}
         URL: ${issue.html_url}
         Body: ${issue.body?.substring(0, 300) || "No description"}`
        )
        .join("\n\n")}
      
      Categorize these issues into Easy, Medium, and Hard difficulty levels based on:
      - Easy: Simple bug fixes, documentation updates, UI tweaks, adding tests for existing features
      - Medium: Feature additions, refactoring, moderate complexity bugs, API changes
      - Hard: Architecture changes, complex algorithms, major refactors, security issues
      
      Return the top 3-5 issues from EACH category if available. If a category has no issues, return an empty array for that category.
      For each issue, provide:
      - title: The original issue title
      - description: A brief summary (2-3 sentences max) of what needs to be done
      - complexity: 'Easy', 'Medium', or 'Hard'
      - tags: Relevant tags like ['Bug', 'Documentation', 'Feature', 'UI', 'Backend', etc.]
      - issueUrl: The original GitHub issue URL
    `
      : null;

  // 3. Call both Gemini APIs in parallel using Promise.all
  const model = "gemini-2.5-flash";

  const geminiCalls = [
    ai.models.generateContent({
      model: model,
      contents: repoAnalysisPrompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: analysisSchema,
      },
    }),
  ];

  // Only add issue categorization call if there are issues
  if (issueCategorizationPrompt) {
    geminiCalls.push(
      ai.models.generateContent({
        model: model,
        contents: issueCategorizationPrompt,
        config: {
          responseMimeType: "application/json",
          responseSchema: issueCategorizationSchema,
        },
      })
    );
  }

  const responses = await Promise.all(geminiCalls);

  // 4. Parse the responses
  const analysisJson = JSON.parse(responses[0].text);

  // Separate categorized issues by complexity
  let easyIssues: Suggestion[] = [];
  let mediumIssues: Suggestion[] = [];
  let hardIssues: Suggestion[] = [];

  if (responses.length > 1) {
    const categorizedJson = JSON.parse(responses[1].text);
    easyIssues = categorizedJson.easy || [];
    mediumIssues = categorizedJson.medium || [];
    hardIssues = categorizedJson.hard || [];

    console.log("Categorized issues:", {
      easy: easyIssues.length,
      medium: mediumIssues.length,
      hard: hardIssues.length,
    });
  }

  // Add AI-generated low hanging fruit to easy category
  const aiGeneratedSuggestions = analysisJson.lowHangingFruit || [];

  // Combine with AI suggestions (deduplicate by title)
  const addedTitles = new Set(easyIssues.map((s) => s.title));
  for (const suggestion of aiGeneratedSuggestions) {
    if (!addedTitles.has(suggestion.title)) {
      if (suggestion.complexity === "Easy") {
        easyIssues.push(suggestion);
      } else if (suggestion.complexity === "Medium") {
        mediumIssues.push(suggestion);
      } else if (suggestion.complexity === "Hard") {
        hardIssues.push(suggestion);
      }
      addedTitles.add(suggestion.title);
    }
  }

  // For backward compatibility, create a combined list for lowHangingFruit
  const finalSuggestions: Suggestion[] = [
    ...easyIssues.slice(0, 2),
    ...mediumIssues.slice(0, 2),
    ...hardIssues.slice(0, 2),
  ];

  return {
    ...githubData,
    contributionGuidelines: analysisJson.contributionGuidelines,
    lowHangingFruit: finalSuggestions,
    easySuggestions: easyIssues,
    mediumSuggestions: mediumIssues,
    hardSuggestions: hardIssues,
  };
}

export async function getSuggestionDetails(
  suggestion: Suggestion,
  repoUrl: string
): Promise<SuggestionDetails> {
  const { owner, repo } = parseRepoUrl(repoUrl);
  const repoName = `${owner}/${repo}`;

  const prompt = `
        Provide a detailed guide for a new contributor to tackle the following task for the GitHub repository '${repoName}'.

        **Task Title:** ${suggestion.title}
        **Task Description:** ${suggestion.description}
        **Repository:** ${repoName}

        Your response MUST be a single JSON object, and nothing else. Do not wrap it in markdown backticks or add any explanatory text before or after it. The JSON object should contain these exact keys: "howToStart", "filesToEdit", "skillsNeeded", "estimatedHours".

        - "howToStart": A list of 2-4 concrete, actionable steps to begin working on this task.
        - "filesToEdit": A list of 1-3 likely file paths that will need to be modified. Be specific.
        - "skillsNeeded": A list of 2-4 essential skills or technologies required.
        - "estimatedHours": A rough estimate of hours this task might take a junior developer.
    `;

  const model = "gemini-2.5-flash";

  // Fix: Correctly use googleSearch grounding without responseMimeType or responseSchema.
  const response = await ai.models.generateContent({
    model: model,
    contents: prompt,
    config: {
      tools: [{ googleSearch: {} }],
    },
  });

  // Fix: Extract JSON from the model's text response.
  const textResponse = response.text;
  const jsonMatch = textResponse.match(/\{[\s\S]*\}/);
  if (!jsonMatch) {
    throw new Error(
      "Failed to get valid JSON details from the AI. The response was not valid JSON."
    );
  }

  let detailsJson;
  try {
    detailsJson = JSON.parse(jsonMatch[0]);
  } catch (e) {
    console.error("Failed to parse JSON from AI response:", textResponse);
    throw new Error(
      "The AI returned a malformed JSON response for suggestion details."
    );
  }

  // Fix: Extract grounding metadata for sources.
  const groundingMetadata = response.candidates?.[0]?.groundingMetadata;
  const sources =
    groundingMetadata?.groundingChunks
      ?.map((chunk: any) => chunk.web)
      .filter(Boolean)
      .map((webChunk: any) => ({
        uri: webChunk.uri,
        title: webChunk.title,
      })) || [];

  const result: SuggestionDetails = {
    ...detailsJson,
    sources: sources.length > 0 ? sources : undefined,
  };

  return result;
}
