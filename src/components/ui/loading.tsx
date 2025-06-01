import { Loader2 } from "lucide-react";

interface LoadingProps {
  size?: number;
  className?: string;
}

export function Loading({ size = 24, className }: LoadingProps) {
  return (
    <div className="flex items-center justify-center">
      <Loader2 className={`animate-spin ${className}`} size={size} />
    </div>
  );
}

export function LoadingPage() {
  return (
    <div className="flex items-center justify-center min-h-[400px]">
      <Loading size={32} className="text-primary" />
    </div>
  );
}

export function LoadingCard() {
  return (
    <div className="flex items-center justify-center p-8">
      <Loading size={24} className="text-muted-foreground" />
    </div>
  );
} 