import { JiraTicket } from "@/types/mocks";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { formatDistanceToNow } from "date-fns";
import { fr } from "date-fns/locale";
import  { useState } from "react";

interface RecentTicketsListProps {
  tickets: JiraTicket[];
  onViewDetails: (ticket: JiraTicket) => void;
  onComment: (ticket: JiraTicket) => void;
}

export function RecentTicketsList({ tickets, onViewDetails, onComment }: RecentTicketsListProps) {
  const [openTicketId, setOpenTicketId] = useState<string | null>(null);

  const handleComment = (ticket: JiraTicket) => {
    toast(`Commentaire ajouté\nTicket ${ticket.ticket} - ${ticket.title}`);
  };

  const getStatusColor = (status: JiraTicket["status"]) => {
    switch (status) {
      case "To Do":
        return "bg-gray-500";
      case "In Progress":
        return "bg-blue-500";
      case "Done":
        return "bg-green-500";
      default:
        return "bg-gray-500";
    }
  };

  const getPriorityColor = (priority: JiraTicket["priority"]) => {
    switch (priority) {
      case "High":
        return "bg-red-500";
      case "Medium":
        return "bg-yellow-500";
      case "Low":
        return "bg-green-500";
      default:
        return "bg-gray-500";
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Tickets récents</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {tickets.map((ticket) => (
            <div
              key={ticket.id}
              className="flex flex-col gap-2 p-4 border rounded-lg"
            >
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-medium">{ticket.title}</span>
                    <Badge
                      className={getStatusColor(ticket.status)}
                      variant="secondary"
                    >
                      {ticket.status}
                    </Badge>
                    <Badge
                      className={getPriorityColor(ticket.priority)}
                      variant="secondary"
                    >
                      {ticket.priority}
                    </Badge>
                    <Badge variant="outline">{ticket.type}</Badge>
                  </div>
                  <div className="text-sm text-muted-foreground">
                    <span>Ticket: {ticket.ticket}</span>
                    <span className="mx-2">•</span>
                    <span>Assigné à: {ticket.assignee}</span>
                  </div>
                  <div className="text-sm text-muted-foreground">
                    <span>
                      Créé: {ticket.created && !isNaN(new Date(ticket.created).getTime())
                        ? formatDistanceToNow(new Date(ticket.created), {
                            addSuffix: true,
                            locale: fr,
                          })
                        : "Date inconnue"}
                    </span>
                    <span className="mx-2">•</span>
                    <span>
                      Mis à jour: {ticket.updated && !isNaN(new Date(ticket.updated).getTime())
                        ? formatDistanceToNow(new Date(ticket.updated), {
                            addSuffix: true,
                            locale: fr,
                          })
                        : "Date inconnue"}
                    </span>
                  </div>
                  <div className="text-sm text-muted-foreground">
                    <span>{Array.isArray(ticket.comments) ? ticket.comments.length : 0} commentaires</span>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onComment(ticket)}
                  >
                    Commenter
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onViewDetails(ticket)}
                  >
                    Voir détails
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setOpenTicketId(openTicketId === ticket.id ? null : ticket.id)}
                  >
                    {openTicketId === ticket.id ? 'Masquer commentaires' : 'Voir commentaires'}
                  </Button>
                </div>
              </div>
              {openTicketId === ticket.id && (
                <div className="mt-2 pl-4 border-l border-gray-700">
                  {ticket.comments && ticket.comments.length > 0 ? (
                    ticket.comments.map((comment: any, idx: number) => (
                      <div key={idx} className="mb-2">
                        <div className="text-xs text-gray-400">{comment.author} — {comment.date}</div>
                        <div className="text-sm">{comment.content}</div>
                      </div>
                    ))
                  ) : (
                    <div className="text-xs text-gray-500">Aucun commentaire</div>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
} 