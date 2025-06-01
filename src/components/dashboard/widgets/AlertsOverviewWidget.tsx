import React from 'react';
import { DashboardWidget } from '../DashboardWidget';
import { Badge } from '@/components/ui/badge';
import { Bell, CheckCircle2, Flame } from 'lucide-react';
import { useDashboardFilters } from '@/context/DashboardFilterContext';
import { Button } from "@/components/ui/button";

interface AlertsOverviewWidgetProps {
  id: string;
  onRemove: (id: string) => void;
  onSettings: (id: string) => void;
}

const MOCK = {
  active: 4,
  resolved: 12,
  topRules: [
    { name: 'Build Failure', count: 7 },
    { name: 'Critical Bug', count: 5 },
    { name: 'Low Coverage', count: 3 },
  ],
};

export function AlertsOverviewWidget({ id, onRemove, onSettings }: AlertsOverviewWidgetProps) {
  const { updateFilter, filters, resetFilters } = useDashboardFilters();

  // Filtrage mock (en vrai, filtrerait les données dynamiques)
  const filteredTopRules = filters.rule
    ? MOCK.topRules.filter(r => r.name === filters.rule)
    : MOCK.topRules;

  return (
    <DashboardWidget
      id={id}
      title="Aperçu des alertes"
      tool="Transverse"
      onRemove={onRemove}
      onSettings={onSettings}
    >
      <div className="space-y-4">
        <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 rounded-lg cursor-pointer" onClick={() => updateFilter('status', 'active')} title="Filtrer sur les alertes actives">
          <div className="flex items-center gap-2">
            <Bell className="w-5 h-5 text-orange-500" />
            <span className="font-medium">Alertes actives</span>
          </div>
          <Badge variant="outline" className="bg-orange-100 text-orange-800">{MOCK.active}</Badge>
        </div>
        <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 rounded-lg cursor-pointer" onClick={() => updateFilter('status', 'resolved')} title="Filtrer sur les alertes résolues">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-green-500" />
            <span className="font-medium">Alertes résolues</span>
          </div>
          <Badge variant="outline" className="bg-green-100 text-green-800">{MOCK.resolved}</Badge>
        </div>
        <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
          <div className="flex items-center gap-2 mb-2">
            <Flame className="w-5 h-5 text-red-500" />
            <span className="font-medium">Top règles déclenchées</span>
          </div>
          <ul className="space-y-1">
            {filteredTopRules.map((rule) => (
              <li key={rule.name} className="flex items-center justify-between cursor-pointer" onClick={() => updateFilter('rule', rule.name)} title={`Filtrer sur la règle : ${rule.name}`}>
                <span className="text-sm">{rule.name}</span>
                <Badge variant="outline" className="bg-red-100 text-red-800">{rule.count}</Badge>
              </li>
            ))}
          </ul>
        </div>
        {(filters.status || filters.rule) && (
          <div className="flex justify-end mt-2">
            <Button type="button" variant="outline" size="sm" onClick={resetFilters}>
              Réinitialiser les filtres
            </Button>
          </div>
        )}
      </div>
    </DashboardWidget>
  );
} 