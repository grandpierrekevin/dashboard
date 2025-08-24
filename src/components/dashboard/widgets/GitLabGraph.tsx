import React from 'react';
import { useWidgetData } from '@/hooks/useWidgetData';
import { LineChart, Line, XAxis, YAxis, Tooltip as RechartsTooltip, ResponsiveContainer, CartesianGrid, BarChart, Bar } from 'recharts';

export function GitLabGraph() {
  const { data, loading, error } = useWidgetData({ type: 'gitlab' });
  const [chartType, setChartType] = React.useState<'line' | 'bar'>('line');

  const projects = Array.isArray(data) ? data : [];
  const days = ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'];
  const activity = days.map(day => ({
    date: day,
    commits: projects
      .filter((p: any) => Array.isArray(p.activity))
      .reduce((sum, p: any) => {
        const found = p.activity.find((a: any) => a.date === day);
        return sum + (found?.commits || 0);
      }, 0)
  }));

  if (loading) return <div className="h-64 animate-pulse bg-muted rounded" />;
  if (error) return <div className="text-red-500">{error.message}</div>;

  return (
    <div className="w-full bg-[#181C23] rounded-xl p-6 shadow-lg mb-8">
      <div className="flex items-center justify-between mb-2">
        <h2 className="text-2xl font-bold">Activité GitLab sur 7 jours</h2>
        <select
          className="w-[90px] h-7 text-xs bg-gray-600 border rounded"
          value={chartType}
          onChange={e => setChartType(e.target.value as 'line' | 'bar')}
        >
          <option value="line">Ligne</option>
          <option value="bar">Barres</option>
        </select>
      </div>
      <div className="h-64 w-full">
        <ResponsiveContainer width="100%" height="100%">
          {chartType === 'line' ? (
            <LineChart data={activity}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis allowDecimals={false} />
              <RechartsTooltip />
              <Line type="monotone" dataKey="commits" stroke="#22c55e" name="Commits" strokeWidth={2} />
            </LineChart>
          ) : (
            <BarChart data={activity}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis allowDecimals={false} />
              <RechartsTooltip />
              <Bar dataKey="commits" fill="#22c55e" name="Commits" />
            </BarChart>
          )}
        </ResponsiveContainer>
      </div>
    </div>
  );
} 