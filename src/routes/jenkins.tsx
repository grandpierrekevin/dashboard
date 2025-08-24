import { createFileRoute } from "@tanstack/react-router";
import { RecentBuildsList } from "@/components/activities/RecentBuildsList";
import { BuildSearchBar } from "@/components/activities/BuildSearchBar";
import { mockJenkinsData } from "@/mocks/jenkins";
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogClose } from "@/components/ui/dialog";
import type { EnrichedBuild } from "@/types/jenkins";
import { toast } from "sonner";
import { JenkinsGraph } from "@/components/dashboard/widgets/JenkinsGraph";

export const Route = createFileRoute("/jenkins")({
  component: JenkinsPage,
});

export function JenkinsPage() {
  // Agrégation des builds mockés (simule l'API)
  const allBuilds: EnrichedBuild[] = mockJenkinsData.flatMap(job =>
    (job.recentBuilds || []).map(build => ({
      ...build,
      job: job.name,
      branch: (job as any).branch ?? '',
      name: job.name,
      date: (job as any).date ?? '',
      canRetry: (build as any).canRetry ?? (job as any).canRetry ?? undefined,
      consoleUrl: (job as any).consoleUrl ?? undefined,
    }))
  );
  const [filteredBuilds, setFilteredBuilds] = useState<EnrichedBuild[]>(allBuilds);

  // Pour la popup
  const [selectedBuild, setSelectedBuild] = useState<EnrichedBuild | null>(null);
  const [open, setOpen] = useState(false);

  const handleViewDetails = (build: EnrichedBuild) => {
    setSelectedBuild(build);
    setOpen(true);
  };

  function handleRetry(build: EnrichedBuild) {
    // Simulation d'un appel API Jenkins
    toast.success(`Build #${build.number} relancé pour le job ${build.job} !`);
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      <h1 className="text-3xl font-bold">Jenkins</h1>
      <JenkinsGraph />
      <BuildSearchBar builds={allBuilds as any} onFilter={setFilteredBuilds as any} />
      <div className="grid gap-6">
        <RecentBuildsList builds={filteredBuilds as any} onViewDetails={handleViewDetails} />
      </div>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="bg-gray-900">
          <DialogHeader>
            <DialogTitle>Détail du build</DialogTitle>
            <DialogClose />
          </DialogHeader>
          {selectedBuild && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-x-4 gap-y-2">
                <span className="font-semibold text-muted-foreground">ID :</span>
                <span>{selectedBuild.id}</span>
                <span className="font-semibold text-muted-foreground">Numéro :</span>
                <span>{selectedBuild.number}</span>
                <span className="font-semibold text-muted-foreground">Job :</span>
                <span>{selectedBuild.job}</span>
                <span className="font-semibold text-muted-foreground">Branche :</span>
                <span>{selectedBuild.branch || <span className="italic text-gray-500">-</span>}</span>
                <span className="font-semibold text-muted-foreground">Status :</span>
                <span>{selectedBuild.status}</span>
                <span className="font-semibold text-muted-foreground">Durée :</span>
                <span>{selectedBuild.duration}s</span>
                <span className="font-semibold text-muted-foreground">Début :</span>
                <span>{selectedBuild.startedAt}</span>
                <span className="font-semibold text-muted-foreground">Fin :</span>
                <span>{selectedBuild.finishedAt}</span>
                {selectedBuild.canRetry !== undefined && (
                  <>
                    <span className="font-semibold text-muted-foreground">Peut être relancé :</span>
                    <span>{selectedBuild.canRetry ? "Oui" : "Non"}</span>
                  </>
                )}
                {selectedBuild.consoleUrl && (
                  <>
                    <span className="font-semibold text-muted-foreground">Console :</span>
                    <span>
                      <a href={selectedBuild.consoleUrl} target="_blank" rel="noopener noreferrer" className="text-blue-400 underline">
                        Voir la console
                      </a>
                    </span>
                  </>
                )}
              </div>
              {selectedBuild.stages && (
                <div className="pt-2 border-t border-border">
                  <div className="font-semibold mb-1">Étapes :</div>
                  <ul className="ml-4 list-disc space-y-1">
                    {selectedBuild.stages.map((stage, idx) => (
                      <li key={idx}>
                        <span className="font-semibold">{stage.name}</span> : {stage.status} <span className="text-muted-foreground">({stage.duration}s)</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              {selectedBuild.canRetry && (
                <div className="pt-2">
                  <button
                    className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
                    onClick={() => handleRetry(selectedBuild)}
                  >
                    Relancer ce build
                  </button>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
} 