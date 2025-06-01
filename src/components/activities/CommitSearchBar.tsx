import React, { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Commit } from "@/types/github";

interface CommitSearchBarProps {
  commits?: Commit[];
  onFilter: (filteredCommits: Commit[]) => void;
}

export function CommitSearchBar({ commits = [], onFilter }: CommitSearchBarProps) {
  const [search, setSearch] = useState("");
  const [author, setAuthor] = useState("");
  const [branch, setBranch] = useState("");

  // Extraire les auteurs et branches uniques
  const authors = Array.from(new Set((commits || []).map((c) => c.author)));
  const branches = Array.from(new Set((commits || []).map((c) => c.branch)));

  // Fonction de filtrage indépendante
  const filterCommits = (searchTerm: string) => {
    const filteredCommits = (commits || []).filter(
      (commit) =>
        commit.message.toLowerCase().includes(searchTerm) ||
        commit.author.toLowerCase().includes(searchTerm) ||
        commit.branch.toLowerCase().includes(searchTerm)
    );
    onFilter(filteredCommits);
  };

  // Handler pour l'input
  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    const searchTerm = event.target.value.toLowerCase();
    setSearch(searchTerm);
    filterCommits(searchTerm);
  };

  // useEffect pour appliquer le filtre si les commits changent
  useEffect(() => {
    filterCommits(search);
  }, [search, commits]);

  return (
    <div className="w-full max-w-sm">
      <Input
        type="search"
        placeholder="Rechercher un commit..."
        onChange={handleSearch}
        className="w-full"
      />
    </div>
  );
} 