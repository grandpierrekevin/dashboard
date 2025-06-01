import { JenkinsBuild } from "@/types/mocks";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { formatDistanceToNow } from "date-fns";
import { fr } from "date-fns/locale";

interface RecentBuildsListProps {
  builds: JenkinsBuild[];
}

export function RecentBuildsList({ builds }: RecentBuildsListProps) {
  const handleRetry = (build: JenkinsBuild) => {
    if (build.canRetry) {
      toast(`Build relancé\nBuild #${build.id} - ${build.name}`);
    }
  };

  const handleViewConsole = (build: JenkinsBuild) => {
    if (build.consoleUrl) {
      toast(`Console ouverte\nBuild #${build.id} - ${build.name}`);
    }
  };

  const getStatusColor = (status: JenkinsBuild["status"]) => {
    switch (status) {
      case "success":
        return "bg-green-500";
      case "failed":
        return "bg-red-500";
      case "running":
        return "bg-blue-500";
      default:
        return "bg-gray-500";
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Builds récents</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {builds.map((build) => (
            <div
              key={build.id}
              className="flex items-center justify-between p-4 border rounded-lg"
            >
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="font-medium">{build.name}</span>
                  <Badge
                    className={getStatusColor(build.status)}
                    variant="secondary"
                  >
                    {build.status}
                  </Badge>
                </div>
                <div className="text-sm text-muted-foreground">
                  <span>Job: {build.job}</span>
                  <span className="mx-2">•</span>
                  <span>
                    {build.date && !isNaN(new Date(build.date).getTime())
                      ? formatDistanceToNow(new Date(build.date), {
                          addSuffix: true,
                          locale: fr,
                        })
                      : "Date inconnue"}
                  </span>
                </div>
                <div className="text-sm text-muted-foreground">
                  <span>Branch: {build.branch}</span>
                  <span className="mx-2">•</span>
                  <span>Durée: {build.duration}s</span>
                </div>
              </div>
              <div className="flex gap-2">
                {build.canRetry && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleRetry(build)}
                  >
                    Relancer
                  </Button>
                )}
                {build.consoleUrl && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleViewConsole(build)}
                  >
                    Voir console
                  </Button>
                )}
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleViewConsole(build)}
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