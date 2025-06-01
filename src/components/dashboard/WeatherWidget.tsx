import { Card } from "@/components/ui/card";
import { CircleCheck, AlertCircle, Cloud, CloudLightning, Sun } from "lucide-react";
import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";

export type WeatherData = {
  status: "healthy" | "warning" | "critical" | "loading";
  message: string;
  lastUpdate: string;
  activity: {
    type: "update" | "alert" | "normal";
    message: string;
    timestamp: string;
  }[];
};

type WeatherType = "sunny" | "cloudy" | "stormy" | "loading";

interface WeatherWidgetProps {
  data?: WeatherData;
  isLoading?: boolean;
  error?: string;
}

const weatherConfig = {
  healthy: {
    type: "sunny" as WeatherType,
    icon: <Sun className="h-12 w-12 text-yellow-400" />,
    color: "bg-gradient-to-br from-blue-400 to-blue-600",
    message: "Tous les systèmes sont opérationnels",
  },
  warning: {
    type: "cloudy" as WeatherType,
    icon: <Cloud className="h-12 w-12 text-gray-300" />,
    color: "bg-gradient-to-br from-gray-400 to-gray-600",
    message: "Certains systèmes nécessitent votre attention",
  },
  critical: {
    type: "stormy" as WeatherType,
    icon: <CloudLightning className="h-12 w-12 text-yellow-400" />,
    color: "bg-gradient-to-br from-gray-600 to-gray-800",
    message: "Des problèmes critiques ont été détectés",
  },
  loading: {
    type: "cloudy" as WeatherType,
    icon: <Cloud className="h-12 w-12 text-gray-300 animate-pulse" />,
    color: "bg-gradient-to-br from-gray-300 to-gray-500",
    message: "Chargement de l'état du système...",
  },
};

export function WeatherWidget({ data, isLoading, error }: WeatherWidgetProps) {
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    if (data?.status) {
      setIsAnimating(true);
      const timer = setTimeout(() => setIsAnimating(false), 1000);
      return () => clearTimeout(timer);
    }
  }, [data?.status]);

  if (isLoading) {
    return (
      <Card className={cn(
        "p-6 overflow-hidden relative",
        weatherConfig.loading.color
      )}>
        <div className="flex items-center justify-between">
          <div className="space-y-2">
            <h2 className="text-2xl font-bold text-white">État du système</h2>
            <p className="text-white/80">{weatherConfig.loading.message}</p>
          </div>
          <div className="relative">
            {weatherConfig.loading.icon}
          </div>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-black/10 to-transparent" />
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="p-6 overflow-hidden relative bg-red-500">
        <div className="flex items-center justify-between">
          <div className="space-y-2">
            <h2 className="text-2xl font-bold text-white">Erreur</h2>
            <p className="text-white/80">{error}</p>
          </div>
          <AlertCircle className="h-12 w-12 text-white" />
        </div>
      </Card>
    );
  }

  if (!data) return null;

  const config = weatherConfig[data.status];

  return (
    <Card className={cn(
      "p-6 overflow-hidden relative transition-all duration-500",
      config.color,
      isAnimating && "scale-105"
    )}>
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <h2 className="text-2xl font-bold text-white">État du système</h2>
          <p className="text-white/80">{data.message}</p>
          <p className="text-xs text-white/40 mt-1">Dernière mise à jour : {new Date(data.lastUpdate).toLocaleTimeString()}</p>
        </div>
        <div className="relative">
          {config.icon}
          {data.status === "healthy" && (
            <div className="absolute -top-1 -right-1">
              <CircleCheck className="h-5 w-5 text-green-400" />
            </div>
          )}
          {data.status === "critical" && (
            <div className="absolute -top-1 -right-1">
              <AlertCircle className="h-5 w-5 text-red-400" />
            </div>
          )}
        </div>
      </div>
      {/* Activité récente */}
      {data.activity.length > 0 && (
        <div className="mt-4 space-y-1">
          {data.activity.slice(0, 2).map((activity, index) => (
            <div
              key={index}
              className={cn(
                "text-xs text-white/80 flex items-center gap-2",
                activity.type === "alert" && "text-red-200",
                activity.type === "update" && "text-blue-200"
              )}
            >
              {activity.type === "alert" && <AlertCircle className="h-3 w-3" />}
              {activity.type === "update" && <CircleCheck className="h-3 w-3" />}
              <span>{activity.message}</span>
              <span className="text-white/40">
                {new Date(activity.timestamp).toLocaleTimeString()}
              </span>
            </div>
          ))}
        </div>
      )}
      <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-black/10 to-transparent" />
    </Card>
  );
} 