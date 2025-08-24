import { SonarIssue } from "@/types/mocks";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { formatDistanceToNow } from "date-fns";
import { fr } from "date-fns/locale";
import { Bug, Shield, AlertCircle } from "lucide-react";

interface RecentSonarIssuesListProps {
  issues: SonarIssue[];
  onViewDetails: (issue: SonarIssue) => void;
}

export function RecentSonarIssuesList({ issues, onViewDetails }: RecentSonarIssuesListProps) {
  const handleResolve = (issue: SonarIssue) => {
    toast(`Issue résolue\nIssue #${issue.id} - ${issue.message}`);
  };

  const getTypeIcon = (type: SonarIssue['type']) => {
    switch (type) {
      case 'bug':
        return <Bug className="h-4 w-4 text-red-500" />;
      case 'vulnerability':
        return <Shield className="h-4 w-4 text-yellow-500" />;
      case 'code_smell':
        return <AlertCircle className="h-4 w-4 text-blue-500" />;
      default:
        return null;
    }
  };

  const getSeverityColor = (severity: SonarIssue['severity']) => {
    switch (severity) {
      case 'blocker':
        return 'text-red-500';
      case 'critical':
        return 'text-orange-500';
      case 'major':
        return 'text-yellow-500';
      case 'minor':
        return 'text-blue-500';
      default:
        return 'text-gray-500';
    }
  };

  return (
    <Card className="bg-gray-900">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Bug className="h-5 w-5" />
          Issues Récentes
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {issues.map((issue) => (
            <div
              key={issue.id}
              className="flex items-start justify-between p-4 bg-gray-800 rounded-lg cursor-pointer hover:bg-gray-700 transition-colors"
              onClick={() => onViewDetails(issue)}
            >
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  {getTypeIcon(issue.type)}
                  <span className={`font-medium ${getSeverityColor(issue.severity)}`}>
                    {issue.severity}
                  </span>
                  <span className="text-sm text-gray-400">
                    {issue.status === 'open' ? 'Ouvert' : 'Résolu'}
                  </span>
                </div>
                <p className="text-sm text-gray-400">{issue.message}</p>
                <div className="text-sm text-gray-500">
                  {issue.component}:{issue.line}
                </div>
              </div>
              <div className="text-sm text-gray-400">
                {new Date(issue.date).toLocaleDateString()}
              </div>
            </div>
          ))}
          {issues.length === 0 && (
            <div className="text-center text-gray-400 py-4">
              Aucune issue trouvée
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
} 