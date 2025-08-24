import { createFileRoute } from "@tanstack/react-router";
import Dashboard from "@/components/dashboard/Dashboard";
import { DashboardFilterProvider } from "@/context/DashboardFilterContext";

export const Route = createFileRoute("/dashboard")({
  component: DashboardPage,
});

function DashboardPage() {
  return (
    <DashboardFilterProvider>
      <Dashboard />
    </DashboardFilterProvider>
  );
}
