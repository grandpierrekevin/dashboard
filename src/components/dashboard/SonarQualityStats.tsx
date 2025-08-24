import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { AlertCircle, Bug, Shield, Code } from "lucide-react";
import type { ProjectMetrics } from "@/types/sonarqube";

interface SonarQualityStatsProps {
  metrics: ProjectMetrics;
  qualityGate: {
    status: 'passed' | 'failed';
    conditions: Array<{
      metric: string;
      status: 'passed' | 'failed';
      value: number;
      threshold: number;
    }>;
  };
}

export function SonarQualityStats({ metrics, qualityGate }: SonarQualityStatsProps) {
  const getQualityGateColor = (status: 'passed' | 'failed') => 
    status === 'passed' ? 'text-green-500' : 'text-red-500';

  const getMetricColor = (value: number, threshold: number) => 
    value <= threshold ? 'text-green-500' : 'text-red-500';

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <Card className="bg-gray-900">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Couverture</CardTitle>
          <Code className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {metrics.coverage}%
          </div>
          <Progress 
            value={metrics.coverage} 
            className="h-2 mt-2"
            indicatorClassName={getMetricColor(metrics.coverage, 80) === 'text-green-500' ? 'bg-green-500' : 'bg-red-500'}
          />
          <p className="text-xs text-muted-foreground mt-2">
            Seuil: 80%
          </p>
        </CardContent>
      </Card>

      <Card className="bg-gray-900">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Bugs</CardTitle>
          <Bug className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {metrics.bugs}
          </div>
          <p className="text-xs text-muted-foreground mt-2">
            Seuil: 5
          </p>
        </CardContent>
      </Card>

      <Card className="bg-gray-900">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Vulnérabilités</CardTitle>
          <Shield className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {metrics.vulnerabilities}
          </div>
          <p className="text-xs text-muted-foreground mt-2">
            Seuil: 2
          </p>
        </CardContent>
      </Card>

      <Card className="bg-gray-900">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Code Smells</CardTitle>
          <AlertCircle className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {metrics.codeSmells}
          </div>
          <p className="text-xs text-muted-foreground mt-2">
            Seuil: 20
          </p>
        </CardContent>
      </Card>

      <Card className="col-span-full bg-gray-900">
        <CardHeader>
          <CardTitle className="text-sm font-medium">Quality Gate</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-2">
            <div className={`text-lg font-bold ${getQualityGateColor(qualityGate.status)}`}>
              {qualityGate.status === 'passed' ? 'Passed' : 'Failed'}
            </div>
            <div className="flex-1">
              {qualityGate.conditions.map((condition, index) => (
                <div key={index} className="flex items-center justify-between mt-2">
                  <span className="text-sm">{condition.metric}</span>
                  <span className={`text-sm ${getMetricColor(condition.value, condition.threshold)}`}>
                    {condition.value} / {condition.threshold}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 