import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { PullRequest } from "@/types/github";

interface RecentPRsListProps {
  prs?: PullRequest[];
}

export function RecentPRsList({ prs = [] }: RecentPRsListProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Pull Requests Récents</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {prs.map((pr) => (
            <div
              key={pr.id}
              className="flex items-center justify-between space-x-4 rounded-lg border p-4"
            >
              <div className="space-y-1">
                <p className="text-sm font-medium leading-none">{pr.title}</p>
                <p className="text-sm text-muted-foreground">
                  {pr.author} • {new Date(pr.createdAt).toLocaleString()}
                </p>
                <div className="flex items-center space-x-2">
                  <Badge
                    variant={
                      pr.status === "open"
                        ? "default"
                        : pr.status === "merged"
                        ? "secondary"
                        : "destructive"
                    }
                  >
                    {pr.status}
                  </Badge>
                  <Badge variant="outline">
                    {pr.reviewers.length} reviewers
                  </Badge>
                  <Badge variant="outline">{pr.comments} commentaires</Badge>
                </div>
              </div>
              <div className="text-sm text-muted-foreground">
                <div>+{pr.details?.changes?.additions ?? 0}</div>
                <div>-{pr.details?.changes?.deletions ?? 0}</div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
} 