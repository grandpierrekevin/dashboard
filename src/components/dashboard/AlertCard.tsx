import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";

interface AlertCardProps {
  alerts: string[];
  className?: string;
}

export function AlertCard({ alerts, className }: AlertCardProps) {
  if (alerts.length === 0) {
    return null;
  }

  return (
    <div className={className}>
      {alerts.map((alert, index) => (
        <Alert key={index} variant="destructive" className="mb-4">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Attention</AlertTitle>
          <AlertDescription>{alert}</AlertDescription>
        </Alert>
      ))}
    </div>
  );
} 