import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { Integration } from "@/types/dashboard";

interface IntegrationsContextType {
  integrations: Integration[];
  toggleIntegration: (name: string) => void;
  setIntegrations: React.Dispatch<React.SetStateAction<Integration[]>>;
}

const IntegrationsContext = createContext<IntegrationsContextType | undefined>(undefined);

const defaultIntegrations: Integration[] = [
  { name: "GitHub", active: true },
  { name: "GitLab", active: true },
  { name: "Jenkins", active: true },
  { name: "Jira", active: true },
  { name: "SonarQube", active: true },
];

export function IntegrationsProvider({ children }: { children: ReactNode }) {
  const [integrations, setIntegrations] = useState<Integration[]>(() => {
    try {
      const saved = localStorage.getItem("integrations");
      return saved ? JSON.parse(saved) : defaultIntegrations;
    } catch {
      return defaultIntegrations;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem("integrations", JSON.stringify(integrations));
    } catch {}
  }, [integrations]);

  const toggleIntegration = (name: string) => {
    setIntegrations(prev =>
      prev.map(i => (i.name === name ? { ...i, active: !i.active } : i))
    );
  };

  return (
    <IntegrationsContext.Provider value={{ integrations, toggleIntegration, setIntegrations }}>
      {children}
    </IntegrationsContext.Provider>
  );
}

export function useIntegrations() {
  const context = useContext(IntegrationsContext);
  if (context === undefined) {
    throw new Error("useIntegrations must be used within an IntegrationsProvider");
  }
  return context;
}
