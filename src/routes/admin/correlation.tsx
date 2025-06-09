import React from 'react';
import { createFileRoute } from '@tanstack/react-router';
import { CorrelationRules } from '@/components/correlation/CorrelationRules';
import { CorrelationTimeline } from '@/components/correlation/CorrelationTimeline';
import { DashboardFilterProvider } from '@/context/DashboardFilterContext';
import { HelpTooltip } from '@/components/ui/help-tooltip';
import { HELP_TEXTS } from '@/constants/help-texts';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export const Route = createFileRoute('/admin/correlation')({
  component: CorrelationPage,
});

function CorrelationPage() {
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
      </div>
    </DashboardFilterProvider>
  );
} 