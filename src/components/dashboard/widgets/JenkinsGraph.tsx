import React from 'react';
import { useWidgetData } from '@/hooks/useWidgetData';
import { LineChart, Line, XAxis, YAxis, Tooltip as RechartsTooltip, ResponsiveContainer, CartesianGrid, BarChart, Bar } from 'recharts';
import { JenkinsBuild } from '@/types/mocks';

function isJenkinsBuild(data: any): data is JenkinsBuild {
  return 'job' in data && 'status' in data && 'date' in data;
}

export function JenkinsGraph() {
  const { data, loading, error } = useWidgetData({ type: 'jenkins' });
  const [chartType, setChartType] = React.useState<'line' | 'bar'>('line');

  const jobs = Array.isArray(data) ? data.filter(isJenkinsBuild) : [];
  const days = ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'];
  const activity = days.map(day => ({
    date: day,
    builds: jobs.filter(job => job.date === day).length
  }));

  if (loading) return <div className="h-64 animate-pulse bg-muted rounded" />;
  if (error) return <div className="text-red-500">{error.message}</div>;

  return (
    <div className="w-full bg-[#181C23] rounded-xl p-6 shadow-lg mb-8">
      <div className="flex items-center justify-between mb-2">
        <h2 className="text-2xl font-bold">Activité Jenkins sur 7 jours</h2>
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
              <Line type="monotone" dataKey="builds" stroke="#22c55e" name="Builds" strokeWidth={2} />
            </LineChart>
          ) : (
            <BarChart data={activity}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis allowDecimals={false} />
              <RechartsTooltip />
              <Bar dataKey="builds" fill="#22c55e" name="Builds" />
            </BarChart>
          )}
        </ResponsiveContainer>
      </div>
    </div>
  );
} 