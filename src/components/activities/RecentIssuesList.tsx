import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Issue } from "@/types/gitlab";
import { VirtualizedList } from "@/components/ui/virtualized-list";

interface RecentIssuesListProps {
  issues: Issue[];
}

export function RecentIssuesList({ issues }: RecentIssuesListProps) {
  const renderIssue = (issue: Issue) => (
    <div className="flex items-center justify-between border-b pb-4 last:border-0">
      <div className="space-y-1">
        <p className="text-sm font-medium leading-none">
          {issue.title}
        </p>
        <p className="text-sm text-muted-foreground">
          {issue.author} - {issue.assignee ? `Assigné à ${issue.assignee}` : "Non assigné"}
        </p>
        <p className="text-xs text-muted-foreground">
          {new Date(issue.createdAt).toLocaleString()}
        </p>
      </div>
      <div className="flex items-center gap-2">
        <Badge
          variant={
            issue.state === "closed"
              ? "success"
              : issue.priority === "high"
              ? "error"
              : issue.priority === "medium"
              ? "warning"
              : "info"
          }
        >
          {issue.state}
        </Badge>
        <Badge variant="secondary">
          {issue.labels.join(", ")}
        </Badge>
        <Badge variant="outline">
          {issue.comments} 💬
        </Badge>
      </div>
    </div>
  );

  return (
    <Card>
      <CardHeader>
        <CardTitle>Issues Récents</CardTitle>
      </CardHeader>
      <CardContent>
        <VirtualizedList
          items={issues}
          height={400}
          itemHeight={120}
          renderItem={renderIssue}
          className="space-y-4"
        />
      </CardContent>
    </Card>
  );
} 