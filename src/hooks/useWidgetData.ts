import { useState, useEffect } from 'react';
import { GithubRepoActivity } from '@/types/mocks';
import { GitlabPipeline } from '@/types/mocks';
import { JenkinsBuild } from '@/types/mocks';
import { JiraTicket } from '@/types/mocks';
import { SonarMetric } from '@/types/mocks';
import { widgetService, WidgetType } from '@/services/widgetService';

export type WidgetDataType = GithubRepoActivity[] | GitlabPipeline[] | JenkinsBuild[] | JiraTicket[] | SonarMetric[];

interface UseWidgetDataOptions {
  type: WidgetType;
  refreshInterval?: number;
}

export function useWidgetData({ type, refreshInterval = 300000 }: UseWidgetDataOptions) {
  const [data, setData] = useState<WidgetDataType | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);
      const widgetData = await widgetService.getWidgetData(type);
      if (!widgetData || !Array.isArray(widgetData)) {
        throw new Error('Les données reçues ne sont pas valides');
      }
      setData(widgetData);
    } catch (err) {
      console.error('Erreur lors de la récupération des données:', err);
      setError(err instanceof Error ? err : new Error('Une erreur est survenue lors de la récupération des données'));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();

    if (refreshInterval > 0) {
      const interval = setInterval(fetchData, refreshInterval);
      return () => clearInterval(interval);
    }
  }, [type, refreshInterval]);

  return { data, loading, error, refetch: fetchData };
} 