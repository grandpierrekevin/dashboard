import React from 'react';
import { rectSortingStrategy } from '@dnd-kit/sortable';
import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  useSortable,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { useIntegrations } from '@/context/IntegrationsContext';
import { GitHubSummaryWidget } from './widgets/GitHubSummaryWidget';
import { GitLabSummaryWidget } from './widgets/GitLabSummaryWidget';
import { JenkinsSummaryWidget } from './widgets/JenkinsSummaryWidget';
import { JiraSummaryWidget } from './widgets/JiraSummaryWidget';
import { SonarQubeSummaryWidget } from './widgets/SonarQubeSummaryWidget';
import { DevOpsSummaryWidget } from './widgets/DevOpsSummaryWidget';
import { DashboardWidgetConfigForm, WidgetConfig } from './DashboardWidgetConfigForm';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
// import { AlertsOverviewWidget } from './widgets/AlertsOverviewWidget';
import { Button } from '@/components/ui/button';


interface Widget {
  id: string;
  type: 'github' | 'gitlab' | 'jenkins' | 'jira' | 'sonarqube' | 'summary' ; //| 'alerts'
  position: number;
  config: WidgetConfig;
}

function SortableWidget({ id, children }: { id: string; children: React.ReactNode }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id });

  const style: React.CSSProperties = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.8 : 1,
    zIndex: isDragging ? 50 : 'auto',
    width: '100%',
    minWidth: 0,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="w-full box-border" 
    >
      <div className="w-full max-w-[500px] mx-auto">
        <div {...attributes} {...listeners} className="cursor-move p-2 text-center text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
          <div className="text-xs">↕️ Glisser pour réorganiser</div>
        </div>
        {children}
      </div>
    </div>
  );
}

function getDefaultWidgets(): Widget[] {
  return [
    { id: '1', type: 'github', position: 0, config: { title: 'GitHub', period: 7, metrics: [] } },
    { id: '2', type: 'jenkins', position: 1, config: { title: 'Jenkins', period: 7, metrics: [] } },
    { id: '3', type: 'jira', position: 2, config: { title: 'Jira', period: 7, metrics: [] } },
    { id: '4', type: 'sonarqube', position: 3, config: { title: 'SonarQube', period: 7, metrics: [] } },
    { id: '5', type: 'summary', position: 4, config: { title: 'DevOps Summary', period: 7, metrics: [] } },
    // { id: '6', type: 'alerts', position: 5 },
  ];
}

function useWidgets() {
  const [widgets, setWidgets] = React.useState<Widget[]>(() => {
    try {
      const saved = localStorage.getItem('dashboard-widgets-v1');
      if (saved) {
        const parsedWidgets = JSON.parse(saved);
        // Vérifier et corriger les widgets qui n'ont pas de configuration
        const correctedWidgets = parsedWidgets.map((w: any) => {
          if (!w.config || typeof w.config !== 'object') {
            return {
              ...w,
              config: { 
                title: w.type || 'Widget', 
                period: 7, 
                metrics: [] 
              }
            };
          }
          return w;
        });
        return correctedWidgets;
      }
      return getDefaultWidgets();
    } catch (error) {
      console.error('Erreur chargement widgets:', error);
      return getDefaultWidgets();
    }
  });

  React.useEffect(() => {
    localStorage.setItem('dashboard-widgets-v1', JSON.stringify(widgets));
  }, [widgets]);

  const addWidget = React.useCallback((type: Widget['type']) => {
    setWidgets(prev => [...prev, {
      id: Date.now().toString(),
      type,
      position: prev.length,
      config: { title: `Widget ${type}`, period: 7, metrics: [] }
    }]);
  }, []);

  const removeWidget = React.useCallback((id: string) => {
    setWidgets(prev => prev.filter(w => w.id !== id));
  }, []);

  const reorderWidgets = React.useCallback((oldIndex: number, newIndex: number) => {
    setWidgets(prev =>
      arrayMove(prev, oldIndex, newIndex).map((w, i) => ({ ...w, position: i }))
    );
  }, []);

  const updateWidgetConfig = React.useCallback((id: string, config: WidgetConfig) => {
    setWidgets(prev => {
      const newWidgets = prev.map(w => 
        w.id === id ? { ...w, config } : w
      );
      return newWidgets;
    });
  }, []);

  return { widgets, addWidget, removeWidget, reorderWidgets, updateWidgetConfig };
}

