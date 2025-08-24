import React from 'react';
import { DashboardWidget } from '../DashboardWidget';
import { Badge } from '@/components/ui/badge';
import { AlertCircle, CheckCircle2, Clock, Shield } from 'lucide-react';
import { useWidgetData } from '@/hooks/useWidgetData';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';

interface SonarWidgetData {
  name: string;
  value: number;
  details: {
    totalIssues: number;
    openIssues: number;
    resolvedIssues: number;
    totalHotspots: number;
    toReviewHotspots: number;
    reviewedHotspots: number;
    coverage: number;
    bugs: number;
    vulnerabilities: number;
    codeSmells: number;
  };
  qualityGate: {
    status: 'passed' | 'failed';
    conditions: Array<{
      metric: string;
      status: 'passed' | 'failed';
      value: number;
      threshold: number;
    }>;
  };
  lastAnalysis: string;
  activity: Array<{
    date: string;
    value: number;
  }>;
}

export function SonarQubeWidget({ id, title, onRemove, onSettings }: { id: string; title: string; onRemove: (id: string) => void; onSettings: (id: string) => void }) {
  const { data, loading, error } = useWidgetData({ type: 'sonarqube' });
  const sonarData = data as unknown as SonarWidgetData[];

  const [chartType, setChartType] = React.useState<'line' | 'bar'>('line');

  if (error) {
    return (
      <DashboardWidget
        id={id}
        title={title}
        tool="SonarQube"
        onRemove={onRemove}
        onSettings={onSettings}
      >
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            {error.message || "Une erreur est survenue lors du chargement des données SonarQube"}
          </AlertDescription>
        </Alert>
      </DashboardWidget>
    );
  }

  if (loading || !sonarData || !Array.isArray(sonarData) || sonarData.length === 0) {
    return (
      <DashboardWidget
        id={id}
        title={title}
        tool="SonarQube"
        onRemove={onRemove}
        onSettings={onSettings}
      >
        <div className="animate-pulse space-y-4 p-4">
          <div className="h-4 bg-muted rounded w-1/4" />
          <div className="space-y-2">
            <div className="h-4 bg-muted rounded" />
            <div className="h-4 bg-muted rounded w-5/6" />
          </div>
          <div className="grid grid-cols-4 gap-4 mt-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-16 bg-muted rounded" />
            ))}
          </div>
        </div>
      </DashboardWidget>
    );
  }

  const project = sonarData[0]; // On prend le premier projet pour l'instant
  const stats = project.details;
  const qualityGate = project.qualityGate;

  // Calculer le statut basé sur la qualité
  const getStatus = () => {
    switch (qualityGate.status) {
      case 'passed':
        return {
          label: 'Qualité OK',
          color: 'bg-green-100 text-green-800'
        };
      case 'failed':
        return {
          label: 'Qualité insuffisante',
          color: 'bg-red-100 text-red-800'
        };
      default:
        return {
          label: 'Non analysé',
          color: 'bg-gray-100 text-gray-600'
        };
    }
  };

  const status = getStatus();

  return (
    <div className="dashboard-widget">
      <DashboardWidget
        id={id}
        title={title}
        tool="SonarQube"
        onRemove={onRemove}
        onSettings={onSettings}
      >
        <div className="flex items-center gap-2 mb-2">
          <span className="font-semibold">{project.name}</span>
          <Badge className={status.color}>{status.label}</Badge>
        </div>
        
        <div className="flex flex-col gap-6 p-2 md:p-4">
          {/* Infos secondaires */}
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2 text-xs text-gray-400">
            <span>Dernière analyse : {new Date(project.lastAnalysis).toLocaleString()}</span>
            <span>Couverture : {stats.coverage}%</span>
          </div>

          {/* Chiffres clés */}
          <div className="grid grid-cols-4 gap-8">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <div className="flex flex-col items-center">
                    <AlertCircle className="w-7 h-7 mb-1 text-blue-500" />
                    <span className="text-2xl font-extrabold tracking-tight">{stats.totalIssues}</span>
                    <span className="text-xs text-gray-400 mt-1">Issues</span>
                  </div>
                </TooltipTrigger>
                <TooltipContent>Nombre total d'issues</TooltipContent>
              </Tooltip>

              <Tooltip>
                <TooltipTrigger asChild>
                  <div className="flex flex-col items-center">
                    <CheckCircle2 className="w-7 h-7 mb-1 text-green-500" />
                    <span className="text-2xl font-extrabold tracking-tight">{stats.resolvedIssues}</span>
                    <span className="text-xs text-gray-400 mt-1">Résolues</span>
                  </div>
                </TooltipTrigger>
                <TooltipContent>Issues résolues</TooltipContent>
              </Tooltip>

              <Tooltip>
                <TooltipTrigger asChild>
                  <div className="flex flex-col items-center">
                    <Shield className="w-7 h-7 mb-1 text-purple-500" />
                    <span className="text-2xl font-extrabold tracking-tight">{stats.totalHotspots}</span>
                    <span className="text-xs text-gray-400 mt-1">Hotspots</span>
                  </div>
                </TooltipTrigger>
                <TooltipContent>Nombre total de hotspots de sécurité</TooltipContent>
              </Tooltip>

              <Tooltip>
                <TooltipTrigger asChild>
                  <div className="flex flex-col items-center">
                    <Clock className="w-7 h-7 mb-1 text-orange-500" />
                    <span className="text-2xl font-extrabold tracking-tight">{stats.toReviewHotspots}</span>
                    <span className="text-xs text-gray-400 mt-1">À revoir</span>
                  </div>
                </TooltipTrigger>
                <TooltipContent>Hotspots à revoir</TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>

          {/* Mini-graphe personnalisable */}
          <div className="mt-4">
            <div className="flex items-center justify-between mb-2">
              <h4 className="font-medium">Issues par jour (7 jours)</h4>
              <div className="flex items-center gap-2">
                <span className="text-xs">Type de graphe</span>
                <select
                  className="w-[90px] h-7 text-xs bg-background border rounded"
                  value={chartType}
                  onChange={e => setChartType(e.target.value as 'line' | 'bar')}
                >
                  <option value="line">Ligne</option>
                  <option value="bar">Barres</option>
                </select>
              </div>
            </div>
            <ResponsiveContainer width="100%" height={120}>
              {chartType === 'line' ? (
                <LineChart data={project.activity} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis allowDecimals={false} />
                  <RechartsTooltip />
                  <Line type="monotone" dataKey="value" stroke="#22c55e" name="Issues" strokeWidth={2} />
                </LineChart>
              ) : (
                <BarChart data={project.activity} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis allowDecimals={false} />
                  <RechartsTooltip />
                  <Bar dataKey="value" fill="#22c55e" name="Issues" />
                </BarChart>
              )}
            </ResponsiveContainer>
          </div>
        </div>
      </DashboardWidget>
    </div>
  );
} 