import { useState, useEffect, useCallback } from "react";
import { ChartSettings } from "@/components/dashboard/ChartSettings";

/**
 * Configuration par défaut pour les graphiques
 * Ces paramètres sont utilisés comme valeurs initiales et pour la réinitialisation
 */
const defaultSettings: ChartSettings = {
  type: "line",
  color: "blue",
  theme: "light",
  showLegend: true,
  showGrid: true,
  showTooltip: true,
  showAxis: true,
  animation: true,
  stacked: false,
  fontSize: 12,
  lineWidth: 2,
  pointRadius: 3,
  pointHoverRadius: 5,
  aspectRatio: 2,
  maintainAspectRatio: true,
  responsive: true,
};

/**
 * Vérifie si un objet correspond à la structure ChartSettings
 * @param obj - L'objet à vérifier
 * @returns true si l'objet est un ChartSettings valide
 */
function isValidSettings(obj: any): obj is ChartSettings {
  return (
    obj &&
    typeof obj === 'object' &&
    typeof obj.type === 'string' &&
    typeof obj.color === 'string' &&
    typeof obj.theme === 'string' &&
    typeof obj.showLegend === 'boolean' &&
    typeof obj.showGrid === 'boolean' &&
    typeof obj.showTooltip === 'boolean' &&
    typeof obj.showAxis === 'boolean' &&
    typeof obj.animation === 'boolean' &&
    typeof obj.stacked === 'boolean' &&
    typeof obj.fontSize === 'number' &&
    typeof obj.lineWidth === 'number' &&
    typeof obj.pointRadius === 'number' &&
    typeof obj.pointHoverRadius === 'number' &&
    typeof obj.aspectRatio === 'number' &&
    typeof obj.maintainAspectRatio === 'boolean' &&
    typeof obj.responsive === 'boolean'
  );
}

/**
 * Hook personnalisé pour gérer les paramètres des graphiques
 * Persiste les paramètres dans le localStorage
 * 
 * @param widgetName - Nom unique du widget pour la persistance
 * @returns Un objet contenant les paramètres et les fonctions de mise à jour
 */
export function useChartSettings(widgetName: string) {
  // Initialisation avec les paramètres sauvegardés ou les valeurs par défaut
  const [settings, setSettings] = useState<ChartSettings>(() => {
    try {
      const saved = localStorage.getItem(`chartSettings-${widgetName}`);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (isValidSettings(parsed)) {
          return parsed;
        }
        localStorage.removeItem(`chartSettings-${widgetName}`);
      }
      return defaultSettings;
    } catch {
      return defaultSettings;
    }
  });

  // Persistance des paramètres dans le localStorage
  useEffect(() => {
    try {
      localStorage.setItem(`chartSettings-${widgetName}`, JSON.stringify(settings));
    } catch {}
  }, [settings, widgetName]);

  /**
   * Met à jour un paramètre spécifique
   * @param key - La clé du paramètre à mettre à jour
   * @param value - La nouvelle valeur
   */
  const updateSetting = useCallback((key: keyof ChartSettings, value: any) => {
    setSettings(prev => ({
      ...prev,
      [key]: value
    }));
  }, []);

  /**
   * Met à jour plusieurs paramètres en même temps
   * @param newSettings - Objet contenant les nouveaux paramètres
   */
  const updateSettings = useCallback((newSettings: Partial<ChartSettings>) => {
    setSettings(prev => ({
      ...prev,
      ...newSettings
    }));
  }, []);

  /**
   * Réinitialise les paramètres aux valeurs par défaut
   */
  const resetSettings = useCallback(() => {
    setSettings(defaultSettings);
  }, []);

  return {
    settings,
    updateSetting,
    updateSettings,
    resetSettings,
  };
} 