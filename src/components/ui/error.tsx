import { AlertCircle } from "lucide-react";
import { Button } from "./button";

interface ErrorProps {
  title?: string;
  message?: string;
  retry?: () => void;
  className?: string;
}

export function Error({ title = "Une erreur est survenue", message = "Veuillez réessayer plus tard", retry, className }: ErrorProps) {
  return (
    <div className={`flex flex-col items-center justify-center p-8 text-center ${className}`}>
      <AlertCircle className="w-12 h-12 text-destructive mb-4" />
      <h3 className="text-lg font-medium mb-2">{title}</h3>
      <p className="text-muted-foreground mb-4">{message}</p>
      {retry && (
        <Button onClick={retry} variant="outline">
          Réessayer
        </Button>
      )}
    </div>
  );
}

export function ErrorPage({ title, message, retry }: ErrorProps) {
  return (
    <div className="flex items-center justify-center min-h-[400px]">
      <Error title={title} message={message} retry={retry} />
    </div>
  );
}

export function ErrorCard({ title, message, retry }: ErrorProps) {
  return (
    <div className="p-4">
      <Error title={title} message={message} retry={retry} />
    </div>
  );
} 