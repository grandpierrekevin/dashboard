import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/404")({
  component: NotFound,
});


function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center h-full p-10">
      <h1 className="text-5xl font-bold mb-4 text-blue-700">404</h1>
      <p className="mb-6 text-lg text-muted-foreground">Page non trouvée.</p>
      <a href="/" className="px-4 py-2 bg-blue-700 text-white rounded">Retour à l’accueil</a>
    </div>
  );
}
