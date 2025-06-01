import { createFileRoute } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { Link } from "@tanstack/react-router";
import { GithubWidget } from "@/components/dashboard/GithubWidget";
import { RecentCommitsList } from "@/components/activities/RecentCommitsList";
import { RecentPRsList } from "@/components/activities/RecentPRsList";
import { RecentIssuesList } from "@/components/activities/RecentIssuesList";
import { CommitSearchBar } from "@/components/activities/CommitSearchBar";
import { mockGithubData } from "@/mocks/github";
import { useState } from "react";

export const Route = createFileRoute("/github")({
  component: GithubPage,
});

export function GithubPage() {
  const repo = mockGithubData[0]; // On utilise le premier repo pour l'exemple
  const [filteredCommits, setFilteredCommits] = useState(repo.recentCommits);

  return (
    <div className="container mx-auto p-6 space-y-6">
      <h1 className="text-3xl font-bold">GitHub</h1>
      <GithubWidget />
      <CommitSearchBar commits={repo.recentCommits} onFilter={setFilteredCommits} />
      <div className="grid gap-6">
        <RecentCommitsList commits={filteredCommits} />
        <RecentPRsList prs={repo.recentPRs} />
        <RecentIssuesList issues={repo.recentIssues} />
      </div>
    </div>
  );
} 