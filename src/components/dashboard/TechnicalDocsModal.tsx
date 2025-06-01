import React from 'react';
import { X, BookOpen, Link as LinkIcon } from 'lucide-react';

interface TechnicalDocsModalProps {
  open: boolean;
  onClose: () => void;
}

export function TechnicalDocsModal({ open, onClose }: TechnicalDocsModalProps) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-900 p-8 rounded-lg shadow-lg max-w-2xl w-full relative">
        <button className="absolute top-4 right-4 text-gray-400 hover:text-gray-700" onClick={onClose}><X size={22} /></button>
        <h2 className="text-xl font-bold mb-4 flex items-center gap-2"><BookOpen className="w-5 h-5" /> Documentation technique</h2>
        <div className="space-y-6 text-sm">
          <div>
            <strong>API REST - Exemples</strong>
            <pre className="bg-gray-100 dark:bg-gray-800 rounded p-2 mt-2 text-xs overflow-x-auto">
GET /api/alerts
GET /api/correlation/results
POST /api/alerts { "ruleId": "...", "status": "active" }
            </pre>
          </div>
          <div>
            <strong>Webhooks</strong>
            <pre className="bg-gray-100 dark:bg-gray-800 rounded p-2 mt-2 text-xs overflow-x-auto">
POST https://votre-cockpit.devops.com/webhook
Headers: X-API-KEY: ...
Body: { "event": "build_failed", "tool": "jenkins", ... }
            </pre>
          </div>
          <div>
            <strong>Intégration SaaS / On-premise</strong>
            <ul className="list-disc ml-6 mt-2">
              <li>Déploiement Docker, Kubernetes, ou VM</li>
              <li>Configuration des connecteurs (GitHub, Jenkins, Jira, SonarQube...)</li>
              <li>Gestion des secrets/API keys via variables d'environnement</li>
              <li>Support multi-tenant (à activer dans la config)</li>
            </ul>
          </div>
          <div>
            <strong>Authentification</strong>
            <ul className="list-disc ml-6 mt-2">
              <li>JWT (Bearer token) ou OAuth2</li>
              <li>Gestion des droits par rôle (admin, user, viewer...)</li>
            </ul>
          </div>
          <div>
            <strong>Liens utiles</strong>
            <ul className="list-disc ml-6 mt-2">
              <li><a href="https://docs.votre-cockpit.devops.com" target="_blank" rel="noopener noreferrer" className="text-blue-600 inline-flex items-center gap-1"><LinkIcon className="w-3 h-3" /> Documentation en ligne</a></li>
              <li><a href="mailto:support@votre-cockpit.devops.com" className="text-blue-600 inline-flex items-center gap-1"><LinkIcon className="w-3 h-3" /> Support technique</a></li>
              <li><a href="https://github.com/votre-cockpit" target="_blank" rel="noopener noreferrer" className="text-blue-600 inline-flex items-center gap-1"><LinkIcon className="w-3 h-3" /> Dépôt GitHub</a></li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
} 