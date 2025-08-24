import { createFileRoute } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { SonarWidget } from "@/components/dashboard/SonarWidget";
import { RecentSonarIssuesList } from "@/components/activities/RecentSonarIssuesList";
import { SonarSearchBar } from "@/components/activities/SonarSearchBar";
import { SonarQualityStats } from "@/components/dashboard/SonarQualityStats";
import { SonarHotspotsList } from "@/components/activities/SonarHotspotsList";
import { mockSonarData } from "@/mocks/sonarqube";
import type { SonarIssue } from "@/types/mocks";
import type { Issue, Hotspot } from "@/types/sonarqube";
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogClose } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { SonarQubeGraph } from "@/components/dashboard/widgets/SonarQubeGraph";

export const Route = createFileRoute("/sonarqube")({
  component: SonarQubePage,
});

export function SonarQubePage() {
  // Mapping des issues SonarQube vers le format attendu
  const mapIssue = (issue: Issue): SonarIssue => ({
    id: issue.id,
    type: issue.type,
    severity: issue.severity === "info" ? "minor" : issue.severity,
    component: issue.component,
    line: issue.line,
    message: issue.message,
    status: issue.status === "open" ? "open" : "resolved",
    date: issue.creationDate
  });

  // Agrégation des données
  const allIssues: SonarIssue[] = mockSonarData.flatMap(p => 
    (p.issues || []).map(mapIssue)
  );
  const allHotspots: Hotspot[] = mockSonarData.flatMap(p => p.hotspots || []);
  const currentProject = mockSonarData[0]; // Pour l'exemple, on prend le premier projet

  // États
  const [filteredIssues, setFilteredIssues] = useState<SonarIssue[]>(allIssues);
  const [selectedIssue, setSelectedIssue] = useState<Issue | null>(null);
  const [selectedHotspot, setSelectedHotspot] = useState<Hotspot | null>(null);
  const [openIssueDetails, setOpenIssueDetails] = useState(false);
  const [openHotspotDetails, setOpenHotspotDetails] = useState(false);

  // Handlers
  const handleViewIssueDetails = (issue: SonarIssue) => {
    const originalIssue = currentProject.issues.find(i => i.id === issue.id);
    if (originalIssue) {
      setSelectedIssue(originalIssue);
      setOpenIssueDetails(true);
    }
  };

  const handleViewHotspotDetails = (hotspot: Hotspot) => {
    setSelectedHotspot(hotspot);
    setOpenHotspotDetails(true);
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <h1 className="text-3xl font-bold">SonarQube</h1>
      <SonarQubeGraph />
      
      <SonarQualityStats 
        metrics={currentProject.metrics}
        qualityGate={currentProject.qualityGate}
      />

      <Tabs defaultValue="issues" className="space-y-4">
        <TabsList>
          <TabsTrigger value="issues">Issues</TabsTrigger>
          <TabsTrigger value="hotspots">Hotspots</TabsTrigger>
        </TabsList>

        <TabsContent value="issues" className="space-y-4">
          <SonarSearchBar issues={allIssues as any} onFilter={setFilteredIssues as any} />
          <RecentSonarIssuesList issues={filteredIssues as any} onViewDetails={handleViewIssueDetails} />
        </TabsContent>

        <TabsContent value="hotspots">
          <SonarHotspotsList hotspots={allHotspots as any} onViewDetails={handleViewHotspotDetails} />
        </TabsContent>
      </Tabs>

      {/* Dialog pour les détails d'une issue */}
      <Dialog open={openIssueDetails} onOpenChange={setOpenIssueDetails}>
        <DialogContent className="bg-gray-900">
          <DialogHeader>
            <DialogTitle>Détails de l'issue</DialogTitle>
            <DialogClose />
          </DialogHeader>
          {selectedIssue && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <div className="text-sm font-medium text-gray-400">Type</div>
                  <div>{selectedIssue.type}</div>
                </div>
                <div>
                  <div className="text-sm font-medium text-gray-400">Sévérité</div>
                  <div>{selectedIssue.severity}</div>
                </div>
                <div>
                  <div className="text-sm font-medium text-gray-400">Statut</div>
                  <div>{selectedIssue.status}</div>
                </div>
                <div>
                  <div className="text-sm font-medium text-gray-400">Ligne</div>
                  <div>{selectedIssue.line}</div>
                </div>
              </div>
              <div>
                <div className="text-sm font-medium text-gray-400">Composant</div>
                <div>{selectedIssue.component}</div>
              </div>
              <div>
                <div className="text-sm font-medium text-gray-400">Message</div>
                <div>{selectedIssue.message}</div>
              </div>
              <div>
                <div className="text-sm font-medium text-gray-400">Règle</div>
                <div className="space-y-2">
                  <div><b>Nom :</b> {selectedIssue.details.rule.name}</div>
                  <div><b>Description :</b> {selectedIssue.details.rule.description}</div>
                  <div><b>Effort :</b> {selectedIssue.details.effort}</div>
                  <div><b>Tags :</b> {selectedIssue.details.tags.join(", ")}</div>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Dialog pour les détails d'un hotspot */}
      <Dialog open={openHotspotDetails} onOpenChange={setOpenHotspotDetails}>
        <DialogContent className="bg-gray-900">
          <DialogHeader>
            <DialogTitle>Détails du hotspot</DialogTitle>
            <DialogClose />
          </DialogHeader>
          {selectedHotspot && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <div className="text-sm font-medium text-gray-400">Statut</div>
                  <div>{selectedHotspot.status}</div>
                </div>
                <div>
                  <div className="text-sm font-medium text-gray-400">Ligne</div>
                  <div>{selectedHotspot.line}</div>
                </div>
              </div>
              <div>
                <div className="text-sm font-medium text-gray-400">Composant</div>
                <div>{selectedHotspot.component}</div>
              </div>
              <div>
                <div className="text-sm font-medium text-gray-400">Message</div>
                <div>{selectedHotspot.message}</div>
              </div>
              <div>
                <div className="text-sm font-medium text-gray-400">Règle</div>
                <div className="space-y-2">
                  <div><b>Nom :</b> {selectedHotspot.details.rule.name}</div>
                  <div><b>Description :</b> {selectedHotspot.details.rule.description}</div>
                  <div><b>Effort :</b> {selectedHotspot.details.effort}</div>
                  <div><b>Tags :</b> {selectedHotspot.details.tags.join(", ")}</div>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
} 