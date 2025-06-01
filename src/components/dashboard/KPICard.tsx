import { Card, CardContent } from "@/components/ui/card";
import { KPI } from "@/types/dashboard";
import { cn } from "@/lib/utils";

interface KPICardProps {
  kpi: KPI;
  className?: string;
}

export function KPICard({ kpi, className }: KPICardProps) {
  const colorMap = {
    green: "bg-green-500",
    blue: "bg-blue-500",
    red: "bg-red-500",
    yellow: "bg-yellow-500",
  };

  return (
    <Card className={cn("w-full", className)}>
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-muted-foreground">{kpi.label}</p>
            <h3 className="text-2xl font-bold">{kpi.value}</h3>
          </div>
          <div className={cn("h-12 w-12 rounded-full", colorMap[kpi.color as keyof typeof colorMap])} />
        </div>
      </CardContent>
    </Card>
  );
} 