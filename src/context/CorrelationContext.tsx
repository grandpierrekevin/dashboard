import React, { createContext, useContext, useState, useCallback } from 'react';
import type { CorrelationRule, CorrelationResult, CorrelationStats } from '@/types/correlation';

interface CorrelationContextType {
  rules: CorrelationRule[];
  results: CorrelationResult[];
  stats: CorrelationStats;
  addRule: (rule: Omit<CorrelationRule, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateRule: (id: string, rule: Partial<CorrelationRule>) => void;
  deleteRule: (id: string) => void;
  toggleRule: (id: string) => void;
  getRuleResults: (ruleId: string) => CorrelationResult[];
}

const CorrelationContext = createContext<CorrelationContextType | undefined>(undefined);

export function CorrelationProvider({ children }: { children: React.ReactNode }) {
  const [rules, setRules] = useState<CorrelationRule[]>([]);
  const [results, setResults] = useState<CorrelationResult[]>([]);
  const [stats, setStats] = useState<CorrelationStats>({
    totalRules: 0,
    activeRules: 0,
    successCount: 0,
    failureCount: 0,
    lastRun: new Date(),
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

  return (
    <CorrelationContext.Provider
      value={{
        rules,
        results,
        stats,
        addRule,
        updateRule,
        deleteRule,
        toggleRule,
        getRuleResults,
      }}
    >
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