export default function Dashboard() {
  const { widgets, addWidget, removeWidget, reorderWidgets, updateWidgetConfig } = useWidgets();
  const { integrations } = useIntegrations();
  const [settingsWidgetId, setSettingsWidgetId] = React.useState<string | null>(null);

  React.useEffect(() => {
    const activeTypes = integrations.filter(i => i.active).map(i => i.name.toLowerCase());
    if (activeTypes.length > 0) {
      activeTypes.push('summary'); //, 'alerts'
    }
    activeTypes.forEach(type => {
      const widgetsOfType = widgets.filter(w => w.type === type);
      if (widgetsOfType.length === 0) {
        addWidget(type as Widget['type']);
      } else if (widgetsOfType.length > 1) {
        widgetsOfType.slice(1).forEach(w => removeWidget(w.id));
      }
    });
  }, [integrations, widgets, addWidget, removeWidget]);

  const activeTypes = integrations.filter(i => i.active).map(i => i.name.toLowerCase());
  if (activeTypes.length > 0) {
    activeTypes.push('summary'); // , 'alerts'
  }
  const visibleWidgets = widgets.filter(w => activeTypes.includes(w.type));

  const handleRemoveWidget = (id: string) => removeWidget(id);
  const handleSettings = (id: string) => {
    setSettingsWidgetId(id);
  };

  function getWidgetComponent(type: Widget['type'], id: string) {
    const widget = widgets.find(w => w.id === id);
    // Vérification de sécurité pour s'assurer que la configuration existe
    if (!widget || !widget.config) {
      console.warn(`Widget ${id} n'a pas de configuration valide, utilisation des valeurs par défaut`);
      const defaultConfig = { title: type, period: 7, metrics: [] };
      // Mettre à jour le widget avec une configuration par défaut
      setTimeout(() => updateWidgetConfig(id, defaultConfig), 0);
      const commonProps = { id, title: type, onRemove: handleRemoveWidget, onSettings: handleSettings };
      switch (type) {
        case 'github': return <GitHubSummaryWidget {...commonProps} />;
        case 'gitlab': return <GitLabSummaryWidget {...commonProps} />;
        case 'jenkins': return <JenkinsSummaryWidget {...commonProps} />;
        case 'jira': return <JiraSummaryWidget {...commonProps} />;
        case 'sonarqube': return <SonarQubeSummaryWidget {...commonProps} />;
        case 'summary': return <DevOpsSummaryWidget {...commonProps} />;
        default: return null;
      }
    }
    
    const title = widget.config.title || type;
    const commonProps = { id, title, onRemove: handleRemoveWidget, onSettings: handleSettings };
    switch (type) {
      case 'github': return <GitHubSummaryWidget {...commonProps} />;
      case 'gitlab': return <GitLabSummaryWidget {...commonProps} />;
      case 'jenkins': return <JenkinsSummaryWidget {...commonProps} />;
      case 'jira': return <JiraSummaryWidget {...commonProps} />;
      case 'sonarqube': return <SonarQubeSummaryWidget {...commonProps} />;
      case 'summary': return <DevOpsSummaryWidget {...commonProps} />;
      // case 'alerts': return <AlertsOverviewWidget {...commonProps} />;
      default: return null;
    }
  }

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { delay: 100, tolerance: 5 },
    })
  );

  const handleDragEnd = (event: any) => {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      const oldIndex = widgets.findIndex(w => w.id === active.id);
      const newIndex = widgets.findIndex(w => w.id === over.id);
      if (oldIndex !== -1 && newIndex !== -1) {
        reorderWidgets(oldIndex, newIndex);
      }
    }
  };

  const handleConfigSubmit = (config: WidgetConfig) => {
    if (settingsWidgetId) {
      updateWidgetConfig(settingsWidgetId, config);
    }
    setSettingsWidgetId(null);
  };

  const currentWidget = widgets.find(w => w.id === settingsWidgetId);

  return (
    <div className="container mx-auto p-4">
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <SortableContext
          items={visibleWidgets.map(w => w.id)}
          strategy={rectSortingStrategy}
        >
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 w-full items-start justify-items-center">
            {visibleWidgets.map(widget => (
              <SortableWidget key={widget.id} id={widget.id}>
                {getWidgetComponent(widget.type, widget.id)}
              </SortableWidget>
            ))}
          </div>
        </SortableContext>
      </DndContext>

      <Dialog open={!!settingsWidgetId} onOpenChange={() => setSettingsWidgetId(null)}>
        <DialogContent className='bg-gray-900'>
          <DialogHeader>
            <DialogTitle>Configurer le widget</DialogTitle>
            <DialogDescription>
              Modifiez les paramètres de configuration de ce widget
            </DialogDescription>
          </DialogHeader>
          {currentWidget && currentWidget.config && (
            <DashboardWidgetConfigForm
              initialConfig={currentWidget.config}
              availableMetrics={[
                { key: 'metric1', label: 'Métrique 1' },
                { key: 'metric2', label: 'Métrique 2' },
              ]}
              onSubmit={handleConfigSubmit}
              onCancel={() => setSettingsWidgetId(null)}
            />
          )}
          {currentWidget && !currentWidget.config && (
            <div className="p-4 text-center">
              <p className="text-red-600 mb-4">Configuration du widget corrompue</p>
              <Button onClick={() => {
                const defaultConfig = { title: currentWidget.type, period: 7, metrics: [] };
                updateWidgetConfig(currentWidget.id, defaultConfig);
                setSettingsWidgetId(null);
              }}>
                Restaurer la configuration par défaut
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
