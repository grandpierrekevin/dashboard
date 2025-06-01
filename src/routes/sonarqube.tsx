import { createFileRoute } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { Link } from "@tanstack/react-router";
import { SonarWidget } from "@/components/dashboard/SonarWidget";
import { RecentSonarIssuesList } from "@/components/activities/RecentSonarIssuesList";
import { mockSonarData } from "@/mocks/sonarqube";

export const Route = createFileRoute("/sonarqube")({
  component: SonarQubePage,
});

export function SonarQubePage() {
  const issues = mockSonarData[0].issues || [];

  return (
    <div className="container mx-auto p-6 space-y-6">
      <h1 className="text-3xl font-bold">SonarQube</h1>
      <SonarWidget />
      <div className="grid gap-6">
        <RecentSonarIssuesList issues={issues} />
      </div>
    </div>
  );
} 