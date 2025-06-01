import React from 'react';
import { createFileRoute } from '@tanstack/react-router';
import { CorrelationRules } from '@/components/correlation/CorrelationRules';
import { CorrelationRuleForm } from '@/components/correlation/CorrelationRuleForm';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Plus, Info } from 'lucide-react';
import type { CorrelationRule } from '@/types/correlation';
import { CorrelationTimeline } from '@/components/correlation/CorrelationTimeline';
import { DashboardFilterProvider } from '@/context/DashboardFilterContext';
import { HelpTooltip } from '@/components/ui/help-tooltip';
import { HELP_TEXTS } from '@/constants/help-texts';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export const Route = createFileRoute('/admin/correlation')({
  component: CorrelationPage,
});

function CorrelationPage() {
  const [isFormOpen, setIsFormOpen] = React.useState(false);
  const [selectedRule, setSelectedRule] = React.useState<CorrelationRule | undefined>();

  return (
    <DashboardFilterProvider>
      <div className="container mx-auto py-6 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-3xl font-bold">Corrélation des Outils</h1>
              <HelpTooltip content={HELP_TEXTS.correlation.overview} />
            </div>
            <p className="text-muted-foreground mt-2">
              Créez des règles pour corréler les événements entre vos différents outils DevOps
            </p>
          </div>
          <Button onClick={() => {
            setSelectedRule(undefined);
            setIsFormOpen(true);
          }}>
            <Plus className="w-4 h-4 mr-2" />
            Nouvelle Règle
          </Button>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <CardTitle>Règles de Corrélation</CardTitle>
                  <HelpTooltip content={HELP_TEXTS.correlation.rules} />
                </div>
              </div>
              <CardDescription>
                Gérez vos règles de corrélation entre les différents outils
              </CardDescription>
            </CardHeader>
            <CardContent>
              <CorrelationRules />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <CardTitle>Timeline des Événements</CardTitle>
                  <HelpTooltip content={HELP_TEXTS.correlation.timeline} />
                </div>
              </div>
              <CardDescription>
                Suivez l'historique des événements corrélés
              </CardDescription>
            </CardHeader>
            <CardContent>
              <CorrelationTimeline />
            </CardContent>
          </Card>
        </div>

        <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>
                {selectedRule ? 'Modifier la Règle' : 'Nouvelle Règle'}
              </DialogTitle>
            </DialogHeader>
            <CorrelationRuleForm
              rule={selectedRule}
              onClose={() => {
                setIsFormOpen(false);
                setSelectedRule(undefined);
              }}
            />
          </DialogContent>
        </Dialog>
      </div>
    </DashboardFilterProvider>
  );
} 