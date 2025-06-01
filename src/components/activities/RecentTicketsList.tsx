import { JiraTicket } from "@/types/mocks";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { formatDistanceToNow } from "date-fns";
import { fr } from "date-fns/locale";

interface RecentTicketsListProps {
  tickets: JiraTicket[];
}

export function RecentTicketsList({ tickets }: RecentTicketsListProps) {
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
              className="flex items-center justify-between p-4 border rounded-lg"
            >
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
                  onClick={() => handleComment(ticket)}
                >
                  Commenter
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleComment(ticket)}
                >
                  Voir détails
                </Button>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
} 