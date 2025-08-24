import React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { GripVertical, Settings, X } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';

interface DashboardWidgetProps {
  id: string;
  title: string;
  tool: string;
  onRemove: (id: string) => void;
  onSettings: (id: string) => void;
  children: React.ReactNode;
  className?: string;
}

export function DashboardWidget({ 
  id, 
  title, 
  tool, 
  onRemove, 
  onSettings, 
  children,
  className 
}: DashboardWidgetProps) {
  const [isHovered, setIsHovered] = React.useState(false);

  const handleSettingsClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onSettings(id);
  };

  const handleRemoveClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (confirm(`Voulez-vous vraiment supprimer le widget ${title} ?`)) {
      onRemove(id);
    }
  };

  return (
    <Card 
      className={cn(
        "w-full max-w-md h-[500px] flex flex-col rounded-2xl border border-gray-200 dark:border-gray-600",
        "shadow-lg hover:shadow-2xl hover:-translate-y-1 transition-all duration-300",
        "bg-gradient-to-b from-gray-50/80 via-white/80 to-white/90 dark:from-gray-900/80 dark:via-gray-800/80 dark:to-gray-900/90",
        "animate-fade-in group",
        className
      )}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <CardHeader className="flex flex-row items-center justify-between pb-2 bg-gradient-to-r from-blue-50/80 via-white/80 to-white/90 dark:from-gray-900/80 dark:via-gray-800/80 dark:to-gray-900/90 rounded-t-2xl">
        <div className="flex items-center gap-2">
          <GripVertical className="w-4 h-4 text-gray-300 dark:text-gray-600 cursor-move transition-colors group-hover:text-blue-500 dark:group-hover:text-blue-400" />
          <CardTitle className="text-xl font-extrabold tracking-tight text-gray-800 dark:text-white drop-shadow-sm">
            {title}
          </CardTitle>
          <CardDescription className="ml-2 text-xs font-medium uppercase tracking-wider text-blue-500 dark:text-blue-300">
            {tool}
          </CardDescription>
        </div>
        <div className={cn(
          "flex items-center gap-2 transition-opacity duration-200",
          isHovered ? "opacity-100" : "opacity-70"
        )}>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 hover:bg-blue-100 dark:hover:bg-blue-900/50"
                  onClick={handleSettingsClick}
                  type="button"
                >
                  <Settings className="h-4 w-4 text-gray-500 dark:text-gray-400" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Paramètres du widget</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 hover:bg-red-100 dark:hover:bg-red-900/50"
                  onClick={handleRemoveClick}
                  type="button"
                >
                  <X className="h-4 w-4 text-gray-500 dark:text-gray-400" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Supprimer le widget</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </CardHeader>
      <Separator className="opacity-50" />
      <CardContent className="flex-1 p-0 overflow-hidden">
        <div className="h-full w-full p-4">
          {children}
        </div>
      </CardContent>
    </Card>
  );
} 