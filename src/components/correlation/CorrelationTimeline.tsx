import React from 'react';
import { useCorrelation } from '@/context/CorrelationContext';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowRight, CheckCircle2, AlertCircle, X, Search, Calendar, Bug, ShieldCheck, GitBranch, FileText, CalendarDays, User, Hash, AlertTriangle } from 'lucide-react';
import { useDashboardFilters } from '@/context/DashboardFilterContext';
import { TOOL_LABELS, ToolType } from '@/constants/tools';
import { STATUS_LABELS, StatusType } from '@/constants/status';

// Fonction utilitaire pour obtenir une icône selon le champ
function getFieldIcon(key: string) {
  switch (key) {
    case 'project': return <ShieldCheck className="inline w-4 h-4 mr-1 text-blue-500" />;
    case 'jobName': return <GitBranch className="inline w-4 h-4 mr-1 text-purple-500" />;
    case 'ticketId': return <FileText className="inline w-4 h-4 mr-1 text-yellow-500" />;
    case 'vulnerabilities': return <AlertTriangle className="inline w-4 h-4 mr-1 text-red-500" />;
    case 'buildNumber': return <Hash className="inline w-4 h-4 mr-1 text-gray-500" />;
    case 'status': return <CheckCircle2 className="inline w-4 h-4 mr-1 text-green-500" />;
    case 'date':
    case 'timestamp': return <CalendarDays className="inline w-4 h-4 mr-1 text-gray-400" />;
    case 'author': return <User className="inline w-4 h-4 mr-1 text-indigo-500" />;
    default: return null;
  }
}

// Fonction utilitaire pour obtenir une icône d'outil
function getToolIcon(tool: string) {
  switch (tool) {
    case 'SONARQUBE': return <ShieldCheck className="inline w-5 h-5 text-blue-600 mr-1" />;
    case 'JENKINS': return <GitBranch className="inline w-5 h-5 text-purple-600 mr-1" />;
    case 'JIRA': return <FileText className="inline w-5 h-5 text-yellow-600 mr-1" />;
    default: return null;
  }
}

