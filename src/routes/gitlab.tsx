import { createFileRoute } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { Link } from "@tanstack/react-router";
import { GitlabWidget } from "@/components/dashboard/GitlabWidget";
import { RecentPipelinesList } from "@/components/activities/RecentPipelinesList";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { mockGitlabData } from "@/mocks/gitlab";
import { GitlabProject } from "@/types/gitlab";
import { RecentCommitsList } from "@/components/gitlab/RecentCommitsList";
import { RecentMRsList } from "@/components/gitlab/RecentMRsList";
import { RecentIssuesList } from "@/components/gitlab/RecentIssuesList";

export const Route = createFileRoute("/gitlab")({
  component: GitlabPage,
});

export function GitlabPage() {
  const project = mockGitlabData[0];
  return (
    <div className="container mx-auto p-6 space-y-6">
      <h1 className="text-3xl font-bold">GitLab</h1>
      <GitlabWidget />
      <div className="grid gap-6">
        <RecentPipelinesList pipelines={project.recentPipelines} />
      </div>
      <Button asChild variant="outline">
        <Link to="/dashboard">Retour au dashboard</Link>
      </Button>
    </div>
  );
} 