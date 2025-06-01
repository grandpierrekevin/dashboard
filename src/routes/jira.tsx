import { createFileRoute } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { Link } from "@tanstack/react-router";
import { JiraWidget } from "@/components/dashboard/JiraWidget";
import { RecentTicketsList } from "@/components/activities/RecentTicketsList";
import { TicketSearchBar } from "@/components/activities/TicketSearchBar";
import { mockJiraData } from "@/mocks/jira";
import { useState } from "react";

export const Route = createFileRoute("/jira")({
  component: JiraPage,
});

export function JiraPage() {
  const [filteredTickets, setFilteredTickets] = useState(mockJiraData);

  return (
    <div className="container mx-auto p-6 space-y-6">
      <h1 className="text-3xl font-bold">Jira</h1>
      <JiraWidget />
      <TicketSearchBar tickets={mockJiraData} onFilter={setFilteredTickets} />
      <div className="grid gap-6">
        <RecentTicketsList tickets={filteredTickets} />
      </div>
    </div>
  );
} 