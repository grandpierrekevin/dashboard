import React from 'react';
import { RouterProvider, createRouter } from "@tanstack/react-router";
import { routeTree } from "./routeTree.gen";
import { Toaster } from "@/components/ui/sonner";
import { IntegrationsProvider } from "./context/IntegrationsContext";
import { ThemeProvider } from "./context/ThemeContext";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { CorrelationProvider } from '@/context/CorrelationContext';
import { NotificationsProvider } from './context/NotificationsContext';

const router = createRouter({ routeTree });

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}

const queryClient = new QueryClient();

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <IntegrationsProvider>
          <CorrelationProvider>
            <NotificationsProvider>
              <Toaster />
              <RouterProvider router={router} />
            </NotificationsProvider>
          </CorrelationProvider>
        </IntegrationsProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}
