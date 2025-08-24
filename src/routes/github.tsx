import { createFileRoute } from "@tanstack/react-router";
import { GitHubGraph } from "@/components/dashboard/widgets/GitHubWidget";
import { RecentCommitsList } from "@/components/activities/RecentCommitsList";
import { RecentPRsList } from "@/components/activities/RecentPRsList";
import { RecentIssuesList } from "@/components/activities/RecentIssuesList";
import { CommitSearchBar } from "@/components/activities/CommitSearchBar";
import { mockGithubCommits, mockGithubPRs, mockGithubIssues } from "@/mocks/common";
import { useState } from "react";

export const Route = createFileRoute("/github")({
  component: GithubPage,
});

export function GithubPage() {
  // Agrégation des données mockées (simule l'API)
  const allCommits = mockGithubCommits;
  const allPRs = mockGithubPRs;
  const allIssues = mockGithubIssues;
  const [filteredCommits, setFilteredCommits] = useState(allCommits);

  return (
    <div className="container mx-auto p-6 space-y-6">
      <h1 className="text-3xl font-bold">GitHub</h1>
      <GitHubGraph />
      <CommitSearchBar commits={allCommits as any} onFilter={setFilteredCommits as any} />
      <div className="grid gap-6">
        <RecentCommitsList commits={filteredCommits as any} />
        <RecentPRsList prs={allPRs as any} />
        <RecentIssuesList issues={allIssues as any} />
      </div>
    </div>
  );
} 