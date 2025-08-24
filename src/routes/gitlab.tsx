import { createFileRoute } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { Link } from "@tanstack/react-router";
import { GitLabWidget } from "@/components/dashboard/widgets/GitLabWidget";
import { RecentCommitsList } from "@/components/activities/RecentCommitsList";
import { RecentMRsList } from "@/components/activities/RecentMRsList";
import { RecentIssuesList } from "@/components/activities/RecentIssuesList";
import { RecentPipelinesList } from "@/components/activities/RecentPipelinesList";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { mockGitlabData } from "@/mocks/gitlab";
import { GitlabProject } from "@/types/gitlab";
import { GitLabGraph } from "@/components/dashboard/widgets/GitLabGraph";

export const Route = createFileRoute("/gitlab")({
  component: GitlabPage,
});

export function GitlabPage() {
  // Agrégation des données mockées (simule l'API)
  const allCommits = mockGitlabData.flatMap(project => 
    (project.recentCommits || []).map(commit => ({
      ...commit,
      id: `${project.id}-${commit.id}` // Ajout d'un préfixe unique basé sur l'ID du projet
    }))
  );
  const allMRs = mockGitlabData.flatMap(p => p.recentMRs || []);
  const allIssues = mockGitlabData.flatMap(p => p.recentIssues || []);
  const allPipelines = mockGitlabData.flatMap(p => p.recentPipelines || []);

  return (
    <div className="container mx-auto p-6 space-y-6">
      <h1 className="text-3xl font-bold">GitLab</h1>
      <GitLabGraph />
      <div className="grid gap-6">
        <RecentCommitsList commits={allCommits as any} />
        <RecentMRsList mrs={allMRs as any} />
        <RecentIssuesList issues={allIssues as any} />
        <RecentPipelinesList pipelines={allPipelines as any} />
      </div>
    </div>
  );
} 