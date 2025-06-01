import React from 'react';
import { useCorrelation } from '@/context/CorrelationContext';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowRight, CheckCircle2, AlertCircle, X, Search, Calendar } from 'lucide-react';
import { useDashboardFilters } from '@/context/DashboardFilterContext';
import { TOOL_LABELS, ToolType } from '@/constants/tools';
import { STATUS_LABELS, StatusType } from '@/constants/status';

export function CorrelationTimeline() {
  const { results, rules } = useCorrelation();
  const [selectedEvent, setSelectedEvent] = React.useState<{
    type: 'source' | 'target';
    resultId: string;
  } | null>(null);
  const [search, setSearch] = React.useState('');
  const [filterTool, setFilterTool] = React.useState<ToolType | ''>('');
  const [filterStatus, setFilterStatus] = React.useState<StatusType | ''>('');
  const [startDate, setStartDate] = React.useState('');
  const [endDate, setEndDate] = React.useState('');
  const { filters, updateFilter } = useDashboardFilters();

  const handleEventClick = (type: 'source' | 'target', resultId: string) => {
    setSelectedEvent({ type, resultId });
  };

  const closeDrawer = () => setSelectedEvent(null);

  const getEventDetails = () => {
    if (!selectedEvent) return null;
    const result = results.find(r => r.id === selectedEvent.resultId);
    const rule = result ? rules.find(rul => rul.id === result.ruleId) : null;
    if (!result || !rule) return null;
    const eventData = selectedEvent.type === 'source' ? result.sourceData : result.targetData;
    const tool = selectedEvent.type === 'source' ? rule.source.tool : rule.target.tool;
    const metric = selectedEvent.type === 'source' ? rule.source.metric : rule.target.metric;
    return { eventData, tool, metric, result, rule };
  };

  // Filtres dynamiques
  const filteredResults = results.filter((item) => {
    // Filtres locaux (search, tool, status, date, etc.)
    const matchesLocal =
      (!search || item.title.toLowerCase().includes(search.toLowerCase())) &&
      (!filterTool || item.tool === filterTool) &&
      (!filterStatus || item.status === filterStatus) &&
      (!startDate || new Date(item.timestamp) >= new Date(startDate)) &&
      (!endDate || new Date(item.timestamp) <= new Date(endDate));
    // Filtres globaux (cross-filtering)
    const matchesGlobal =
      (!filters.status || item.status === filters.status || (filters.status === 'active' && item.status === 'active') || (filters.status === 'failure' && item.status === 'failure') || (filters.status === 'resolved' && item.status === 'resolved') || (filters.status === 'critical-bug' && item.status === 'critical-bug')) &&
      (!filters.tool || item.tool === filters.tool) &&
      (!filters.rule || (item.rule && item.rule === filters.rule));
    return matchesLocal && matchesGlobal;
  });

  if (!results.length) {
    return (
      <Card className="p-8 text-center">
        <AlertCircle className="w-12 h-12 mx-auto text-gray-400 mb-4" />
        <h3 className="text-lg font-medium mb-2">Aucune corrélation détectée</h3>
        <p className="text-gray-500 dark:text-gray-400 mb-4">
          Les chaînes d'événements corrélés s'afficheront ici dès qu'une règle sera déclenchée.
        </p>
      </Card>
    );
  }

  const eventDetails = getEventDetails();

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold mb-2">Timeline des Corrélations</h2>
      {/* Barre de recherche et filtres */}
      <div className="flex flex-wrap gap-3 items-center mb-4">
        <div className="relative">
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Rechercher une règle, un outil, une métrique..."
            className="pl-8 pr-3 py-2 rounded border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <Search className="absolute left-2 top-2.5 w-4 h-4 text-gray-400" />
        </div>
        <select
          value={filterTool}
          onChange={e => setFilterTool(e.target.value as ToolType | '')}
          className="px-2 py-2 rounded border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-sm"
        >
          <option value="">Tous les outils</option>
          {Object.entries(TOOL_LABELS).map(([tool, label]) => (
            <option key={tool} value={tool}>{label}</option>
          ))}
        </select>
        <select
          value={filterStatus}
          onChange={e => setFilterStatus(e.target.value as StatusType | '')}
          className="px-2 py-2 rounded border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-sm"
        >
          <option value="">Tous les statuts</option>
          {Object.entries(STATUS_LABELS).map(([status, label]) => (
            <option key={status} value={status}>{label}</option>
          ))}
        </select>
        <div className="flex items-center gap-2">
          <Calendar className="w-4 h-4 text-gray-400" />
          <input
            type="date"
            value={startDate}
            onChange={e => setStartDate(e.target.value)}
            className="px-2 py-2 rounded border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-sm"
          />
          <span>à</span>
          <input
            type="date"
            value={endDate}
            onChange={e => setEndDate(e.target.value)}
            className="px-2 py-2 rounded border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-sm"
          />
        </div>
      </div>
      {filteredResults.length === 0 && (
        <Card className="p-8 text-center">
          <AlertCircle className="w-8 h-8 mx-auto text-gray-400 mb-2" />
          <div className="text-gray-500 dark:text-gray-400">Aucun résultat ne correspond à vos filtres.</div>
        </Card>
      )}
      {filteredResults.map(result => {
        const rule = rules.find(r => r.id === result.ruleId);
        return (
          <Card key={result.id} className="p-4 flex items-center gap-4">
            {/* Source */}
            <div
              className="flex flex-col items-center min-w-[120px] cursor-pointer hover:underline"
              onClick={() => handleEventClick('source', result.id)}
              title="Voir le détail de l'événement source"
            >
              <span className="font-semibold text-sm text-gray-700 dark:text-gray-200">{rule ? TOOL_LABELS[rule.source.tool] : ''}</span>
              <Badge variant="outline">{rule?.source.metric}</Badge>
              <span className="text-xs text-gray-500 mt-1">{JSON.stringify(result.sourceData)}</span>
            </div>
            {/* Flèche */}
            <ArrowRight className="w-6 h-6 text-gray-400" />
            {/* Cible */}
            <div
              className="flex flex-col items-center min-w-[120px] cursor-pointer hover:underline"
              onClick={() => handleEventClick('target', result.id)}
              title="Voir le détail de l'événement cible"
            >
              <span className="font-semibold text-sm text-gray-700 dark:text-gray-200">{rule ? TOOL_LABELS[rule.target.tool] : ''}</span>
              <Badge variant="outline">{rule?.target.metric}</Badge>
              <span className="text-xs text-gray-500 mt-1">{JSON.stringify(result.targetData)}</span>
            </div>
            {/* Statut */}
            <div className="flex flex-col items-center min-w-[80px]">
              {result.status === 'success' ? (
                <CheckCircle2 className="w-6 h-6 text-green-500" />
              ) : (
                <AlertCircle className="w-6 h-6 text-red-500" />
              )}
              <span className="text-xs mt-1">{STATUS_LABELS[result.status as StatusType] || result.status}</span>
            </div>
            {/* Timestamp */}
            <div className="ml-auto text-xs text-gray-400">
              {new Date(result.timestamp).toLocaleString()}
            </div>
          </Card>
        );
      })}
      {/* Drawer latéral pour détails d'événement */}
      {selectedEvent && eventDetails && (
        <div className="fixed inset-0 z-50 flex">
          <div className="flex-1 bg-black/30" onClick={closeDrawer} />
          <div className="w-[400px] bg-white dark:bg-gray-900 shadow-xl p-6 flex flex-col relative animate-in slide-in-from-right">
            <button
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-900"
              onClick={closeDrawer}
              aria-label="Fermer"
            >
              <X size={22} />
            </button>
            <h3 className="text-xl font-bold mb-2">Détail de l'événement</h3>
            <div className="mb-4">
              <span className="font-semibold">Outil :</span> {eventDetails.tool}<br />
              <span className="font-semibold">Métrique :</span> {eventDetails.metric}<br />
              <span className="font-semibold">Données :</span>
              <pre className="bg-gray-100 dark:bg-gray-800 rounded p-2 mt-1 text-xs overflow-x-auto">
                {JSON.stringify(eventDetails.eventData, null, 2)}
              </pre>
            </div>
            <div className="mb-4">
              <span className="font-semibold">Corrélation :</span> {eventDetails.rule.name}
            </div>
            <div className="mb-4">
              <span className="font-semibold">Statut :</span> {eventDetails.result.status}
            </div>
            <div className="mb-4">
              <span className="font-semibold">Timestamp :</span> {new Date(eventDetails.result.timestamp).toLocaleString()}
            </div>
            <div className="flex flex-col gap-2 mt-2">
              <button
                className="text-blue-600 hover:underline text-left"
                onClick={() => updateFilter('tool', eventDetails.tool)}
              >
                Filtrer la timeline sur l'outil : <b>{eventDetails.tool}</b>
              </button>
              <button
                className="text-blue-600 hover:underline text-left"
                onClick={() => updateFilter('rule', eventDetails.rule.name)}
              >
                Filtrer la timeline sur la règle : <b>{eventDetails.rule.name}</b>
              </button>
              <a
                href="#correlation-rule-list"
                className="text-blue-600 hover:underline text-left"
                onClick={closeDrawer}
              >
                Voir la règle dans la liste
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 