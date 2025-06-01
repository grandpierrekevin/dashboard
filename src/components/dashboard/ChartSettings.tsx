import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { Settings2 } from "lucide-react";
import { Switch } from "@/components/ui/switch";

export type ChartType = "line" | "bar" | "area" | "pie" | "radar" | "scatter";
export type ChartColor = "blue" | "green" | "purple" | "orange" | "red" | "yellow" | "pink" | "cyan";
export type ChartTheme = "light" | "dark" | "auto";

export interface ChartSettings {
  type: ChartType;
  color: ChartColor;
  theme: ChartTheme;
  showLegend: boolean;
  showGrid: boolean;
  showTooltip: boolean;
  showAxis: boolean;
  animation: boolean;
  stacked: boolean;
  fontSize: number;
  lineWidth: number;
  pointRadius: number;
  pointHoverRadius: number;
  aspectRatio: number;
  maintainAspectRatio: boolean;
  responsive: boolean;
}

interface ChartSettingsProps {
  settings: ChartSettings;
  onSettingsChange: (key: keyof ChartSettings, value: any) => void;
  widgetName: string;
}

const chartTypes: { value: ChartType; label: string }[] = [
  { value: "line", label: "Ligne" },
  { value: "bar", label: "Barres" },
  { value: "area", label: "Aire" },
  { value: "pie", label: "Camembert" },
  { value: "radar", label: "Radar" },
  { value: "scatter", label: "Nuage de points" },
];

const chartColors: { value: ChartColor; label: string }[] = [
  { value: "blue", label: "Bleu" },
  { value: "green", label: "Vert" },
  { value: "purple", label: "Violet" },
  { value: "orange", label: "Orange" },
  { value: "red", label: "Rouge" },
  { value: "yellow", label: "Jaune" },
  { value: "pink", label: "Rose" },
  { value: "cyan", label: "Cyan" },
];

export function ChartSettings({ settings, onSettingsChange, widgetName }: ChartSettingsProps) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" size="icon" aria-label={`Personnaliser le graphique ${widgetName}`}>
          <Settings2 className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Paramètres du graphique</DialogTitle>
          <DialogDescription>
            Personnalisez l'apparence et le comportement du graphique.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="chart-type">Type de graphique</Label>
            <Select
              value={settings.type}
              onValueChange={(value: ChartType) => onSettingsChange("type", value)}
            >
              <SelectTrigger id="chart-type">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {chartTypes.map(type => (
                  <SelectItem key={type.value} value={type.value}>
                    {type.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="chart-color">Couleur</Label>
            <Select
              value={settings.color}
              onValueChange={(value: ChartColor) => onSettingsChange("color", value)}
            >
              <SelectTrigger id="chart-color">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {chartColors.map(color => (
                  <SelectItem key={color.value} value={color.value}>
                    {color.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center justify-between">
            <Label htmlFor="show-legend">Afficher la légende</Label>
            <Switch
              id="show-legend"
              checked={settings.showLegend}
              onCheckedChange={checked => onSettingsChange("showLegend", checked)}
            />
          </div>

          <div className="flex items-center justify-between">
            <Label htmlFor="show-grid">Afficher la grille</Label>
            <Switch
              id="show-grid"
              checked={settings.showGrid}
              onCheckedChange={checked => onSettingsChange("showGrid", checked)}
            />
          </div>

          <div className="flex items-center justify-between">
            <Label htmlFor="show-tooltip">Afficher les infobulles</Label>
            <Switch
              id="show-tooltip"
              checked={settings.showTooltip}
              onCheckedChange={checked => onSettingsChange("showTooltip", checked)}
            />
          </div>

          <div className="flex items-center justify-between">
            <Label htmlFor="show-axis">Afficher les axes</Label>
            <Switch
              id="show-axis"
              checked={settings.showAxis}
              onCheckedChange={checked => onSettingsChange("showAxis", checked)}
            />
          </div>

          <div className="flex items-center justify-between">
            <Label htmlFor="animation">Animation</Label>
            <Switch
              id="animation"
              checked={settings.animation}
              onCheckedChange={checked => onSettingsChange("animation", checked)}
            />
          </div>

          <div className="flex items-center justify-between">
            <Label htmlFor="stacked">Graphique empilé</Label>
            <Switch
              id="stacked"
              checked={settings.stacked}
              onCheckedChange={checked => onSettingsChange("stacked", checked)}
            />
          </div>

          <div className="flex items-center justify-between">
            <Label htmlFor="maintain-aspect-ratio">Maintenir le ratio</Label>
            <Switch
              id="maintain-aspect-ratio"
              checked={settings.maintainAspectRatio}
              onCheckedChange={checked => onSettingsChange("maintainAspectRatio", checked)}
            />
          </div>

          <div className="flex items-center justify-between">
            <Label htmlFor="responsive">Responsive</Label>
            <Switch
              id="responsive"
              checked={settings.responsive}
              onCheckedChange={checked => onSettingsChange("responsive", checked)}
            />
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
} 