import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Commit } from "@/types/github";

interface RecentCommitsListProps {
  commits?: Commit[];
}

export function RecentCommitsList({ commits = [] }: RecentCommitsListProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Commits Récents</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {commits.map((commit) => (
            <div
              key={commit.id}
              className="flex items-center justify-between space-x-4 rounded-lg border p-4"
            >
              <div className="space-y-1">
                <p className="text-sm font-medium leading-none">
                  {commit.message}
                </p>
                <p className="text-sm text-muted-foreground">
                  {commit.author} • {new Date(commit.date).toLocaleString()}
                </p>
                <div className="flex items-center space-x-2">
                  <Badge variant="outline">{commit.branch}</Badge>
                  <Badge
                    variant={
                      commit.status === "success"
                        ? "secondary"
                        : commit.status === "failed"
                        ? "destructive"
                        : "outline"
                    }
                  >
                    {commit.status}
                  </Badge>
                </div>
              </div>
              <div className="text-sm text-muted-foreground">
                <div>+{commit.details?.additions ?? 0}</div>
                <div>-{commit.details?.deletions ?? 0}</div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
} 