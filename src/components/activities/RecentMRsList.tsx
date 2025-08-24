import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { MergeRequest } from "@/types/gitlab"
import { VirtualizedList } from "@/components/ui/virtualized-list"

interface RecentMRsListProps {
  mrs: MergeRequest[]
}

export function RecentMRsList({ mrs }: RecentMRsListProps) {
  const renderMR = (mr: MergeRequest) => (
    <div className="flex items-center justify-between border-b pb-4 last:border-0">
      <div className="space-y-1">
        <p className="text-sm font-medium leading-none">
          {mr.title}
        </p>
        <p className="text-sm text-muted-foreground">
          {mr.author}
        </p>
        <p className="text-xs text-muted-foreground">
          {new Date(mr.createdAt).toLocaleString()}
        </p>
      </div>
      <div className="flex items-center gap-2">
        <Badge
          variant={
            mr.status === "merged"
              ? "secondary"
              : mr.status === "closed"
              ? "destructive"
              : "default"
          }
        >
          {mr.status}
        </Badge>
        <Badge variant="outline">
          {mr.reviewers.length} reviewers
        </Badge>
        <Badge variant="outline">
          {mr.comments} 💬
        </Badge>
      </div>
    </div>
  );

  return (
    <Card>
      <CardHeader>
        <CardTitle>Merge Requests Récents</CardTitle>
      </CardHeader>
      <CardContent>
        <VirtualizedList
          items={mrs}
          height={400}
          itemHeight={120}
          renderItem={renderMR}
          className="space-y-4"
        />
      </CardContent>
    </Card>
  );
} 