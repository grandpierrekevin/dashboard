import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useChartSettings } from "@/hooks/useChartSettings";
import { ChartSettings as ChartSettingsComponent, ChartSettings } from "./ChartSettings";
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, 
  BarChart, Bar, AreaChart, Area, PieChart, Pie, Cell, RadarChart, Radar, PolarGrid, 
  PolarAngleAxis, PolarRadiusAxis, ScatterChart, Scatter 
} from "recharts";
import { Info, AlertCircle, Sun, CloudSun, Cloud, CloudRain, CloudLightning } from "lucide-react";
import { Tooltip as UiTooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { WidgetDetails } from "./WidgetDetails";
import { Button } from "@/components/ui/button";
import { ChartData } from "@/types/dashboard";
import { colorMap, ColorKey, getColorClass, getGlobalStats } from "@/lib/utils";
import { memo } from "react";
import { useWidgetData } from "@/hooks/useWidgetData";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";

const ChartComponent = memo(({ data, settings }: { data: ChartData[], settings: ChartSettings }) => {
  if (!data?.length) return null;

  const chartProps = {
    width: "100%",
    height: 300,
    style: {
      fontSize: settings.fontSize,
    },
  };

  const lineProps = {
    strokeWidth: settings.lineWidth,
    dot: {
      r: settings.pointRadius,
      fill: colorMap[settings.color as ColorKey],
    },
    activeDot: {
      r: settings.pointHoverRadius,
    },
    animationDuration: settings.animation ? 1000 : 0,
  };

  switch (settings.type) {
    case "line":
      return (
        <ResponsiveContainer {...chartProps}>
          <LineChart data={data}>
            {settings.showGrid && <CartesianGrid strokeDasharray="3 3" />}
            <XAxis dataKey="name" />
            {settings.showAxis && <YAxis />}
            {settings.showTooltip && <Tooltip />}
            {settings.showLegend && <Legend />}
            <Line
              type="monotone"
              dataKey="value"
              stroke={colorMap[settings.color as ColorKey]}
              {...lineProps}
            />
          </LineChart>
        </ResponsiveContainer>
      );

    case "bar":
      return (
        <ResponsiveContainer {...chartProps}>
          <BarChart data={data}>
            {settings.showGrid && <CartesianGrid strokeDasharray="3 3" />}
            <XAxis dataKey="name" />
            {settings.showAxis && <YAxis />}
            {settings.showTooltip && <Tooltip />}
            {settings.showLegend && <Legend />}
            <Bar
              dataKey="value"
              fill={colorMap[settings.color as ColorKey]}
              animationDuration={settings.animation ? 1000 : 0}
            />
          </BarChart>
        </ResponsiveContainer>
      );

    case "area":
      return (
        <ResponsiveContainer {...chartProps}>
          <AreaChart data={data}>
            {settings.showGrid && <CartesianGrid strokeDasharray="3 3" />}
            <XAxis dataKey="name" />
            {settings.showAxis && <YAxis />}
            {settings.showTooltip && <Tooltip />}
            {settings.showLegend && <Legend />}
            <Area
              type="monotone"
              dataKey="value"
              stroke={colorMap[settings.color as ColorKey]}
              fill={colorMap[settings.color as ColorKey]}
              fillOpacity={0.3}
              {...lineProps}
            />
          </AreaChart>
        </ResponsiveContainer>
      );

    case "pie":
      return (
        <ResponsiveContainer {...chartProps}>
          <PieChart>
            <Pie
              data={data}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              outerRadius={100}
              fill={colorMap[settings.color as ColorKey]}
              label
              animationDuration={settings.animation ? 1000 : 0}
            >
              {data.map((_, index) => (
                <Cell key={`cell-${index}`} fill={colorMap[Object.keys(colorMap)[index % Object.keys(colorMap).length] as ColorKey]} />
              ))}
            </Pie>
            {settings.showTooltip && <Tooltip />}
            {settings.showLegend && <Legend />}
          </PieChart>
        </ResponsiveContainer>
      );

    case "radar":
      return (
        <ResponsiveContainer {...chartProps}>
          <RadarChart data={data}>
            <PolarGrid />
            <PolarAngleAxis dataKey="name" />
            <PolarRadiusAxis />
            <Radar
              name="Jenkins"
              dataKey="value"
              stroke={colorMap[settings.color as ColorKey]}
              fill={colorMap[settings.color as ColorKey]}
              fillOpacity={0.6}
              {...lineProps}
            />
            {settings.showTooltip && <Tooltip />}
            {settings.showLegend && <Legend />}
          </RadarChart>
        </ResponsiveContainer>
      );

    case "scatter":
      return (
        <ResponsiveContainer {...chartProps}>
          <ScatterChart>
            {settings.showGrid && <CartesianGrid />}
            <XAxis dataKey="x" />
            {settings.showAxis && <YAxis dataKey="y" />}
            {settings.showTooltip && <Tooltip />}
            {settings.showLegend && <Legend />}
            <Scatter
              name="Jenkins"
              data={data}
              fill={colorMap[settings.color as ColorKey]}
              {...lineProps}
            />
          </ScatterChart>
        </ResponsiveContainer>
      );

    default:
      return null;
  }
});

export const JenkinsWidget = memo(function JenkinsWidget() {
  const { data, loading, error } = useWidgetData({ type: 'jenkins' });
  const { settings, updateSetting } = useChartSettings('jenkins');

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>
          {error.message}
        </AlertDescription>
      </Alert>
    );
  }

  if (loading || !data || !Array.isArray(data)) {
    return (
      <div className="animate-pulse space-y-4">
        <div className="h-4 bg-muted rounded w-1/4" />
        <div className="space-y-2">
          <div className="h-4 bg-muted rounded" />
          <div className="h-4 bg-muted rounded w-5/6" />
        </div>
      </div>
    );
  }

  const chartData: ChartData[] = Array.isArray(data) ? (data as ChartData[]) : [];

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">
          Jenkins Activity
        </CardTitle>
        <div className="flex items-center gap-2">
          <ChartSettingsComponent 
            settings={settings} 
            onSettingsChange={updateSetting}
            widgetName="Jenkins Activity" 
          />
        </div>
      </CardHeader>
      <CardContent>
        <div className="h-[300px]">
          <ChartComponent data={chartData} settings={settings} />
        </div>
        <WidgetDetails data={chartData} title="Jenkins Activity" type="jenkins" />
      </CardContent>
    </Card>
  );
});
