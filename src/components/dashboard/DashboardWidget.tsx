import React from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { GripVertical, Settings2, X } from 'lucide-react';

interface DashboardWidgetProps {
  id: string;
  title: string;
  tool: string;
  onRemove: (id: string) => void;
  onSettings: (id: string) => void;
  children: React.ReactNode;
}

export function DashboardWidget({ id, title, tool, onRemove, onSettings, children }: DashboardWidgetProps) {
  return (
    <Card className="p-4">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <GripVertical className="w-4 h-4 text-gray-400 cursor-move" />
          <h3 className="font-semibold">{title}</h3>
          <span className="text-sm text-gray-500">({tool})</span>
        </div>
        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onSettings(id)}
          >
            <Settings2 className="w-4 h-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onRemove(id)}
          >
            <X className="w-4 h-4" />
          </Button>
        </div>
      </div>
      <div className="min-h-[200px]">
        {children}
      </div>
    </Card>
  );
} 