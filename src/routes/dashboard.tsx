import { createFileRoute, Outlet } from "@tanstack/react-router";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { AlertCircle, AlertTriangle, Settings2, Info } from "lucide-react";
import { useIntegrations } from "@/context/IntegrationsContext";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { useDashboardData } from "@/hooks/useDashboardData";
import { useState, useEffect, lazy, Suspense } from "react";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { DashboardData, KPI } from "@/types/dashboard";
import { useKPIs } from "@/hooks/useKPIs";
import { RefreshCw } from "lucide-react";
import { cn } from "@/lib/utils";
import { KPICard } from "@/components/dashboard/KPICard";
import { AlertCard } from "@/components/dashboard/AlertCard";
import { mockNotifications } from "@/mocks/notifications";
import type { Notification } from "@/types/notifications";

// Lazy loading des widgets
const GithubWidget = lazy(() => import("@/components/dashboard/GithubWidget").then(module => ({ default: module.GithubWidget })));
const GitlabWidget = lazy(() => import("@/components/dashboard/GitlabWidget").then(module => ({ default: module.GitlabWidget })));
const JenkinsWidget = lazy(() => import("@/components/dashboard/JenkinsWidget").then(module => ({ default: module.JenkinsWidget })));
const JiraWidget = lazy(() => import("@/components/dashboard/JiraWidget").then(module => ({ default: module.JiraWidget })));
const SonarWidget = lazy(() => import("@/components/dashboard/SonarWidget").then(module => ({ default: module.SonarWidget })));

export const Route = createFileRoute("/dashboard")({
  component: DashboardPage,
});

type DashboardDataWithAlerts = { alerts?: any[] };

// Ajout d'alertes mockées techniques cohérentes avec le reste de l'appli
const technicalMockAlerts = [
  {
    title: "Jenkins : Build échoué",
    message: "Le build #124 a échoué sur la branche develop.",
    severity: "critical",
    timestamp: "2024-06-28T09:15:00Z"
  },
  {
    title: "SonarQube : Vulnérabilités détectées",
    message: "5 vulnérabilités critiques détectées sur backend-api.",
    severity: "warning",
    timestamp: "2024-06-28T08:00:00Z"
  },
  {
    title: "Jira : Nouveau ticket",
    message: "Un ticket 'Bug' a été créé suite à un échec Jenkins.",
    severity: "info",
    timestamp: "2024-06-28T10:00:00Z"
  }
];

function DashboardPage() {
  const { loading, data, fetchData } = useDashboardData() as {
    loading: boolean;
    data: DashboardDataWithAlerts;
    fetchData: () => void;
  };
  const { kpis, updateKPIValues } = useKPIs();
  const { integrations } = useIntegrations();
  const activeIntegrations = integrations.filter(i => i.active);
  const [widgetOrder, setWidgetOrder] = useState<string[]>(() => {
    const saved = localStorage.getItem("widget-order");
    return saved ? JSON.parse(saved) : ["github", "gitlab", "jenkins", "jira", "sonar"];
  });

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  useEffect(() => {
    if (data) {
      updateKPIValues(data);
    }
  }, [data, updateKPIValues]);

  const handleDragEnd = (result: any) => {
    if (!result.destination) return;

    const items = Array.from(widgetOrder);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    setWidgetOrder(items);
    localStorage.setItem("widget-order", JSON.stringify(items));
  };

  const renderWidget = (widgetId: string) => {
    const isToolActive = activeIntegrations.some(integration => 
      integration.name.toLowerCase() === widgetId ||
      (integration.name.toLowerCase() === 'sonarqube' && widgetId === 'sonar')
    );

    if (!isToolActive) return null;

    const LoadingFallback = () => (
      <Card className="p-6">
        <div className="flex items-center justify-center h-32">
          <RefreshCw className="animate-spin h-8 w-8" />
        </div>
      </Card>
    );

    switch (widgetId) {
      case "github":
        return (
          <Suspense fallback={<LoadingFallback />}>
            <GithubWidget widgetId={widgetId} />
          </Suspense>
        );
      case "gitlab":
        return (
          <Suspense fallback={<LoadingFallback />}>
            <GitlabWidget widgetId={widgetId} />
          </Suspense>
        );
      case "jenkins":
        return (
          <Suspense fallback={<LoadingFallback />}>
            <JenkinsWidget widgetId={widgetId} />
          </Suspense>
        );
      case "jira":
        return (
          <Suspense fallback={<LoadingFallback />}>
            <JiraWidget widgetId={widgetId} />
          </Suspense>
        );
      case "sonar":
      case "sonarqube":
        return (
          <Suspense fallback={<LoadingFallback />}>
            <SonarWidget widgetId={widgetId} />
          </Suspense>
        );
      default:
        return null;
    }
  };

  // Utilisation typée
  const alerts = [
    ...((Array.isArray(data?.alerts) ? data.alerts : [])
      .map((a: any) => typeof a === 'string' ? { title: "Alerte", message: a, severity: "info", timestamp: undefined } : a)),
    ...technicalMockAlerts
  ];

  // Si aucune alerte, fallback sur les notifications mockées
  const finalAlerts = alerts.length > 0
    ? alerts
    : (mockNotifications as Notification[]).map(n => ({
        title: "Notification",
        message: n.message,
        severity: "info",
        timestamp: n.date
      }));
      
  return (
    <div className="container mx-auto p-6">
      <div className="mb-8 flex items-center justify-between">
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <Button onClick={() => fetchData()} disabled={loading}>
          <RefreshCw className={cn("mr-2 h-4 w-4", loading && "animate-spin")} />
          Rafraîchir
        </Button>
      </div>

      <div className="mb-8 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
        {kpis.map((kpi, index) => (
          kpi.show && <KPICard key={index} kpi={kpi} />
        ))}
      </div>
      
      <div className="space-y-4">
          <h2 className="text-xl font-semibold">Alertes récentes</h2>
          <AlertCard
            alerts={finalAlerts}
            className="mb-8"
          />
      </div>

      <Tabs defaultValue="all" className="mb-8">
        <TabsList>
          <TabsTrigger value="all">Tous</TabsTrigger>
          {activeIntegrations.map((integration) => (
            <TabsTrigger key={integration.name} value={integration.name.toLowerCase()}>
              {integration.name}
            </TabsTrigger>
          ))}
        </TabsList>

        <TabsContent value="all" className="mt-6">
          <DragDropContext onDragEnd={handleDragEnd}>
            <Droppable droppableId="widgets">
              {(provided) => (
                <div
                  {...provided.droppableProps}
                  ref={provided.innerRef}
                  className="grid grid-cols-1 gap-6 md:grid-cols-2"
                >
                  {activeIntegrations.map((integration, index) => {
                    let widgetId = integration.name.toLowerCase();
                    if (widgetId === 'sonarqube') widgetId = 'sonar';
                    return (
                      <Draggable key={widgetId} draggableId={widgetId} index={index}>
                        {(provided) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                          >
                            {renderWidget(widgetId)}
                          </div>
                        )}
                      </Draggable>
                    );
                  })}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          </DragDropContext>
        </TabsContent>

        {activeIntegrations.map((integration) => (
          <TabsContent key={integration.name} value={integration.name.toLowerCase()} className="mt-6">
            <Card className="p-6">
              <h2 className="text-xl font-semibold">{integration.name}</h2>
              {renderWidget(integration.name.toLowerCase())}
            </Card>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
}
