import React, { useState, useEffect, useMemo, useCallback } from "react";
import { JenkinsBuild } from "@/types/mocks";
import { Input } from "@/components/ui/input";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

interface BuildSearchBarProps {
  builds: JenkinsBuild[];
  onFilter: (filtered: JenkinsBuild[]) => void;
}

export function BuildSearchBar({ builds, onFilter }: BuildSearchBarProps) {
  const [search, setSearch] = useState("");
  const [job, setJob] = useState("");
  const [status, setStatus] = useState("");
  const [branch, setBranch] = useState("");

  const jobs = useMemo(() => Array.from(new Set(builds.map((b) => b.job))), [builds]);
  const statuses = useMemo(() => Array.from(new Set(builds.map((b) => b.status))), [builds]);
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
    <div className="space-y-4 p-4 bg-white dark:bg-gray-800 rounded-lg shadow">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="space-y-2">
          <Label htmlFor="search">Recherche</Label>
          <Input
            id="search"
            placeholder="Rechercher..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="job">Job</Label>
          <Select value={job} onValueChange={setJob}>
            <SelectTrigger id="job" placeholder="Tous" />
            <SelectContent>
              {jobs.filter(Boolean).map((j) => (
                <SelectItem key={j} value={j}>
                  {j}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="status">Statut</Label>
          <Select value={status} onValueChange={setStatus}>
            <SelectTrigger id="status" placeholder="Tous" />
            <SelectContent>
              {statuses.filter(Boolean).map((s) => (
                <SelectItem key={s} value={s}>
                  {s}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="branch">Branche</Label>
          <Select value={branch} onValueChange={setBranch}>
            <SelectTrigger id="branch" placeholder="Toutes" />
            <SelectContent>
              {branches.filter(Boolean).map((b) => (
                <SelectItem key={b} value={b}>
                  {b}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
      <div className="flex justify-end">
        <Button variant="outline" onClick={handleReset}>
          Réinitialiser
        </Button>
      </div>
    </div>
  );
} 