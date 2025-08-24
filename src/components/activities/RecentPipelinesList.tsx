import React, { useState, useEffect, useMemo, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Pipeline } from "@/types/gitlab";
import { Select, SelectTrigger, SelectContent, SelectItem } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { VirtualizedList } from "@/components/ui/virtualized-list";

interface RecentPipelinesListProps {
  pipelines: Pipeline[];
}

export function RecentPipelinesList({ pipelines = [] }: RecentPipelinesListProps) {
  const [statusFilter, setStatusFilter] = useState<string | null>(null);
  const [authorFilter, setAuthorFilter] = useState<string | null>(null);
  const [livePipelines, setLivePipelines] = useState(pipelines);
  const [newPipelineId, setNewPipelineId] = useState<string | number | null>(null);

  const uniqueAuthors = useMemo(() => Array.from(new Set(pipelines.map((p: any) => p.author))), [pipelines]);

  const filtered = useMemo(() => {
    return livePipelines.filter((p: any) => {
      return (!statusFilter || p.status === statusFilter) && (!authorFilter || p.author === authorFilter);
    });
  }, [livePipelines, statusFilter, authorFilter]);

  const handleStatusChange = useCallback((value: string) => {
    setStatusFilter(value === "" ? null : value);
  }, []);

  const handleAuthorChange = useCallback((value: string) => {
    setAuthorFilter(value === "" ? null : value);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      const statuses: Pipeline['status'][] = ["success", "failed", "running", "pending"];
      const authors = uniqueAuthors.length ? uniqueAuthors : ["Alice Smith", "Bob Johnson", "Charlie Brown", "Diana Prince"];
      const id = Math.floor(Math.random() * 1000) + Date.now();
      const newPipeline: Pipeline = {
        id,
        status: statuses[Math.floor(Math.random() * statuses.length)],
        duration: Math.floor(Math.random() * 200) + 60,
        startedAt: new Date().toISOString(),
        finishedAt: new Date(Date.now() + (Math.floor(Math.random() * 200) + 60) * 1000).toISOString(),
        branch: ["main", "develop", "feature/auth", "hotfix/security"][Math.floor(Math.random() * statuses.length)],
        author: authors[Math.floor(Math.random() * authors.length)],
        stages: [{ name: "build", status: "success", duration: 60 }],
        details: {
          commit: {
            id: Math.random().toString(36).substring(2, 9),
            message: "Update pipeline",
            author: authors[Math.floor(Math.random() * authors.length)]
          },
          artifacts: []
        }
      };
      setLivePipelines(list => [newPipeline, ...list]);
      setNewPipelineId(id);
      setTimeout(() => setNewPipelineId(null), 2000);
    }, 30000); // toutes les 30s
    return () => clearInterval(interval);
  }, [uniqueAuthors]);

  const renderPipeline = useCallback((pipeline: any) => (
    <Card
      key={pipeline.id}
      className={`p-4 mb-4 transition-all duration-300 ${
        newPipelineId === pipeline.id ? "bg-blue-50 dark:bg-blue-900/20" : ""
      }`}
    >
      <div className="flex items-center justify-between">
        <div>
          <h3 className="font-semibold">{pipeline.name}</h3>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            {new Date(pipeline.date).toLocaleString()}
          </p>
        </div>
        <Badge
          className={
            pipeline.status === "success"
              ? "bg-green-500"
              : pipeline.status === "failed"
              ? "bg-red-500"
              : "bg-yellow-500"
          }
        >
          {pipeline.status}
        </Badge>
      </div>
      <div className="mt-2 text-sm">
        <p>Branche: {pipeline.branch}</p>
        <p>Auteur: {pipeline.author}</p>
        <p>Commit: {pipeline.commit}</p>
        <p>Durée: {pipeline.duration}s</p>
      </div>
    </Card>
  ), [newPipelineId]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Pipelines Récents</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex gap-4">
          <div className="w-48">
            <Label htmlFor="status">Statut</Label>
            <Select onValueChange={handleStatusChange}>
              <SelectTrigger id="status">Tous</SelectTrigger>
              <SelectContent>
                <SelectItem value="success">Succès</SelectItem>
                <SelectItem value="failed">Échec</SelectItem>
                <SelectItem value="running">En cours</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="w-48">
            <Label htmlFor="author">Auteur</Label>
            <Select onValueChange={handleAuthorChange}>
              <SelectTrigger id="author">Tous</SelectTrigger>
              <SelectContent>
                {uniqueAuthors.map((author) => (
                  <SelectItem key={author} value={author}>
                    {author}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
        <VirtualizedList
          items={filtered}
          height={600}
          itemHeight={180}
          renderItem={renderPipeline}
          className="space-y-4"
        />
      </CardContent>
    </Card>
  );
} 