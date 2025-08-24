import { createFileRoute } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { RecentTicketsList } from "@/components/activities/RecentTicketsList";
import { TicketSearchBar } from "@/components/activities/TicketSearchBar";
import { mockJiraData } from "@/mocks/jira";
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogClose } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import type { JiraTicket, JiraComment } from "@/types/mocks";
import type { Comment as JiraIssueComment } from "@/types/jira";
import { JiraGraph } from "@/components/dashboard/widgets/JiraGraph";

export const Route = createFileRoute("/jira")({
  component: JiraPage,
});

export function JiraPage() {
  const statusMap: Record<string, string> = {
    to_do: "To Do",
    in_progress: "In Progress",
    in_review: "In Review",
    done: "Done"
  };

  const priorityMap: Record<string, "High" | "Medium" | "Low"> = {
    lowest: "Low",
    low: "Low",
    medium: "Medium",
    high: "High",
    highest: "High",
    critical: "High"
  };

  const typeMap: Record<string, "Bug" | "Feature" | "Task"> = {
    bug: "Bug",
    story: "Feature",
    task: "Task",
    epic: "Feature"
  };

  const mapComment = (comment: JiraIssueComment): JiraComment => ({
    id: comment.id.toString(),
    author: comment.author,
    content: comment.content,
    date: comment.created
  });

  const allTickets: JiraTicket[] = mockJiraData.flatMap(p =>
    (p.issues || []).map(issue => ({
      ...issue,
      ticket: issue.key,
      status: (statusMap[issue.status] as JiraTicket["status"]) || (issue.status as JiraTicket["status"]),
      priority: priorityMap[issue.priority] || "Medium",
      type: typeMap[issue.type] || "Task",
      comments: (issue.comments || []).map(mapComment)
    }))
  );
  const [filteredTickets, setFilteredTickets] = useState<JiraTicket[]>(allTickets);

  // Popups
  const [selectedTicket, setSelectedTicket] = useState<JiraTicket | null>(null);
  const [openDetails, setOpenDetails] = useState(false);
  const [openComment, setOpenComment] = useState(false);
  const [comment, setComment] = useState("");

  const handleViewDetails = (ticket: JiraTicket) => {
    setSelectedTicket(ticket);
    setOpenDetails(true);
  };
  const handleComment = (ticket: JiraTicket) => {
    setSelectedTicket(ticket);
    setOpenComment(true);
  };
  const handleSendComment = () => {
    if (selectedTicket) {
      toast.success(`Commentaire ajouté au ticket ${selectedTicket.ticket}`);
    }
    setComment("");
    setOpenComment(false);
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <h1 className="text-3xl font-bold">Jira</h1>
      <JiraGraph />
      <TicketSearchBar tickets={allTickets as any} onFilter={setFilteredTickets as any} />
      <div className="grid gap-6">
        <RecentTicketsList tickets={filteredTickets as any} onViewDetails={handleViewDetails} onComment={handleComment} />
      </div>
      <Dialog open={openDetails} onOpenChange={setOpenDetails}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Détail du ticket</DialogTitle>
            <DialogClose />
          </DialogHeader>
          {selectedTicket && (
            <div className="space-y-2">
              <div><b>Ticket :</b> {selectedTicket.ticket}</div>
              <div><b>Titre :</b> {selectedTicket.title}</div>
              <div><b>Statut :</b> {selectedTicket.status}</div>
              <div><b>Priorité :</b> {selectedTicket.priority}</div>
              <div><b>Type :</b> {selectedTicket.type}</div>
              <div><b>Assigné à :</b> {selectedTicket.assignee}</div>
              <div><b>Créé :</b> {selectedTicket.created}</div>
              <div><b>Mis à jour :</b> {selectedTicket.updated}</div>
              <div><b>Commentaires :</b> {Array.isArray(selectedTicket.comments) ? selectedTicket.comments.length : 0}</div>
            </div>
          )}
        </DialogContent>
      </Dialog>
      <Dialog open={openComment} onOpenChange={setOpenComment}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Ajouter un commentaire</DialogTitle>
            <DialogClose />
          </DialogHeader>
          {selectedTicket && (
            <div className="space-y-4">
              <div><b>Ticket :</b> {selectedTicket.ticket}</div>
              <Textarea
                placeholder="Votre commentaire..."
                value={comment}
                onChange={e => setComment(e.target.value)}
                className="w-full"
                rows={4}
              />
              <Button onClick={handleSendComment} disabled={!comment.trim()} className="bg-blue-500 hover:bg-blue-600">
                Envoyer
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
} 