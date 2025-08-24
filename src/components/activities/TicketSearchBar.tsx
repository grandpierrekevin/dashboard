import  { useEffect, useCallback } from "react";
import { JiraTicket } from "@/types/mocks";
import { Input } from "@/components/ui/input";
import { Select, SelectTrigger, SelectContent, SelectItem } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { Button } from "@/components/ui/button";

interface TicketSearchBarProps {
  tickets: JiraTicket[];
  onFilter: (filtered: JiraTicket[]) => void;
}

/**
 * Composant de barre de recherche pour les tickets Jira
 * Permet de filtrer les tickets par titre, assigné, statut, priorité et type
 */
export function TicketSearchBar({ tickets, onFilter }: TicketSearchBarProps) {
  // États locaux pour chaque critère de filtrage
  const [search, setSearch] = useState("");
  const [assignee, setAssignee] = useState("");
  const [status, setStatus] = useState("");
  const [priority, setPriority] = useState("");
  const [type, setType] = useState("");

  // Extraction des valeurs uniques pour les filtres
  const assignees = Array.from(new Set(tickets.map((t) => t.assignee)));
  const statuses = Array.from(new Set(tickets.map((t) => t.status)));
  const priorities = Array.from(new Set(tickets.map((t) => t.priority)));
  const types = Array.from(new Set(tickets.map((t) => t.type)));

  /**
   * Fonction de filtrage optimisée avec useCallback
   * Applique tous les filtres sélectionnés sur la liste des tickets
   */
  const handleFilter = useCallback(() => {
    let filtered = tickets;
    
    if (search) {
      filtered = filtered.filter((t) =>
        t.title.toLowerCase().includes(search.toLowerCase()) ||
        t.ticket.toLowerCase().includes(search.toLowerCase())
      );
    }
    if (assignee) {
      filtered = filtered.filter((t) => t.assignee === assignee);
    }
    if (status) {
      filtered = filtered.filter((t) => t.status === status);
    }
    if (priority) {
      filtered = filtered.filter((t) => t.priority === priority);
    }
    if (type) {
      filtered = filtered.filter((t) => t.type === type);
    }
    onFilter(filtered);
  }, [search, assignee, status, priority, type, tickets, onFilter]);

  /**
   * Réinitialise tous les filtres
   */
  const handleReset = useCallback(() => {
    setSearch("");
    setAssignee("");
    setStatus("");
    setPriority("");
    setType("");
  }, []);

  // Applique le filtrage à chaque changement de critère
  useEffect(() => {
    handleFilter();
  }, [handleFilter]);

  return (
    <div className="flex flex-wrap gap-4 items-end mb-4 bg-gray-900 rounded-xl p-7 shadow">
      <div>
        <Label htmlFor="search" className="mb-2">Recherche</Label>
        <Input
          id="search"
          placeholder="Titre ou numéro du ticket..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>
      <div>
        <Label htmlFor="assignee" className="mb-2">Assigné à</Label>
        <Select value={assignee} onValueChange={setAssignee}>
          <SelectTrigger className="w-[180px]">{assignee || "Tous"}</SelectTrigger>
          <SelectContent>
            {assignees.filter(Boolean).map((a) => (
              <SelectItem key={a} value={a}>{a}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div>
        <Label htmlFor="status" className="mb-2">Statut</Label>
        <Select value={status} onValueChange={setStatus}>
          <SelectTrigger className="w-[180px]">{status || "Tous"}</SelectTrigger>
          <SelectContent>
            {statuses.filter(Boolean).map((s) => (
              <SelectItem key={s} value={s}>{s}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div>
        <Label htmlFor="priority" className="mb-2">Priorité</Label>
        <Select value={priority} onValueChange={setPriority}>
          <SelectTrigger className="w-[180px]">{priority || "Toutes"}</SelectTrigger>
          <SelectContent>
            {priorities.filter(Boolean).map((p) => (
              <SelectItem key={p} value={p}>{p}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div>
        <Label htmlFor="type" className="mb-2">Type</Label>
        <Select value={type} onValueChange={setType}>
          <SelectTrigger className="w-[180px]">{type || "Tous"}</SelectTrigger>
          <SelectContent>
            {types.filter(Boolean).map((t) => (
              <SelectItem key={t} value={t}>{t}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <Button
        type="button"
        variant="outline"
        className="h-10"
        onClick={handleReset}
      >
        Réinitialiser les filtres
      </Button>
    </div>
  );
} 