import { HelpCircle } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface HelpTooltipProps {
  content: string | React.ReactNode;
  className?: string;
}

export function HelpTooltip({ content, className }: HelpTooltipProps) {
  const contentElement = typeof content === 'string' && content.includes('<') ? (
    <div dangerouslySetInnerHTML={{ __html: content }} />
  ) : (
    <div>{content}</div>
  );

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <button aria-label="help">
            <HelpCircle className={`h-4 w-4 text-muted-foreground hover:text-foreground ${className}`} />
          </button>
        </TooltipTrigger>
        <TooltipContent>
          <div className="max-w-xs text-sm">{contentElement}</div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
} 