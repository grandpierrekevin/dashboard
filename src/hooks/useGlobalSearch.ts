import { useState, useMemo } from 'react';
import type { Integration } from '@/types/integrations';

type MenuItem = {
  to: string;
  label: string;
  icon: React.ReactNode;
  aria: string;
};

/**
 * Hook personnalisé pour la recherche globale
 * Permet de filtrer les éléments du menu et les intégrations
 */
export function useGlobalSearch(menuItems: MenuItem[], integrations: Integration[]) {
  const [query, setQuery] = useState('');

  const filteredMenu = useMemo(() => {
    if (!query) return menuItems;
    const searchTerm = query.toLowerCase();
    return menuItems.filter(item => 
      item.label.toLowerCase().includes(searchTerm) ||
      item.to.toLowerCase().includes(searchTerm)
    );
  }, [menuItems, query]);

  const filteredIntegrations = useMemo(() => {
    if (!query) return integrations;
    const searchTerm = query.toLowerCase();
    return integrations.filter(integration => 
      integration.name.toLowerCase().includes(searchTerm) ||
      integration.description?.toLowerCase().includes(searchTerm)
    );
  }, [integrations, query]);

  return {
    query,
    setQuery,
    filteredMenu,
    filteredIntegrations
  };
} 