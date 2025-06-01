import { createFileRoute } from "@tanstack/react-router";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { useIntegrations } from "@/context/IntegrationsContext";
import { toast } from "sonner";
import { PlusCircle, Link2, KeyRound, PlugZap } from "lucide-react";
import { useState, useEffect } from "react";

export const Route = createFileRoute("/admin/integrations")({
  component: AdminIntegrations,
});

function AdminIntegrations() {
  const { integrations, setIntegrations } = useIntegrations();
  const [lastToggled, setLastToggled] = useState<string | null>(null);
  const [integrationAdded, setIntegrationAdded] = useState(false);
  const [lastTested, setLastTested] = useState<{ name: string; success: boolean | null } | null>(null);

  const toggleIntegration = (name: string) => {
    setIntegrations(list =>
      list.map(i => i.name === name ? { ...i, active: !i.active } : i)
    );
    setLastToggled(name);
  };

  useEffect(() => {
    if (lastToggled) {
      toast.success("Intégration " + lastToggled + " modifiée !");
      setLastToggled(null);
    }
  }, [lastToggled]);

  const handleChange = (name: string, field: "url" | "token", value: string) => {
    setIntegrations(list =>
      list.map(i => i.name === name ? { ...i, [field]: value, tested: false } : i)
    );
  };

  // Démo : simulate test connection
  const testConnection = async (name: string) => {
    setIntegrations(list =>
      list.map(i =>
        i.name === name ? { ...i, tested: true, success: false } : i
      )
    );
    toast("Test de connexion en cours...");
    await new Promise(res => setTimeout(res, 700));
    setIntegrations(list =>
      list.map(i =>
        i.name === name
          ? {
              ...i,
              tested: true,
              success: Boolean(i.url && i.token && i.url.startsWith("http")),
            }
          : i
      )
    );
    const integ = integrations.find(i => i.name === name);
    const success = integ && integ.url && integ.token && integ.url.startsWith("http");
    setLastTested({ name, success: !!success });
  };

  useEffect(() => {
    if (lastTested) {
      if (lastTested.success) {
        toast.success(`Connexion ${lastTested.name} OK`);
      } else {
        toast.error(`Echec de connexion à ${lastTested.name}`);
      }
      setLastTested(null);
    }
  }, [lastTested]);

  const addIntegration = () => {
    setIntegrationAdded(true);
  };

  useEffect(() => {
    if (integrationAdded) {
      toast.info("Démo : Ajout d'intégration à simuler !");
      setIntegrationAdded(false);
    }
  }, [integrationAdded]);

  return (
    <div className="max-w-2xl mx-auto py-12 space-y-7">
      <div className="flex justify-between items-center mb-3">
        <h2 className="text-2xl font-bold tracking-tight">Intégrations configurées</h2>
        <Button variant="outline" onClick={addIntegration}>
          <PlusCircle className="mr-2" /> Ajouter
        </Button>
      </div>
      <Card className="shadow-xl border border-gray-200 dark:border-gray-700 rounded-2xl bg-white/90 dark:bg-gray-900/90">
        <CardContent className="p-6 space-y-7">
          <ul className="divide-y divide-gray-400 dark:divide-gray-800">
            {integrations.map(i => (
              <li key={i.name} className="py-5 flex flex-col gap-2">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-lg">{i.name}</span>
                  <Switch
                    checked={i.active}
                    onCheckedChange={() => toggleIntegration(i.name)}
                    className="
                      data-[state=checked]:bg-blue-600
                      data-[state=unchecked]:bg-gray-400
                      border border-gray-500
                      dark:border-gray-700
                      shadow
                      transition
                    "
                  />
                </div>
                {i.active && (
                  <div className="pl-3 border-l-4 border-blue-400 dark:border-blue-700 space-y-3 mt-2 bg-gray-50 dark:bg-gray-800/40 rounded-xl py-4 px-2">
                    <div className="flex items-center gap-3">
                      <Link2 size={18} className="text-blue-500" />
                      <Input
                        value={i.url}
                        placeholder="URL de l'API"
                        onChange={e => handleChange(i.name, "url", e.target.value)}
                        className="w-64 border border-gray-500"
                      />
                    </div>
                    <div className="flex items-center gap-3">
                      <KeyRound size={18} className="text-pink-500" />
                      <Input
                        value={i.token}
                        placeholder="Token d'accès"
                        onChange={e => handleChange(i.name, "token", e.target.value)}
                        type="password"
                        className="w-64 border border-gray-500"
                      />
                    </div>
                    <div className="flex items-center gap-4 mt-2">
                      <Button
                        size="sm"
                        variant="secondary"
                        onClick={() => testConnection(i.name)}
                        disabled={!i.url || !i.token}
                        className="border border-gray-500"
                      >
                        <PlugZap className="mr-2 " /> Tester la connexion
                      </Button>
                      {i.tested && (
                        <span className={i.success ? "text-green-600 dark:text-green-400 font-semibold" : "text-red-600 dark:text-red-400 font-semibold"}>
                          {i.success ? "Connexion OK" : "Erreur de connexion"}
                        </span>
                      )}
                    </div>
                  </div>
                )}
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}
