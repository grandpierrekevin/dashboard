import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";

interface AlertCardProps {
  alerts: (string | { title?: string; message?: string; severity?: string; timestamp?: string })[];
  className?: string;
}

export function AlertCard({ alerts, className }: AlertCardProps) {
  if (alerts.length === 0) {
    return null;
  }

  return (
    <div className={className}>
      {alerts.map((alert, index) => {
        if (typeof alert === 'string') {
          return (
            <Alert key={index} variant="destructive" className="mb-4">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Attention</AlertTitle>
              <AlertDescription>{alert}</AlertDescription>
            </Alert>
          );
        }
        return (
          <Alert key={index} variant={alert.severity === 'critical' ? 'destructive' : 'default'} className="mb-4">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>{alert.title || 'Alerte'}</AlertTitle>
            <AlertDescription>{alert.message || ''}</AlertDescription>
            <div className="text-xs text-gray-400 mt-1">{alert.timestamp ? new Date(alert.timestamp).toLocaleString() : ''}</div>
          </Alert>
        );
      })}
    </div>
  );
} 