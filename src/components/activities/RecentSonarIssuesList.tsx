import { SonarIssue } from "@/types/mocks";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { formatDistanceToNow } from "date-fns";
import { fr } from "date-fns/locale";

interface RecentSonarIssuesListProps {
  issues: SonarIssue[];
}

export function RecentSonarIssuesList({ issues }: RecentSonarIssuesListProps) {
  const handleResolve = (issue: SonarIssue) => {
    toast(`Issue résolue\nIssue #${issue.id} - ${issue.message}`);
  };

  const getTypeColor = (type: SonarIssue["type"]) => {
    switch (type) {
      case "bug":
        return "bg-red-500";
      case "vulnerability":
        return "bg-orange-500";
      case "code_smell":
        return "bg-yellow-500";
      default:
        return "bg-gray-500";
    }
  };

  const getSeverityColor = (severity: SonarIssue["severity"]) => {
    switch (severity) {
      case "blocker":
        return "bg-red-700";
      case "critical":
        return "bg-red-500";
      case "major":
        return "bg-orange-500";
      case "minor":
        return "bg-yellow-500";
      default:
        return "bg-gray-500";
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Issues récentes</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {issues.map((issue) => (
            <div
              key={issue.id}
              className="flex items-center justify-between p-4 border rounded-lg"
            >
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="font-medium">{issue.message}</span>
                  <Badge
                    className={getTypeColor(issue.type)}
                    variant="secondary"
                  >
                    {issue.type}
                  </Badge>
                  <Badge
                    className={getSeverityColor(issue.severity)}
                    variant="secondary"
                  >
                    {issue.severity}
                  </Badge>
                  <Badge
                    className={issue.status === "open" ? "bg-red-500" : "bg-green-500"}
                    variant="secondary"
                  >
                    {issue.status}
                  </Badge>
                </div>
                <div className="text-sm text-muted-foreground">
                  <span>Fichier: {issue.component}</span>
                  <span className="mx-2">•</span>
                  <span>Ligne: {issue.line}</span>
                </div>
                <div className="text-sm text-muted-foreground">
                  <span>
                    {issue.date && !isNaN(new Date(issue.date).getTime())
                      ? formatDistanceToNow(new Date(issue.date), {
                          addSuffix: true,
                          locale: fr,
                        })
                      : "Date inconnue"}
                  </span>
                </div>
              </div>
              <div className="flex gap-2">
                {issue.status === "open" && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleResolve(issue)}
                  >
                    Résoudre
                  </Button>
                )}
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleResolve(issue)}
                >
                  Voir détails
                </Button>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
} 