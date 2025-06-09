import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import type { CorrelationRule, CorrelationResult, CorrelationStats } from '@/types/correlation';
import { mockCorrelationRules, mockCorrelationResults } from "@/mocks/correlation";

interface CorrelationContextType {
  rules: CorrelationRule[];
  results: CorrelationResult[];
  stats: CorrelationStats;
  addRule: (rule: Omit<CorrelationRule, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateRule: (id: string, rule: Partial<CorrelationRule>) => void;
  deleteRule: (id: string) => void;
  toggleRule: (id: string) => void;
  getRuleResults: (ruleId: string) => CorrelationResult[];
  executeRules: () => Promise<void>;
}

const CorrelationContext = createContext<CorrelationContextType | undefined>(undefined);

export function CorrelationProvider({ children }: { children: React.ReactNode }) {
  const [rules, setRules] = useState<CorrelationRule[]>(mockCorrelationRules);
  const [results, setResults] = useState<CorrelationResult[]>(mockCorrelationResults);
  const [stats, setStats] = useState<CorrelationStats>({
    totalRules: mockCorrelationRules.length,
    activeRules: mockCorrelationRules.filter(rule => rule.enabled).length,
    successCount: mockCorrelationResults.filter(result => result.status === "success").length,
    failureCount: mockCorrelationResults.filter(result => result.status === "failure").length,
    lastRun: new Date(Math.max(...mockCorrelationResults.map(r => new Date(r.timestamp).getTime()))),
  });

  const addRule = useCallback((rule: Omit<CorrelationRule, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newRule: CorrelationRule = {
      ...rule,
      id: crypto.randomUUID(),
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    setRules(prev => [...prev, newRule]);
    setStats(prev => ({
      ...prev,
      totalRules: prev.totalRules + 1,
      activeRules: rule.enabled ? prev.activeRules + 1 : prev.activeRules,
    }));
  }, []);

  const updateRule = useCallback((id: string, rule: Partial<CorrelationRule>) => {
    setRules(prev => prev.map(r => 
      r.id === id 
        ? { ...r, ...rule, updatedAt: new Date() }
        : r
    ));
  }, []);

  const deleteRule = useCallback((id: string) => {
    setRules(prev => {
      const rule = prev.find(r => r.id === id);
      if (!rule) return prev;
      
      setStats(s => ({
        ...s,
        totalRules: s.totalRules - 1,
        activeRules: rule.enabled ? s.activeRules - 1 : s.activeRules,
      }));
      
      return prev.filter(r => r.id !== id);
    });
  }, []);

  const toggleRule = useCallback((id: string) => {
    setRules(prev => prev.map(rule => {
      if (rule.id === id) {
        const newEnabled = !rule.enabled;
        setStats(s => ({
          ...s,
          activeRules: newEnabled ? s.activeRules + 1 : s.activeRules - 1,
        }));
        return { ...rule, enabled: newEnabled, updatedAt: new Date() };
      }
      return rule;
    }));
  }, []);

  const getRuleResults = useCallback((ruleId: string) => {
    return results.filter(r => r.ruleId === ruleId);
  }, [results]);

  const executeRules = useCallback(async () => {
    const newResults: CorrelationResult[] = [];
    const now = new Date();

    for (const rule of rules.filter(r => r.enabled)) {
      try {
        const result: CorrelationResult = {
          id: crypto.randomUUID(),
          ruleId: rule.id,
          sourceData: {
            timestamp: now.toISOString(),
            ...(rule.source.tool === "SONARQUBE" && {
              project: "backend-api",
              vulnerabilities: 3
            }),
            ...(rule.source.tool === "JENKINS" && {
              jobName: "build-app",
              buildNumber: 100,
              status: "failed"
            })
          },
          targetData: {
            timestamp: new Date(now.getTime() + 5 * 60000).toISOString(),
            ...(rule.target.tool === "JENKINS" && {
              jobName: "security-scan",
              buildNumber: 51,
              status: "triggered"
            }),
            ...(rule.target.tool === "JIRA" && {
              ticketId: "TCK-1",
              status: "created"
            })
          },
          status: "success",
          timestamp: now.toISOString()
        };

        newResults.push(result);
      } catch (error) {
        console.error(`Erreur lors de l'exécution de la règle ${rule.id}:`, error);
        newResults.push({
          id: crypto.randomUUID(),
          ruleId: rule.id,
          sourceData: { timestamp: now.toISOString() },
          targetData: { timestamp: now.toISOString() },
          status: "failure",
          timestamp: now.toISOString()
        });
      }
    }

    setResults(prev => [...prev, ...newResults]);
    setStats(prev => ({
      ...prev,
      successCount: prev.successCount + newResults.filter(r => r.status === "success").length,
      failureCount: prev.failureCount + newResults.filter(r => r.status === "failure").length,
      lastRun: now
    }));
  }, [rules]);

  useEffect(() => {
    const interval = setInterval(executeRules, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, [executeRules]);

  const value = {
    rules,
    results,
    stats,
    addRule,
    updateRule,
    deleteRule,
    toggleRule,
    getRuleResults,
    executeRules
  };

  return (
    <CorrelationContext.Provider value={value}>
      {children}
    </CorrelationContext.Provider>
  );
}

export function useCorrelation() {
  const context = useContext(CorrelationContext);
  if (context === undefined) {
    throw new Error('useCorrelation must be used within a CorrelationProvider');
  }
  return context;
} 