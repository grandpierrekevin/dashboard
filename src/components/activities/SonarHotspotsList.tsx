import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Shield, AlertTriangle, CheckCircle } from "lucide-react";
import type { Hotspot } from "@/types/sonarqube";

interface SonarHotspotsListProps {
  hotspots: Hotspot[];
  onViewDetails: (hotspot: Hotspot) => void;
}

export function SonarHotspotsList({ hotspots, onViewDetails }: SonarHotspotsListProps) {
  const getStatusIcon = (status: Hotspot['status']) => {
    switch (status) {
      case 'to_review':
        return <AlertTriangle className="h-4 w-4 text-yellow-500" />;
      case 'reviewed':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'fixed':
        return <CheckCircle className="h-4 w-4 text-blue-500" />;
      default:
        return null;
    }
  };

  const getStatusText = (status: Hotspot['status']) => {
    switch (status) {
      case 'to_review':
        return 'À revoir';
      case 'reviewed':
        return 'Revisé';
      case 'fixed':
        return 'Corrigé';
      default:
        return status;
    }
  };

  return (
    <Card className="bg-gray-900">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Shield className="h-5 w-5" />
          Hotspots de Sécurité
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {hotspots.map((hotspot) => (
            <div
              key={hotspot.id}
              className="flex items-start justify-between p-4 bg-gray-800 rounded-lg cursor-pointer hover:bg-gray-700 transition-colors"
              onClick={() => onViewDetails(hotspot)}
            >
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="font-medium">{hotspot.details.rule.name}</span>
                  {getStatusIcon(hotspot.status)}
                  <span className="text-sm text-gray-400">
                    {getStatusText(hotspot.status)}
                  </span>
                </div>
                <p className="text-sm text-gray-400">{hotspot.message}</p>
                <div className="text-sm text-gray-500">
                  {hotspot.component}:{hotspot.line}
                </div>
              </div>
              <div className="text-sm text-gray-400">
                {new Date(hotspot.creationDate).toLocaleDateString()}
              </div>
            </div>
          ))}
          {hotspots.length === 0 && (
            <div className="text-center text-gray-400 py-4">
              Aucun hotspot de sécurité trouvé
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
} 