// Fonction utilitaire pour harmoniser et aligner les champs source/cible dans un tableau
function renderCorrelationTable(source: Record<string, any>, target: Record<string, any>, sourceTool: string, targetTool: string) {
  const fieldDefs: { key: string, label: string, showForSource?: boolean, showForTarget?: boolean }[] = [
    { key: 'project', label: 'Projet', showForSource: sourceTool === 'SONARQUBE' },
    { key: 'jobName', label: 'Job', showForSource: sourceTool === 'JENKINS', showForTarget: targetTool === 'JENKINS' },
    { key: 'ticketId', label: 'Ticket', showForTarget: targetTool === 'JIRA' },
    { key: 'vulnerabilities', label: 'Vulnérabilités', showForSource: sourceTool === 'SONARQUBE' },
    { key: 'buildNumber', label: 'Numéro de build', showForSource: sourceTool === 'JENKINS', showForTarget: targetTool === 'JENKINS' },
    { key: 'status', label: 'Statut', showForSource: true, showForTarget: true },
    { key: 'date', label: 'Date', showForSource: true, showForTarget: true },
    { key: 'timestamp', label: 'Horodatage', showForSource: true, showForTarget: true },
    { key: 'author', label: 'Auteur', showForSource: true, showForTarget: true },
    { key: 'description', label: 'Description', showForSource: true, showForTarget: true },
  ];

  // Préparer les valeurs à afficher (formatage date, fallback "—")
  function formatValue(key: string, value: any) {
    if (!value) return '—';
    if (key === 'timestamp' || key === 'date') {
      try {
        return new Date(value).toLocaleString();
      } catch {
        return value;
      }
    }
    return value;
  }

  // Construire la liste des champs à afficher (uniquement ceux présents dans source ou target)
  const allKeys = Array.from(new Set([
    ...fieldDefs.filter(f => f.showForSource || f.showForTarget).map(f => f.key),
    ...Object.keys(source),
    ...Object.keys(target)
  ]));

  // Générer le tableau aligné
  return (
    <table className="w-full text-xs border-separate border-spacing-y-0.5">
      <thead>
        <tr>
          <th className="text-left font-semibold text-gray-700 dark:text-gray-200 w-1/3 pb-2">{getToolIcon(sourceTool)}{TOOL_LABELS[sourceTool as ToolType]}</th>
          <th className="text-center font-semibold text-gray-400 w-1/3 pb-2">Champ</th>
          <th className="text-left font-semibold text-gray-700 dark:text-gray-200 w-1/3 pb-2">{getToolIcon(targetTool)}{TOOL_LABELS[targetTool as ToolType]}</th>
        </tr>
      </thead>
      <tbody>
        {allKeys.map((key, idx) => {
          const def = fieldDefs.find(f => f.key === key);
          const label = def ? def.label : key.charAt(0).toUpperCase() + key.slice(1);
          const sourceVal = formatValue(key, source[key]);
          const targetVal = formatValue(key, target[key]);
          if (sourceVal === '—' && targetVal === '—') return null;
          // Couleur de fond alternée
          const rowBg = idx % 2 === 0 ? 'bg-gray-50 dark:bg-gray-800' : 'bg-white dark:bg-gray-900';
          // Couleur de statut
          const statusColor = (val: any) => val === 'success' || val === 'succès' ? 'text-green-600 font-semibold' : val === 'failed' || val === 'échec' ? 'text-red-600 font-semibold' : '';
          return (
            <tr key={key} className={rowBg + ' align-top'}>
              <td className={"pr-2 py-1 text-gray-900 dark:text-gray-100 rounded-l " + (key === 'status' ? statusColor(sourceVal) : '')}>{sourceVal}</td>
              <td className="px-2 py-1 text-center text-gray-500 dark:text-gray-400 whitespace-nowrap">{getFieldIcon(key)}{label}</td>
              <td className={"pl-2 py-1 text-gray-900 dark:text-gray-100 rounded-r " + (key === 'status' ? statusColor(targetVal) : '')}>{targetVal}</td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
}

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
    const rule = rules.find(r => r.id === item.ruleId);
    // Filtres locaux (search, tool, status, date, etc.)
    const matchesLocal =
      (!search || rule?.name.toLowerCase().includes(search.toLowerCase())) &&
      (!filterTool || rule?.source.tool === filterTool || rule?.target.tool === filterTool) &&
      (!filterStatus || item.status === filterStatus) &&
      (!startDate || new Date(item.timestamp) >= new Date(startDate)) &&
      (!endDate || new Date(item.timestamp) <= new Date(endDate));
    // Filtres globaux (cross-filtering)
    const matchesGlobal =
      (!filters.status || item.status === filters.status) &&
      (!filters.tool || rule?.source.tool === filters.tool || rule?.target.tool === filters.tool) &&
      (!filters.rule || (rule?.name === filters.rule));
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
        if (!rule) return null;
        return (
          <Card key={result.id} className="p-4 flex flex-col gap-2">
            <div className="flex flex-row items-center gap-4">
              <div className="flex flex-col items-center min-w-[120px]">
                <span className="font-semibold text-sm text-gray-700 dark:text-gray-200">{TOOL_LABELS[rule.source.tool as ToolType]}</span>
                <Badge variant="outline">{rule.source.metric}</Badge>
              </div>
              <ArrowRight className="w-6 h-6 text-gray-400" />
              <div className="flex flex-col items-center min-w-[120px]">
                <span className="font-semibold text-sm text-gray-700 dark:text-gray-200">{TOOL_LABELS[rule.target.tool as ToolType]}</span>
                <Badge variant="outline">{rule.target.metric}</Badge>
              </div>
              <div className="flex flex-col items-center min-w-[80px]">
                {result.status === 'success' ? (
                  <CheckCircle2 className="w-6 h-6 text-green-500" />
                ) : (
                  <AlertCircle className="w-6 h-6 text-red-500" />
                )}
                <span className="text-xs mt-1">{STATUS_LABELS[result.status as StatusType] || result.status}</span>
              </div>
              <div className="ml-auto text-xs text-gray-400">
                {new Date(result.timestamp).toLocaleString()}
              </div>
            </div>
            <div className="mt-2">
              {renderCorrelationTable(result.sourceData, result.targetData, rule.source.tool, rule.target.tool)}
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