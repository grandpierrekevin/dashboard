"use client"

import React from 'react';
import { Button } from '@/components/ui/button';

export interface WidgetConfig {
  title: string;
  period: number;
  metrics: string[];
}

interface DashboardWidgetConfigFormProps {
  initialConfig: WidgetConfig;
  availableMetrics: { key: string; label: string }[];
  onSubmit: (config: WidgetConfig) => void;
  onCancel: () => void;
}

export function DashboardWidgetConfigForm({ initialConfig, availableMetrics, onSubmit, onCancel }: DashboardWidgetConfigFormProps) {
  const [title, setTitle] = React.useState(initialConfig.title);
  const [period, setPeriod] = React.useState(initialConfig.period);
  const [metrics, setMetrics] = React.useState<string[]>(initialConfig.metrics);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({ title, period, metrics });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium mb-1">Titre du widget</label>
        <input
          className="w-full border rounded px-2 py-1 bg-white dark:bg-gray-900"
          value={title}
          onChange={e => setTitle(e.target.value)}
        />
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">Période</label>
        <select
          className="w-full border rounded px-2 py-1 bg-white dark:bg-gray-900"
          value={period}
          onChange={e => setPeriod(Number(e.target.value))}
        >
          <option value={7}>7 jours</option>
          <option value={14}>14 jours</option>
          <option value={30}>30 jours</option>
        </select>
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">Métriques à afficher</label>
        <div className="flex flex-col gap-1">
          {availableMetrics.map((metric) => (
            <label key={metric.key} className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={metrics.includes(metric.key)}
                onChange={() => {
                  setMetrics((prev) =>
                    prev.includes(metric.key) ? prev.filter((m) => m !== metric.key) : [...prev, metric.key]
                  );
                }}
              />
              {metric.label}
            </label>
          ))}
        </div>
      </div>
      <div className="flex gap-2 justify-end">
        <Button type="button" className='bg-red-500' onClick={onCancel}>Annuler</Button>
        <Button type="submit" className='bg-green-600'>Enregistrer</Button>
      </div>
    </form>
  );
} 