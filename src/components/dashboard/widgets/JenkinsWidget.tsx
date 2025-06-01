import React from 'react';
import { DashboardWidget } from '../DashboardWidget';
import { Badge } from '@/components/ui/badge';
import { PlayCircle, Clock, AlertCircle } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import { Button } from "@/components/ui/button";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { Label } from "@/components/ui/label";

interface JenkinsStats {
  builds: {
    total: number;
    success: number;
    failure: number;
  };
  averageDuration: number;
  lastBuild: {
    status: 'success' | 'failure' | 'running';
    duration: number;
    timestamp: string;
  };
  history: Array<{
    date: string;
    success: number;
    failure: number;
  }>;
}

export function JenkinsWidget({ id, onRemove, onSettings }: { id: string; onRemove: (id: string) => void; onSettings: (id: string) => void }) {
  const [stats, setStats] = React.useState<JenkinsStats>({
    builds: {
      total: 45,
      success: 38,
      failure: 7,
    },
    averageDuration: 325,
    lastBuild: {
      status: 'success',
      duration: 280,
      timestamp: new Date().toISOString(),
    },
    history: [
      { date: 'Lun', success: 5, failure: 1 },
      { date: 'Mar', success: 7, failure: 0 },
      { date: 'Mer', success: 6, failure: 2 },
      { date: 'Jeu', success: 8, failure: 1 },
      { date: 'Ven', success: 5, failure: 2 },
      { date: 'Sam', success: 4, failure: 1 },
      { date: 'Dim', success: 3, failure: 0 },
    ],
  });

  // Ajout des filtres
  const [statusFilter, setStatusFilter] = React.useState<string>("");
  const [branchFilter, setBranchFilter] = React.useState<string>("");
  // Branches mock pour la démo
  const branches = ["main", "develop", "feature/auth", "hotfix/security"];

  // Filtrage de l'historique selon les filtres
  const filteredHistory = stats.history.filter(h => {
    // Ici, on ne filtre que par statut pour la démo (succès/échec)
    if (statusFilter === "success" && h.failure > 0) return false;
    if (statusFilter === "failure" && h.success > 0) return false;
    // Pas de filtre branche dans le mock, mais on laisse la logique
    if (branchFilter && branchFilter !== "main") return false;
    return true;
  });

  const handleResetFilters = () => {
    setStatusFilter("");
    setBranchFilter("");
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'success':
        return 'bg-green-100 text-green-800';
      case 'failure':
        return 'bg-red-100 text-red-800';
      case 'running':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <DashboardWidget
      id={id}
      title="Statistiques Jenkins"
      tool="Jenkins"
      onRemove={onRemove}
      onSettings={onSettings}
    >
      <div className="space-y-4">
        {/* Barre de filtres */}
        <div className="flex flex-wrap gap-4 items-end mb-2">
          <div>
            <Label htmlFor="status">Statut</Label>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[140px]">
                <SelectValue placeholder="Tous" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">Tous</SelectItem>
                <SelectItem value="success">Succès</SelectItem>
                <SelectItem value="failure">Échec</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="branch">Branche</Label>
            <Select value={branchFilter} onValueChange={setBranchFilter}>
              <SelectTrigger className="w-[140px]">
                <SelectValue placeholder="Toutes" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">Toutes</SelectItem>
                {branches.map(b => (
                  <SelectItem key={b} value={b}>{b}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={handleResetFilters}
            disabled={!statusFilter && !branchFilter}
          >
            Réinitialiser les filtres
          </Button>
        </div>
        <div className="grid grid-cols-3 gap-4">
          <div className="flex flex-col items-center p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
            <PlayCircle className="w-6 h-6 mb-2 text-blue-500" />
            <span className="text-2xl font-bold">{stats.builds.total}</span>
            <span className="text-sm text-gray-500">Builds totaux</span>
          </div>
          <div className="flex flex-col items-center p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
            <Clock className="w-6 h-6 mb-2 text-purple-500" />
            <span className="text-2xl font-bold">{stats.averageDuration}s</span>
            <span className="text-sm text-gray-500">Durée moyenne</span>
          </div>
          <div className="flex flex-col items-center p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
            <AlertCircle className="w-6 h-6 mb-2 text-red-500" />
            <div className="flex flex-col items-center">
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="bg-green-100 text-green-800">
                  {stats.builds.success} succès
                </Badge>
                <Badge variant="outline" className="bg-red-100 text-red-800">
                  {stats.builds.failure} échecs
                </Badge>
              </div>
              <span className="text-sm text-gray-500 mt-1">Statut</span>
            </div>
          </div>
        </div>

        <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
          <h4 className="font-medium mb-2">Dernier build</h4>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Badge className={getStatusColor(stats.lastBuild.status)}>
                {stats.lastBuild.status}
              </Badge>
              <span className="text-sm text-gray-500">
                {stats.lastBuild.duration}s
              </span>
            </div>
            <span className="text-sm text-gray-500">
              {new Date(stats.lastBuild.timestamp).toLocaleString()}
            </span>
          </div>
        </div>

        {/* Graphique Jenkins */}
        <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
          <h4 className="font-medium mb-2">Historique des builds (7 jours)</h4>
          <div className="h-48">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={filteredHistory} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis allowDecimals={false} />
                <Tooltip />
                <Line type="monotone" dataKey="success" stroke="#22c55e" name="Succès" strokeWidth={2} />
                <Line type="monotone" dataKey="failure" stroke="#ef4444" name="Échecs" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </DashboardWidget>
  );
} 