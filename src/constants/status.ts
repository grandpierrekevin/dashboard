export type StatusType = 'success' | 'failure' | 'pending' | 'active' | 'resolved' | 'critical-bug';

export const STATUS_LABELS: Record<StatusType, string> = {
  success: 'Succès',
  failure: 'Échec',
  pending: 'En attente',
  active: 'Active',
  resolved: 'Résolue',
  'critical-bug': 'Bug critique',
}; 