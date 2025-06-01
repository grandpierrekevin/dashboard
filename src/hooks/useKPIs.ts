import { useState, useCallback } from "react";
import { KPI } from "@/types/dashboard";

const defaultKPIs: KPI[] = [
  {
    label: "Builds réussis",
    value: 0,
    color: "green",
    show: true,
  },
  {
    label: "Tests passés",
    value: 0,
    color: "blue",
    show: true,
  },
  {
    label: "Bugs",
    value: 0,
    color: "red",
    show: true,
  },
  {
    label: "Couverture",
    value: 0,
    color: "yellow",
    show: true,
  },
];

export function useKPIs() {
  const [kpis, setKPIs] = useState<KPI[]>(() => {
    const savedKPIs = localStorage.getItem("dashboard-kpis");
    return savedKPIs ? JSON.parse(savedKPIs) : defaultKPIs;
  });

  const updateKPIs = useCallback((newKPIs: KPI[]) => {
    setKPIs(newKPIs);
    localStorage.setItem("dashboard-kpis", JSON.stringify(newKPIs));
  }, []);

  const toggleKPI = useCallback((index: number) => {
    setKPIs(prevKPIs => {
      const newKPIs = [...prevKPIs];
      newKPIs[index] = { ...newKPIs[index], show: !newKPIs[index].show };
      localStorage.setItem("dashboard-kpis", JSON.stringify(newKPIs));
      return newKPIs;
    });
  }, []);

  const updateKPIValues = useCallback((data: any) => {
    setKPIs(prevKPIs => {
      const newKPIs = [...prevKPIs];
      
      // Mettre à jour les valeurs des KPIs en fonction des données
      newKPIs[0].value = data.jenkins.find((j: any) => j.name === "Build OK")?.value || 0;
      newKPIs[1].value = data.jenkins.find((j: any) => j.name === "Tests OK")?.value || 0;
      newKPIs[2].value = data.sonar.find((s: any) => s.name === "Bugs")?.value || 0;
      newKPIs[3].value = data.sonar.find((s: any) => s.name === "Coverage")?.value || 0;

      return newKPIs;
    });
  }, []);

  return {
    kpis,
    updateKPIs,
    toggleKPI,
    updateKPIValues,
  };
} 