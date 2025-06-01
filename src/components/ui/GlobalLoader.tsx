import { Skeleton } from "@/components/ui/skeleton";

export function GlobalLoader() {
  return (
    <div className="space-y-6">
      <Skeleton className="h-10 w-1/3 mb-4" />
      <Skeleton className="h-16 w-full" />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Skeleton className="h-40 w-full" />
        <Skeleton className="h-40 w-full" />
      </div>
      <Skeleton className="h-10 w-1/2 mt-8" />
    </div>
  );
} 