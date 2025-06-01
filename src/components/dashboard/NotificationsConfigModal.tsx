import React from 'react';
import { Button } from '@/components/ui/button';
import { X, Mail, Slack } from 'lucide-react';

interface NotificationsConfigModalProps {
  open: boolean;
  onClose: () => void;
}

export function NotificationsConfigModal({ open, onClose }: NotificationsConfigModalProps) {
  const [emailEnabled, setEmailEnabled] = React.useState(true);
  const [slackEnabled, setSlackEnabled] = React.useState(false);
  const [email, setEmail] = React.useState('devops@example.com');
  const [slackChannel, setSlackChannel] = React.useState('#devops-alerts');
  const [testResult, setTestResult] = React.useState<string | null>(null);

  if (!open) return null;

  const handleTest = () => {
    setTestResult('Test envoyé (mock) !');
    setTimeout(() => setTestResult(null), 2000);
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-900 p-8 rounded-lg shadow-lg max-w-md w-full relative">
        <button className="absolute top-4 right-4 text-gray-400 hover:text-gray-700" onClick={onClose}><X size={22} /></button>
        <h2 className="text-xl font-bold mb-4 flex items-center gap-2">Notifications</h2>
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <input type="checkbox" checked={emailEnabled} onChange={e => setEmailEnabled(e.target.checked)} id="notif-email" />
            <label htmlFor="notif-email" className="flex items-center gap-1 cursor-pointer"><Mail className="w-4 h-4" /> Email</label>
            {emailEnabled && (
              <input
                type="email"
                className="ml-2 border rounded px-2 py-1 bg-white dark:bg-gray-900"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="Adresse email"
              />
            )}
          </div>
          <div className="flex items-center gap-2">
            <input type="checkbox" checked={slackEnabled} onChange={e => setSlackEnabled(e.target.checked)} id="notif-slack" />
            <label htmlFor="notif-slack" className="flex items-center gap-1 cursor-pointer"><Slack className="w-4 h-4" /> Slack</label>
            {slackEnabled && (
              <input
                type="text"
                className="ml-2 border rounded px-2 py-1 bg-white dark:bg-gray-900"
                value={slackChannel}
                onChange={e => setSlackChannel(e.target.value)}
                placeholder="#canal-slack"
              />
            )}
          </div>
          <div className="flex gap-2 justify-end mt-4">
            <Button type="button" variant="outline" onClick={onClose}>Fermer</Button>
            <Button type="button" onClick={handleTest}>Tester l'envoi</Button>
          </div>
          {testResult && <div className="text-green-600 text-sm mt-2">{testResult}</div>}
        </div>
      </div>
    </div>
  );
} 