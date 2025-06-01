import React from 'react';

export interface DashboardFilters {
  tool?: string; // ex: 'Jenkins', 'GitHub', ...
  status?: string; // ex: 'active', 'resolved', ...
  rule?: string; // ex: 'Build Failure', ...
  period?: number; // en jours
}

interface DashboardFilterContextType {
  filters: DashboardFilters;
  setFilters: (filters: DashboardFilters) => void;
  updateFilter: (key: keyof DashboardFilters, value: string | number | undefined) => void;
  resetFilters: () => void;
}

const DashboardFilterContext = React.createContext<DashboardFilterContextType | undefined>(undefined);

export const DashboardFilterProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [filters, setFilters] = React.useState<DashboardFilters>({});

  const updateFilter = (key: keyof DashboardFilters, value: string | number | undefined) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const resetFilters = () => setFilters({});

  return (
    <DashboardFilterContext.Provider value={{ filters, setFilters, updateFilter, resetFilters }}>
      {children}
    </DashboardFilterContext.Provider>
  );
};

export function useDashboardFilters() {
  const ctx = React.useContext(DashboardFilterContext);
  if (!ctx) throw new Error('useDashboardFilters must be used within DashboardFilterProvider');
  return ctx;
} 