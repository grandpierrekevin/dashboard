import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { AlertRules } from './AlertRules';
import { AlertHistory } from './AlertHistory';

export function AlertingDashboard() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Alerting</h1>
      <p className="text-gray-600 dark:text-gray-400">
        Gérez vos règles d'alerte et suivez l'historique des alertes déclenchées.
      </p>

      <Tabs defaultValue="rules" className="space-y-4">
        <TabsList>
          <TabsTrigger value="rules">Règles d'Alerte</TabsTrigger>
          <TabsTrigger value="history">Historique</TabsTrigger>
        </TabsList>

        <TabsContent value="rules" className="space-y-4">
          <AlertRules />
        </TabsContent>

        <TabsContent value="history" className="space-y-4">
          <AlertHistory />
        </TabsContent>
      </Tabs>
    </div>
  );
} 