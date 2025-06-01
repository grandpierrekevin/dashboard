import { createRootRoute, Outlet } from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/react-router-devtools";
import { RootLayout } from "@/components/layouts/RootLayout";

export const Route = createRootRoute({
  component: () => (
    <RootLayout>
      <Outlet />
      <TanStackRouterDevtools />
    </RootLayout>
  ),
  notFoundComponent: () => (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold text-red-500">Page non trouvée</h1>
      <p>La page demandée n'existe pas.</p>
    </div>
  ),
});

export const routeTree = Route;
