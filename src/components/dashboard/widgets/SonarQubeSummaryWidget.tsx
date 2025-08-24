import React from 'react';
import { DashboardWidget } from '../DashboardWidget';
import { useWidgetData } from '@/hooks/useWidgetData';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { ShieldCheck, PercentCircle, Bug, AlertCircle } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { LineChart, Line, XAxis, YAxis, Tooltip as RechartsTooltip, ResponsiveContainer, CartesianGrid } from 'recharts';

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

export function SonarQubeSummaryWidget({ id, title, onRemove, onSettings }: { id: string; title: string; onRemove: (id: string) => void; onSettings: (id: string) => void }) {
  const { data, loading, error } = useWidgetData({ type: 'sonarqube' });
  const sonarData = data as unknown as SonarWidgetData[];

  if (error) {
    return (
      <DashboardWidget id={id} title={title} tool="SonarQube" onRemove={onRemove} onSettings={onSettings}>
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
      <DashboardWidget id={id} title={title} tool="SonarQube" onRemove={onRemove} onSettings={onSettings}>
        <div className="animate-pulse space-y-4 p-4">
          <div className="grid grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="flex flex-col items-center">
                <div className="w-7 h-7 bg-muted rounded-full mb-1" />
                <div className="h-8 bg-muted rounded w-12 mb-1" />
                <div className="h-4 bg-muted rounded w-16" />
              </div>
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

  // Agrégation de l'activité pour le graphique
  const days = ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'];
  const activity = days.map(day => ({
    date: day,
    issues: sonarData.reduce((sum, project) => {
      const found = project.activity?.find(a => a.date === day);
      return sum + (found?.value || 0);
    }, 0)
  }));

  return (
    <DashboardWidget id={id} title={title} tool="SonarQube" onRemove={onRemove} onSettings={onSettings}>
      <div className="w-full h-full flex flex-col min-h-[220px] p-4">
        <TooltipProvider>
          <div className="grid grid-cols-4 gap-6 w-full text-center items-center justify-items-center flex-none">
            <Tooltip>
              <TooltipTrigger asChild>
                <div className="flex flex-col items-center group">
                  <ShieldCheck className="w-7 h-7 mb-1 text-green-500 group-hover:text-green-600 transition-colors" />
                  <span className="text-2xl font-extrabold tracking-tight">{qualityGate.status === 'passed' ? 'OK' : 'KO'}</span>
                  <span className="text-xs text-gray-400 mt-1 group-hover:text-gray-500 transition-colors">Qualité</span>
                </div>
              </TooltipTrigger>
              <TooltipContent>Statut de la qualité du code</TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <div className="flex flex-col items-center group">
                  <PercentCircle className="w-7 h-7 mb-1 text-blue-500 group-hover:text-blue-600 transition-colors" />
                  <span className="text-2xl font-extrabold tracking-tight">{stats.coverage}%</span>
                  <span className="text-xs text-gray-400 mt-1 group-hover:text-gray-500 transition-colors">Couverture</span>
                </div>
              </TooltipTrigger>
              <TooltipContent>Taux de couverture des tests</TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <div className="flex flex-col items-center group">
                  <Bug className="w-7 h-7 mb-1 text-orange-500 group-hover:text-orange-600 transition-colors" />
                  <span className="text-2xl font-extrabold tracking-tight">{stats.bugs}</span>
                  <span className="text-xs text-gray-400 mt-1 group-hover:text-gray-500 transition-colors">Bugs</span>
                </div>
              </TooltipTrigger>
              <TooltipContent>Nombre de bugs détectés</TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <div className="flex flex-col items-center group">
                  <AlertCircle className="w-7 h-7 mb-1 text-red-500 group-hover:text-red-600 transition-colors" />
                  <span className="text-2xl font-extrabold tracking-tight">{stats.vulnerabilities}</span>
                  <span className="text-xs text-gray-400 mt-1 group-hover:text-gray-500 transition-colors">Vulnérabilités</span>
                </div>
              </TooltipTrigger>
              <TooltipContent>Nombre de vulnérabilités détectées</TooltipContent>
            </Tooltip>
          </div>
        </TooltipProvider>
        {/* Mini-graphique d'activité qui prend tout le reste */}
        <div className="flex-1 flex items-end w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={activity}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis hide />
              <RechartsTooltip />
              <Line type="monotone" dataKey="issues" stroke="#22c55e" name="Issues" strokeWidth={2} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </DashboardWidget>
  );
} 