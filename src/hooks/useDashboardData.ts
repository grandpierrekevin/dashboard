import { useQuery, useQueryClient } from "@tanstack/react-query";
import { DashboardData } from "@/types/dashboard";

const fetchDashboardData = async (): Promise<DashboardData> => {
  // Simuler un appel API
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  // Données de démonstration
  return {
    github: [
      { name: "Lun", value: 12 },
      { name: "Mar", value: 19 },
      { name: "Mer", value: 15 },
      { name: "Jeu", value: 22 },
      { name: "Ven", value: 18 },
      { name: "Sam", value: 8 },
      { name: "Dim", value: 5 },
    ],
    gitlab: [
      { name: "Lun", value: 5 },
      { name: "Mar", value: 8 },
      { name: "Mer", value: 6 },
      { name: "Jeu", value: 9 },
      { name: "Ven", value: 7 },
      { name: "Sam", value: 3 },
      { name: "Dim", value: 2 },
    ],
    jenkins: [
      { name: "Build OK", value: 45 },
      { name: "Build KO", value: 3 },
      { name: "Tests OK", value: 42 },
      { name: "Tests KO", value: 6 },
    ],
    jira: [
      { name: "To Do", tickets: 12 },
      { name: "In Progress", tickets: 8 },
      { name: "Done", tickets: 25 },
    ],
    sonar: [
      { name: "Bugs", value: 5 },
      { name: "Vulnerabilities", value: 2 },
      { name: "Code Smells", value: 15 },
      { name: "Coverage", value: 85 },
    ],
    alerts: [
      "3 jobs Jenkins en échec",
      "Attention : 5 bugs SonarQube",
    ],
  };
};

export function useDashboardData() {
  const queryClient = useQueryClient();

  const { data, isLoading, refetch } = useQuery({
    queryKey: ['dashboard'],
    queryFn: fetchDashboardData,
    staleTime: 5 * 60 * 1000, // Les données sont considérées comme fraîches pendant 5 minutes
    cacheTime: 30 * 60 * 1000, // Les données sont gardées en cache pendant 30 minutes
  });

  return {
    loading: isLoading,
    data: data || {
      github: [],
      gitlab: [],
      jenkins: [],
      jira: [],
      sonar: [],
      alerts: [],
    },
    fetchData: refetch,
  };
} 