import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Info } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { ChartData } from "@/types/dashboard";

interface WidgetDetailsProps {
  data: ChartData[];
  title: string;
  loading?: boolean;
  type: "github" | "gitlab" | "jenkins" | "jira" | "sonarqube";
}

export function WidgetDetails({ data, title, loading, type }: WidgetDetailsProps) {
  if (loading) {
    return (
      <div className="animate-pulse space-y-4">
        <div className="h-4 bg-muted rounded w-1/4" />
        <div className="space-y-2">
          <div className="h-4 bg-muted rounded" />
          <div className="h-4 bg-muted rounded w-5/6" />
        </div>
      </div>
    );
  }

  if (!data || !Array.isArray(data) || data.length === 0) {
    return (
      <div className="text-center text-muted-foreground py-4">
        Aucune donnée disponible
      </div>
    );
  }

  const getVal = (item: ChartData) => item.value;
  const stats = {
    total: data.reduce((sum, item) => sum + getVal(item), 0),
    average: Math.round(data.reduce((sum, item) => sum + getVal(item), 0) / data.length),
    max: Math.max(...data.map(getVal)),
    min: Math.min(...data.map(getVal)),
  };

  const safeStat = (val: number) => (typeof val === "number" && !isNaN(val) && isFinite(val) ? val : "—");

  const renderStats = () => (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{safeStat(stats.total)}</div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Moyenne</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{safeStat(stats.average)}</div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Maximum</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{safeStat(stats.max)}</div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Minimum</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{safeStat(stats.min)}</div>
        </CardContent>
      </Card>
    </div>
  );

  const renderDetails = () => {
    switch (type) {
      case "github":
        return (
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <h3 className="font-medium">Détails des commits</h3>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger>
                    <Info className="h-4 w-4 text-muted-foreground" />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Statistiques détaillées des commits GitHub</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
            <div className="grid gap-4">
              {data.map((item, index) => (
                <Card key={index}>
                  <CardContent className="p-4">
                    <div className="flex justify-between items-center">
                      <span className="font-medium">{item.name}</span>
                      <span className="text-2xl font-bold">{item.value}</span>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        );

      case "gitlab":
        return (
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <h3 className="font-medium">Activité GitLab</h3>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger>
                    <Info className="h-4 w-4 text-muted-foreground" />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Statistiques des merge requests et pipelines GitLab</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
            <div className="grid gap-4">
              {data.map((item, index) => (
                <Card key={index}>
                  <CardContent className="p-4">
                    <div className="flex justify-between items-center">
                      <span className="font-medium">{item.name}</span>
                      <span className="text-2xl font-bold">{item.value}</span>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        );

      case "jenkins":
        return (
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <h3 className="font-medium">Statistiques Jenkins</h3>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger>
                    <Info className="h-4 w-4 text-muted-foreground" />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Statistiques des builds et tests Jenkins</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
            <div className="grid gap-4">
              {data.map((item, index) => (
                <Card key={index}>
                  <CardContent className="p-4">
                    <div className="flex justify-between items-center">
                      <span className="font-medium">{item.name}</span>
                      <span className="text-2xl font-bold">{item.value}</span>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        );

      case "jira":
        return (
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <h3 className="font-medium">Statistiques Jira</h3>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger>
                    <Info className="h-4 w-4 text-muted-foreground" />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Statistiques des tickets et sprints Jira</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
            <div className="grid gap-4">
              {data.map((item, index) => (
                <Card key={index}>
                  <CardContent className="p-4">
                    <div className="flex justify-between items-center">
                      <span className="font-medium">{item.name}</span>
                      <span className="text-2xl font-bold">{item.value}</span>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        );

      case "sonarqube":
        return (
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <h3 className="font-medium">Statistiques SonarQube</h3>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger>
                    <Info className="h-4 w-4 text-muted-foreground" />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Statistiques de qualité du code SonarQube</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
            <div className="grid gap-4">
              {data.map((item, index) => (
                <Card key={index}>
                  <CardContent className="p-4">
                    <div className="flex justify-between items-center">
                      <span className="font-medium">{item.name}</span>
                      <span className="text-2xl font-bold">{item.value}</span>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      <Tabs defaultValue="stats" className="w-full">
        <TabsList>
          <TabsTrigger value="stats">Statistiques</TabsTrigger>
          <TabsTrigger value="details">Détails</TabsTrigger>
        </TabsList>
        <TabsContent value="stats" className="mt-4">
          {renderStats()}
        </TabsContent>
        <TabsContent value="details" className="mt-4">
          {renderDetails()}
        </TabsContent>
      </Tabs>
    </div>
  );
} 