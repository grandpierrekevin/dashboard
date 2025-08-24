import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, Filter } from "lucide-react";
import type { SonarIssue } from "@/types/mocks";

interface SonarSearchBarProps {
  issues: SonarIssue[];
  onFilter: (issues: SonarIssue[]) => void;
}

export function SonarSearchBar({ issues, onFilter }: SonarSearchBarProps) {
  const handleSearch = (value: string) => {
    const filtered = issues.filter(issue => 
      issue.message.toLowerCase().includes(value.toLowerCase()) ||
      issue.component.toLowerCase().includes(value.toLowerCase())
    );
    onFilter(filtered);
  };

  const handleTypeFilter = (value: string) => {
    if (value === 'all') {
      onFilter(issues);
      return;
    }
    const filtered = issues.filter(issue => issue.type === value);
    onFilter(filtered);
  };

  const handleSeverityFilter = (value: string) => {
    if (value === 'all') {
      onFilter(issues);
      return;
    }
    const filtered = issues.filter(issue => issue.severity === value);
    onFilter(filtered);
  };

  const handleStatusFilter = (value: string) => {
    if (value === 'all') {
      onFilter(issues);
      return;
    }
    const filtered = issues.filter(issue => issue.status === value);
    onFilter(filtered);
  };

  return (
    <div className="flex flex-col sm:flex-row gap-4 p-4 bg-gray-900 rounded-lg">
      <div className="relative w-96">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
        <Input
          placeholder="Rechercher par message ou composant..."
          className="pl-10 bg-gray-800 border-gray-700"
          onChange={(e) => handleSearch(e.target.value)}
        />
      </div>
      <div className="flex gap-2">
        <Select onValueChange={handleTypeFilter} defaultValue="all">
          <SelectTrigger className="w-auto bg-gray-800 border-gray-700">
            <Filter className="h-4 w-4 mr-2" />
            <SelectValue placeholder="Type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tous les types</SelectItem>
            <SelectItem value="bug">Bug</SelectItem>
            <SelectItem value="vulnerability">Vulnérabilité</SelectItem>
            <SelectItem value="code_smell">Code Smell</SelectItem>
          </SelectContent>
        </Select>
        <Select onValueChange={handleSeverityFilter} defaultValue="all">
          <SelectTrigger className="w-auto bg-gray-800 border-gray-700">
            <Filter className="h-4 w-4 mr-2" />
            <SelectValue placeholder="Sévérité" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Toutes sévérités</SelectItem>
            <SelectItem value="blocker">Blocker</SelectItem>
            <SelectItem value="critical">Critical</SelectItem>
            <SelectItem value="major">Major</SelectItem>
            <SelectItem value="minor">Minor</SelectItem>
          </SelectContent>
        </Select>
        <Select onValueChange={handleStatusFilter} defaultValue="all">
          <SelectTrigger className="w-auto bg-gray-800 border-gray-700">
            <Filter className="h-4 w-4 mr-2" />
            <SelectValue placeholder="Statut" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tous les statuts</SelectItem>
            <SelectItem value="open">Ouvert</SelectItem>
            <SelectItem value="resolved">Résolu</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
} 