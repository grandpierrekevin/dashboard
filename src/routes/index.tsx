import { createFileRoute } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Github, Gitlab, CircleCheck, Bug, BarChart, RefreshCw, Server } from "lucide-react";
import { useState } from "react";
import { useIntegrations } from "@/context/IntegrationsContext";
import type { ReactNode } from "react";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
import { useDashboardData } from "@/hooks/useDashboardData";
import type { DashboardData } from "@/types/dashboard";
import type { Integration } from "@/types/integrations";
import { Link } from "@tanstack/react-router";
import { cn } from "@/lib/utils";
import { WeatherWidget } from "@/components/dashboard/WeatherWidget";

// Mapping pour icônes/couleurs dynamiques par nom d'outil
const iconByName = {
  GitHub: <Github />,
  GitLab: <Gitlab />,
  Jenkins: <Bug />,
  Jira: <CircleCheck />,
  SonarQube: <BarChart />,
};

const colorByName = {
  GitHub: "bg-blue-900",
  GitLab: "bg-pink-700",
  Jenkins: "bg-yellow-600",
  Jira: "bg-yellow-800",
  SonarQube: "bg-green-900",
};

type StatCardProps = {
  icon: React.ReactNode;
  label: string;
  value: string | number;
  tooltip: string;
};

type ToolLinkProps = {
  href: string;
  label: string;
  icon: React.ReactNode;
  color: string;
};

export const Route = createFileRoute("/")({
  component: HomePage,
});

function HomePage() {
  const { integrations } = useIntegrations();
  const { loading, data, fetchData } = useDashboardData();
  const activeIntegrations = integrations.filter(i => i.active);

  const getHealthStatus = () => {
    if (!data) return "loading";
    const criticalAlerts = data.alerts.filter(a => a.severity === "critical");
    if (criticalAlerts.length > 0) return "critical";
    const warningAlerts = data.alerts.filter(a => a.severity === "warning");
    if (warningAlerts.length > 0) return "warning";
    return "healthy";
  };

  const healthStatus = getHealthStatus();
  const healthStatusConfig = {
    healthy: {
      message: "Tous les systèmes sont opérationnels",
    },
    warning: {
      message: "Certains systèmes nécessitent votre attention",
    },
    critical: {
      message: "Des problèmes critiques ont été détectés",
    },
    loading: {
      message: "Chargement de l'état du système...",
    },
  };

  return (
    <div className="container mx-auto p-6 space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Tableau de bord</h1>
        <Button onClick={fetchData} disabled={loading}>
          <RefreshCw className={cn("mr-2 h-4 w-4", loading && "animate-spin")} />
          Rafraîchir
        </Button>
      </div>

      <WeatherWidget 
        data={{
          status: healthStatus,
          message: healthStatusConfig[healthStatus].message,
          lastUpdate: new Date().toISOString(),
          activity: data?.alerts?.slice(0,2).map(alert => ({
            type: alert.severity === 'critical' ? 'alert' : 'update',
            message: alert.title,
            timestamp: alert.timestamp || new Date().toISOString(),
          })) || [],
        }}
        isLoading={loading}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {activeIntegrations.map((integration) => (
          <Link
            key={integration.name}
            to={`/dashboard/${integration.name.toLowerCase()}`}
            className="block"
          >
            <Card className={cn(
              "p-6 transition-all hover:shadow-lg",
              colorByName[integration.name]
            )}>
              <div className="flex items-center space-x-4">
                <div className="text-white">
                  {iconByName[integration.name]}
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-white">{integration.name}</h3>
                  <p className="text-white/80">{integration.url}</p>
                </div>
              </div>
            </Card>
          </Link>
        ))}
      </div>

      {data?.alerts && data.alerts.length > 0 && (
        <div className="space-y-4">
          <h2 className="text-xl font-semibold">Alertes récentes</h2>
          {data.alerts.map((alert, index) => (
            <Alert key={index} variant={alert.severity === "critical" ? "destructive" : "default"}>
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>{alert.title}</AlertTitle>
              <AlertDescription>{alert.message}</AlertDescription>
            </Alert>
          ))}
        </div>
      )}
    </div>
  );
}

// Statistique
export function StatCard({ icon, label, value, tooltip, color }: StatCardProps & { color: string }) {
  return (
    <Card className={`${color} flex flex-col items-center py-6`} title={tooltip}>
      <div className="text-3xl font-bold">{value}</div>
      <div className="text-xs uppercase font-semibold mt-2">{label}</div>
    </Card>
  );
}

// Outil
export function ToolLink({ href, label, icon, color }: ToolLinkProps) {
  return (
    <a
      href={href}
      className={`flex items-center gap-2 px-4 py-2 rounded text-white hover:opacity-90 focus:outline focus:ring-2 focus:ring-white ${color} shadow transition`}
      target="_blank"
      rel="noopener noreferrer"
      style={{ minWidth: 120, fontWeight: 500 }}
      tabIndex={0}
    >
      {icon} {label}
    </a>
  );
}
