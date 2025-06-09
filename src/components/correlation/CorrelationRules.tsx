import React from 'react';
import { useCorrelation } from '@/context/CorrelationContext';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Plus, Trash2, Edit2, AlertCircle, CheckCircle2 } from 'lucide-react';
import type { CorrelationRule } from '@/types/correlation';
import { CorrelationRuleForm } from './CorrelationRuleForm';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';

export function CorrelationRules() {
  const { rules, stats, toggleRule, deleteRule } = useCorrelation();
  const [isFormOpen, setIsFormOpen] = React.useState(false);
  const [selectedRule, setSelectedRule] = React.useState<CorrelationRule | undefined>();

  const handleNewRule = () => {
    setSelectedRule(undefined);
    setIsFormOpen(true);
  };

  const handleEditRule = (rule: CorrelationRule) => {
    setSelectedRule(rule);
    setIsFormOpen(true);
  };

  return (
    <div className="space-y-6">
      {/* En-tête avec statistiques */}
      <div className="flex items-center justify-between">
        <div>
          <p className="text-gray-500 dark:text-gray-400">
            {stats.activeRules} règles actives sur {stats.totalRules} au total
          </p>
        </div>
        <Button onClick={handleNewRule}>
          <Plus className="w-4 h-4 mr-2" />
          Nouvelle Règle
        </Button>
      </div>

      {/* Liste des règles */}
      <div className="grid gap-4">
        {rules.map(rule => (
          <Card key={rule.id} className="p-4">
            <div className="flex items-start justify-between">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <h3 className="font-semibold">{rule.name}</h3>
                  <Badge variant={rule.enabled ? "success" : "secondary"}>
                    {rule.enabled ? "Actif" : "Inactif"}
                  </Badge>
                </div>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {rule.description}
                </p>
                <div className="flex items-center gap-4 text-sm">
                  <div className="flex items-center gap-1">
                    <span className="font-medium">Source:</span>
                    <Badge variant="outline">{rule.source.tool}</Badge>
                    <Badge variant="outline">{rule.source.metric}</Badge>
                  </div>
                  <div className="flex items-center gap-1">
                    <span className="font-medium">Cible:</span>
                    <Badge variant="outline">{rule.target.tool}</Badge>
                    <Badge variant="outline">{rule.target.metric}</Badge>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Switch
                  checked={rule.enabled}
                  onCheckedChange={() => toggleRule(rule.id)}
                  aria-label={`Activer/désactiver la règle ${rule.name}`}
                />
                <Button variant="ghost" size="icon" onClick={() => handleEditRule(rule)}>
                  <Edit2 className="w-4 h-4" />
                </Button>
                <Button 
                  variant="ghost" 
                  size="icon"
                  onClick={() => deleteRule(rule.id)}
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </Card>
        ))}

        {rules.length === 0 && (
          <Card className="p-8 text-center">
            <AlertCircle className="w-12 h-12 mx-auto text-gray-400 mb-4" />
            <h3 className="text-lg font-medium mb-2">Aucune règle de corrélation</h3>
            <p className="text-gray-500 dark:text-gray-400 mb-4">
              Créez votre première règle pour commencer à corréler les données entre vos outils.
            </p>
            <Button onClick={handleNewRule}>
              <Plus className="w-4 h-4 mr-2" />
              Créer une Règle
            </Button>
          </Card>
        )}
      </div>

      <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>
              {selectedRule ? 'Modifier la Règle' : 'Créer une nouvelle règle'}
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
  );
} 