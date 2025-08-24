import React, { useState, useEffect, useMemo, useCallback } from "react";
import { BuildSummary } from "@/types/jenkins";
import { Input } from "@/components/ui/input";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";

// Nouveau type enrichi
interface EnrichedBuild extends BuildSummary {
  job: string;
  branch: string;
}

interface BuildSearchBarProps {
  builds: EnrichedBuild[];
  onFilter: (filtered: EnrichedBuild[]) => void;
}

export function BuildSearchBar({ builds, onFilter }: BuildSearchBarProps) {
  const [search, setSearch] = useState("");
  const [job, setJob] = useState("");
  const [status, setStatus] = useState("");
  const [branch, setBranch] = useState("");

  const jobs = useMemo(() => Array.from(new Set(builds.map((b) => b.job))), [builds]);
  const branches = useMemo(() => Array.from(new Set(builds.map((b) => b.branch))), [builds]);

  const handleFilter = useCallback(() => {
    let filtered = builds;
    if (search) {
      filtered = filtered.filter((b) =>
        b.job.toLowerCase().includes(search.toLowerCase()) ||
        b.branch.toLowerCase().includes(search.toLowerCase())
      );
    }
    if (job) {
      filtered = filtered.filter((b) => b.job === job);
    }
    if (status) {
      filtered = filtered.filter((b) => b.status === status);
    }
    if (branch) {
      filtered = filtered.filter((b) => b.branch === branch);
    }
    onFilter(filtered);
  }, [search, job, status, branch, builds, onFilter]);

  const handleReset = useCallback(() => {
    setSearch("");
    setJob("");
    setStatus("");
    setBranch("");
  }, []);

  useEffect(() => {
    handleFilter();
  }, [handleFilter]);

  return (
    <div className="flex flex-wrap items-end gap-4 p-4 bg-card rounded-lg shadow-md border border-border">
      <div className="flex flex-col min-w-[180px]">
        <Label htmlFor="search" className="text-xs mb-1">Recherche</Label>
        <div className="relative">
          <span className="absolute left-2 top-2 text-muted-foreground">
            <Search className="w-4 h-4" />
          </span>
          <Input
            id="search"
            type="search"
            placeholder="Rechercher un job ou une branche..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-8"
          />
        </div>
      </div>
      <div className="flex flex-col min-w-[140px]">
        <Label htmlFor="job" className="text-xs mb-1">Job</Label>
        <Select value={job} onValueChange={setJob}>
          <SelectTrigger id="job">
            <SelectValue placeholder="Tous les jobs" />
          </SelectTrigger>
          <SelectContent>
            {jobs.filter(Boolean).map((j) => (
              <SelectItem key={j} value={j}>{j}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div className="flex flex-col min-w-[120px]">
        <Label htmlFor="status" className="text-xs mb-1">Statut</Label>
        <Select value={status} onValueChange={setStatus}>
          <SelectTrigger id="status">
            <SelectValue placeholder="Tous les statuts" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="success">Succès</SelectItem>
            <SelectItem value="failed">Échec</SelectItem>
            <SelectItem value="running">En cours</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="flex flex-col min-w-[120px]">
        <Label htmlFor="branch" className="text-xs mb-1">Branche</Label>
        <Select value={branch} onValueChange={setBranch}>
          <SelectTrigger id="branch">
            <SelectValue placeholder="Toutes les branches" />
          </SelectTrigger>
          <SelectContent>
            {branches.filter(Boolean).map((b) => (
              <SelectItem key={b} value={b}>{b}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div className="flex gap-2 ml-auto">
        <Button variant="outline" onClick={handleReset}>Réinitialiser</Button>
      </div>
      <div className="w-full text-xs text-muted-foreground mt-2">
        {builds.length} builds trouvés
      </div>
    </div>
  );
} 