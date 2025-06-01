import { createFileRoute } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { Link } from "@tanstack/react-router";
import { JenkinsWidget } from "@/components/dashboard/JenkinsWidget";
import { RecentBuildsList } from "@/components/activities/RecentBuildsList";
import { BuildSearchBar } from "@/components/activities/BuildSearchBar";
import { mockJenkinsData } from "@/mocks/jenkins";
import { useState } from "react";

export const Route = createFileRoute("/jenkins")({
  component: JenkinsPage,
});

export function JenkinsPage() {
  const [filteredBuilds, setFilteredBuilds] = useState(mockJenkinsData);

  return (
    <div className="container mx-auto p-6 space-y-6">
      <h1 className="text-3xl font-bold">Jenkins</h1>
      <JenkinsWidget />
      <BuildSearchBar builds={mockJenkinsData} onFilter={setFilteredBuilds} />
      <div className="grid gap-6">
        <RecentBuildsList builds={filteredBuilds} />
      </div>
    </div>
  );
} 