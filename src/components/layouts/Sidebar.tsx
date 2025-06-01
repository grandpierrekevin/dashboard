import React, { useEffect, useRef, useCallback } from "react";
import { Link, useNavigate, useRouter } from "@tanstack/react-router";
import { Home, LayoutDashboard, Settings, User, Bell, ChevronLeft, ChevronRight, ChevronDown, ChevronUp, Github, Gitlab, Wrench, Bug, Shield, Grid } from "lucide-react";
import { ThemeToggle } from "@/components/ui/ThemeToggle";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { NotificationsPopover } from "./NotificationsPopover";
import { useSidebar } from "@/components/layouts/SidebarContext";
import { useIntegrations } from "@/context/IntegrationsContext";
import { cn } from "@/lib/utils";
import type { Integration } from "@/types/integrations";
import { useGlobalSearch } from "@/hooks/useGlobalSearch";
import { Logo } from "@/components/ui/logo";
import { useTestNotifications } from '@/hooks/useTestNotifications';
import { OptimizedImage } from "@/components/ui/optimized-image";

// Mock utilisateur (à déplacer dans un contexte d'authentification)
const mockUser = {
  name: "Kévin",
  avatarUrl: "https://ui-avatars.com/api/?name=kevin+G&background=2563eb&color=fff&size=128",
};

type MenuItem = {
  to: string;
  label: string;
  icon: React.ReactNode;
  aria: string;
  exact?: boolean;
  children?: { to: string; label: string; }[];
};

// Type pour SidebarItem
interface SidebarItemProps {
  to: string;
  icon: React.ReactNode;
  label: string;
  aria: string;
  exact?: boolean;
  collapsed: boolean;
  pathname: string;
  rightElement?: React.ReactNode;
}


// Nouveau composant SidebarMenuItem
interface SidebarMenuItemProps {
  to: string;
  icon: React.ReactNode;
  label: string;
  aria: string;
  exact?: boolean;
  collapsed: boolean;
  pathname: string;
  rightElement?: React.ReactNode;
  hasSubmenu?: boolean;
  open?: boolean;
  onToggle?: () => void;
  className?: string;
  forceCrescent?: boolean;
  onClick?: () => void;
}

function SidebarMenuItem({ to, icon, label, aria, exact, collapsed, pathname, rightElement, hasSubmenu, open, onToggle, className, forceCrescent, onClick }: SidebarMenuItemProps) {
  const isActive = exact ? pathname === to : pathname.startsWith(to);
  const { setCollapsed } = useSidebar();

  const handleClick = () => {
    if (onClick) {
      onClick();
    }
  };

  // Détection spéciale pour Accueil
  const isAccueil = to === "/";
  const activeClasses = isAccueil
    ? "text-white font-bold" 
    : "bg-primary text-white font-bold shadow";

  const commonProps = {
    className: cn(
      "group flex items-center w-full h-12 rounded-full transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] cursor-pointer px-0 pl-3",
      "hover:bg-gray-100/80 dark:hover:bg-gray-800/80",
      "active:scale-[0.98] active:duration-150",
      isActive ? activeClasses : "",
      className
    ),
    "aria-label": aria,
    tabIndex: 0,
    onClick: handleClick
  };
  return hasSubmenu ? (
    <button
      type="button"
      {...commonProps}
      aria-expanded={open}
      aria-controls={label + "-submenu"}
      onClick={onToggle}
    >
      <span className="relative flex items-center justify-center w-12 h-12">
        {(isActive || forceCrescent) && (
          <span className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-1/2 z-10">
            <svg width="24" height="40" viewBox="-10 0 24 40" fill="none" className={cn("block", collapsed && "opacity-50")}>
              <circle cx="12" cy="20" r="20" fill="#fff" />
              <circle cx="18" cy="20" r="20" fill="white" className="dark:fill-gray-900" />
            </svg>
          </span>
        )}
        <span className="relative z-20">{icon}</span>
      </span>
      {!collapsed && <span className="flex-1 ml-4 text-base font-medium relative z-20">{label}</span>}
      {!collapsed && (
        <span className="min-w-[32px] flex items-center justify-end pr-4">
          {rightElement || null}
        </span>
      )}
    </button>
  ) : (
    <Link
      to={to}
      {...commonProps}
    >
      <span className="relative flex items-center justify-center w-12 h-12">
        {(isActive || forceCrescent) && (
          <span className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-1/2 z-10">
            <svg width="24" height="40" viewBox="-10 0 24 40" fill="none" className={cn("block", collapsed && "opacity-50")}>
              <circle cx="12" cy="20" r="20" fill="#fff" />
              <circle cx="18" cy="20" r="20" fill="white" className="dark:fill-gray-900" />
            </svg>
          </span>
        )}
        <span className="relative z-20">{icon}</span>
      </span>
      {!collapsed && <span className="flex-1 ml-4 text-base font-medium relative z-20">{label}</span>}
      {!collapsed && (
        <span className="min-w-[32px] flex items-center justify-end pr-4">
          {rightElement || null}
        </span>
      )}
    </Link>
  );
}

/**
 * Composant de navigation latérale
 * Gère l'affichage responsive et les interactions utilisateur
 */
export function Sidebar() {
  const [open, setOpen] = React.useState(false);
  const { collapsed, setCollapsed } = useSidebar();
  const [dashboardOpen, setDashboardOpen] = useState(false);
  const [adminOpen, setAdminOpen] = useState(false);
  const { integrations } = useIntegrations();
  const activeIntegrations = integrations.filter(i => i.active);
  const navigate = useNavigate();
  const [dashboardPopoverOpen, setDashboardPopoverOpen] = useState(false);
  const [adminPopoverOpen, setAdminPopoverOpen] = useState(false);
  const dashboardPopoverTimeout = useRef<NodeJS.Timeout | null>(null);
  const adminPopoverTimeout = useRef<NodeJS.Timeout | null>(null);
  const { state } = useRouter();
  const pathname = state.location.pathname;
  const sidebarRef = useRef<HTMLElement>(null);

  const handleLinkClick = () => {
    // Fermer la sidebar mobile
    setOpen(false);
    // Replier la sidebar dans tous les cas
    setCollapsed(true);
  };

  // Navigation items avec gestion des sous-menus
  const menu: MenuItem[] = [
    { 
      to: "/", 
      label: "Accueil", 
      icon: <Home size={28} />, 
      aria: "Accueil",
      exact: true
    },
    {
      to: "/dashboard",
      label: "Dashboard",
      icon: <LayoutDashboard size={28} />,
      aria: "Dashboard",
      children: [
        { to: "/dashboard", label: "Vue globale" }
      ]
    },
  ];

  const adminMenu: MenuItem[] = [
    { 
      to: "/admin/integrations", 
      label: "Intégrations", 
      icon: <Settings size={28} />, 
      aria: "Paramètres d'intégration" 
    },
    { 
      to: "/admin/correlation", 
      label: "Corrélation", 
      icon: <Shield size={28} />, 
      aria: "Règles de corrélation" 
    },
  ];

  // Fonction pour déterminer si un élément de menu est actif
  const isMenuItemActive = useCallback((item: MenuItem) => {
    if (item.exact) {
      return pathname === item.to;
    }
    return pathname.startsWith(item.to);
  }, [pathname]);

  // Fonction pour obtenir la classe CSS d'un élément de menu
  const getMenuItemClass = useCallback((item: MenuItem) => {
    return cn(
      "flex items-center w-full pl-4 pr-3 h-12 rounded-full transition-colors text-gray-700 dark:text-gray-200 focus:outline-none",
      collapsed && "justify-center pl-0 pr-0",
      isMenuItemActive(item)
        ? "bg-primary text-white font-bold shadow border-l-4 border-primary rounded-l-2xl"
        : "hover:bg-gray-100 dark:hover:bg-gray-800"
    );
  }, [collapsed, isMenuItemActive]);

  // Recherche globale
  const { query, setQuery, filteredMenu, filteredIntegrations } = useGlobalSearch(
    [...menu, ...adminMenu],
    activeIntegrations
  );

  const isDashboardActive = pathname.startsWith("/dashboard");
  const isDashboardRootActive = pathname === "/dashboard";
  const isAdminActive = pathname.startsWith("/admin");
  const getIntegrationIcon = useCallback((name: string) => {
    const icons = {
      "GitHub": <Github size={20} />,
      "GitLab": <Gitlab size={20} />,
      "Jenkins": <Wrench size={20} />,
      "Jira": <Bug size={20} />,
      "SonarQube": <Shield size={20} />,
    };
    return icons[name as keyof typeof icons] || null;
  }, []);

  // Remplace la fonction isActiveOrChild par une version qui gère tous les enfants de Dashboard
  const dashboardChildren = [
    "/dashboard",
    "/github",
    "/gitlab",
    "/jenkins",
    "/jira",
    "/sonarqube",
    "/sonar"
  ];
  const isActiveOrChild = useCallback((base: string) => {
    if (base === "/dashboard") {
      return dashboardChildren.some(path => pathname === path);
    }
    return pathname === base || pathname.startsWith(base + "/");
  }, [pathname]);

  // 1. Définir une fonction utilitaire pour savoir si un enfant du menu est actif
  const isAnyDashboardChildActive = dashboardChildren.some(path => pathname === path && path !== "/dashboard");

  // 2. Idem pour Admin si besoin (à adapter si tu as des sous-menus Admin)
  const adminChildren = ["/admin/integrations", "/admin/correlation"];
  const isAnyAdminChildActive = adminChildren.some(path => pathname === path);

  // Gestion du responsive
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setCollapsed(true);
      }
    };
    window.addEventListener('resize', handleResize);
    handleResize();
    return () => window.removeEventListener('resize', handleResize);
  }, [setCollapsed]);

  // Gestion du clic en dehors
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (sidebarRef.current && !sidebarRef.current.contains(event.target as Node)) {
        setCollapsed(true);
      }
    };

    if (window.innerWidth >= 768) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [setCollapsed]);

  // Désactive le scroll du body quand le drawer mobile est ouvert
  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [open]);

  // Fonctions pour Dashboard
  const handleDashboardEnter = () => {
    if (dashboardPopoverTimeout.current) clearTimeout(dashboardPopoverTimeout.current);
    setDashboardPopoverOpen(true);
  };
  const handleDashboardLeave = () => {
    dashboardPopoverTimeout.current = setTimeout(() => setDashboardPopoverOpen(false), 150);
  };
  const handleDashboardKeyDown = useCallback((e: React.KeyboardEvent<HTMLDivElement>) => {
    if ((e.key === 'Enter' || e.key === ' ') && !dashboardPopoverOpen) {
      e.preventDefault();
      setDashboardPopoverOpen(true);
    } else if (e.key === 'Escape') {
      setDashboardPopoverOpen(false);
    }
  }, [dashboardPopoverOpen]);

  // Fonctions pour Admin
  const handleAdminEnter = () => {
    if (adminPopoverTimeout.current) clearTimeout(adminPopoverTimeout.current);
    setAdminPopoverOpen(true);
  };
  const handleAdminLeave = () => {
    adminPopoverTimeout.current = setTimeout(() => setAdminPopoverOpen(false), 150);
  };
  const handleAdminKeyDown = useCallback((e: React.KeyboardEvent<HTMLDivElement>) => {
    if ((e.key === 'Enter' || e.key === ' ') && !adminPopoverOpen) {
      e.preventDefault();
      setAdminPopoverOpen(true);
    } else if (e.key === 'Escape') {
      setAdminPopoverOpen(false);
    }
  }, [adminPopoverOpen]);

  // Ajouter des notifications de test en développement
  if (process.env.NODE_ENV === 'development') {
    useTestNotifications();
  }

  // Composant de chargement
  const LoadingSpinner = () => (
    <div className="flex items-center justify-center p-4">
      <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
    </div>
  );

  // Utilitaire pour savoir si une route outil est active
  const isIntegrationActive = (name: string) => {
    const route = `/${name.toLowerCase()}`;
    return pathname === route;
  };

  // Affichage mobile : drawer (md:hidden)
  if (typeof window !== 'undefined' && window.innerWidth < 768) {
  return (
    <>
        {/* Bouton burger mobile */}
      <button
          className="md:hidden fixed top-4 left-4 z-50 bg-gray-900/90 p-2 rounded text-white"
          onClick={() => setOpen(true)}
        aria-label="Ouvrir le menu"
      >
          <span className="sr-only">Menu</span>
        <svg width="24" height="24" fill="none" aria-hidden="true">
          <rect x="4" y="7" width="16" height="2" rx="1" fill="currentColor" />
          <rect x="4" y="15" width="16" height="2" rx="1" fill="currentColor" />
        </svg>
      </button>
        {/* Drawer mobile */}
        {open && (
        <aside
          id="sidebar-menu"
            className={cn(
              "fixed top-0 left-0 z-40 h-full w-64 flex flex-col",
              "transform transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)]",
              "backdrop-blur-sm bg-white/95 dark:bg-gray-900/95",
              "border-r border-gray-200/50 dark:border-gray-800/50",
              open ? "translate-x-0" : "-translate-x-full",
              "shadow-[0_0_0_1px_rgba(0,0,0,0.05),0_4px_6px_-1px_rgba(0,0,0,0.1),0_2px_4px_-1px_rgba(0,0,0,0.06)]",
              "dark:shadow-[0_0_0_1px_rgba(255,255,255,0.05),0_4px_6px_-1px_rgba(0,0,0,0.2),0_2px_4px_-1px_rgba(0,0,0,0.1)]"
            )}
            role="navigation"
            aria-label="Menu principal"
        >
            {/* Avatar utilisateur en haut */}
            <div className="p-4 flex flex-col items-center">
              <OptimizedImage
                src={mockUser.avatarUrl}
                alt={mockUser.name}
                className="w-10 h-10 rounded-full border-2 border-blue-500 shadow mb-2"
              />
              <div className="flex items-center gap-3">
                <Logo />
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setOpen(false)}
                className="flex mt-4"
                aria-label="Fermer le menu"
              >
                <ChevronLeft size={20} />
              </Button>
            </div>
            {/* Barre de recherche mobile (optionnel) */}
            <div className="w-full px-2 pb-2 md:hidden">
              {/* Réutilise la barre de recherche globale si besoin */}
            </div>
            <nav className="flex-1 flex flex-col items-center gap-2 px-2 mt-2">
              <SidebarMenuItem
                to={menu[0].to}
                icon={<Home size={28} />}
                label={menu[0].label}
                aria={menu[0].aria}
                exact={menu[0].exact}
                collapsed={collapsed}
                pathname={pathname}
                rightElement={<span className="w-[18px] pr-4" />}
                className={cn(!collapsed && "ml-2")}
                onClick={handleLinkClick}
              />
              <SidebarMenuItem
                to={menu[1].to}
                icon={<LayoutDashboard size={28} />}
                label={menu[1].label}
                aria={menu[1].aria}
                exact={menu[1].exact}
                collapsed={collapsed}
                pathname={pathname}
                hasSubmenu
                open={dashboardOpen}
                onToggle={() => setDashboardOpen(o => !o)}
                rightElement={<span>{dashboardOpen ? <ChevronUp size={18} /> : <ChevronDown size={18} />}</span>}
                forceCrescent={isAnyDashboardChildActive}
                onClick={handleLinkClick}
              />
              <SidebarMenuItem
                to={adminMenu[0].to}
                icon={<Settings size={28} />}
                label="Admin"
                aria="Admin"
                collapsed={collapsed}
                pathname={pathname}
                hasSubmenu
                open={adminOpen}
                onToggle={() => setAdminOpen(o => !o)}
                rightElement={<span>{adminOpen ? <ChevronUp size={18} /> : <ChevronDown size={18} />}</span>}
                forceCrescent={isAnyAdminChildActive}
                onClick={handleLinkClick}
              />
            </nav>
            <div className="mt-auto p-4 border-t border-gray-200 dark:border-gray-800 flex flex-col items-center gap-2">
              <NotificationsPopover />
              <Link 
                to="/profile" 
                aria-label="Profil" 
                className="w-12 h-12 flex items-center justify-center rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              >
                <User className="h-6 w-6" />
              </Link>
              <div className="flex items-center justify-center">
                <ThemeToggle />
            </div>
          </div>
        </aside>
      )}
        {/* Overlay mobile avec animation sophistiquée */}
        {open && (
          <div
            className={cn(
              "fixed inset-0 z-30 md:hidden",
              "bg-black/40 backdrop-blur-[2px]",
              "transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)]",
              "animate-in fade-in duration-700"
            )}
            onClick={() => setOpen(false)}
            aria-hidden="true"
          />
        )}
      </>
    );
  }

  // Sidebar étendue : sous-modules dans un collapse sous Dashboard
  return (
        <>
          <aside
        ref={sidebarRef}
        className={cn(
          "fixed top-0 left-0 z-50 h-full bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800 flex flex-col",
          "transform transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)]",
          "backdrop-blur-sm bg-white/95 dark:bg-gray-900/95",
          collapsed ? "w-16" : "w-64",
          collapsed ? "-translate-x-0" : "translate-x-0",
          "shadow-[0_0_0_1px_rgba(0,0,0,0.05),0_4px_6px_-1px_rgba(0,0,0,0.1),0_2px_4px_-1px_rgba(0,0,0,0.06)]",
          "dark:shadow-[0_0_0_1px_rgba(255,255,255,0.05),0_4px_6px_-1px_rgba(0,0,0,0.2),0_2px_4px_-1px_rgba(0,0,0,0.1)]"
        )}
            role="navigation"
            aria-label="Menu principal étendu"
          >
        {/* Profil utilisateur en haut */}
        <div className={cn("flex items-center gap-3 p-4 pb-2", collapsed && "justify-center")}>
          <OptimizedImage
            src={mockUser.avatarUrl}
            alt={mockUser.name}
            className="w-10 h-10 rounded-full border-2 border-blue-500 shadow"
          />
          {!collapsed && (
            <div className="flex flex-col">
              <span className="font-semibold text-base text-gray-900 dark:text-white">{mockUser.name}</span>
              <span className="text-xs text-gray-500 dark:text-gray-400">devops@demo.com</span>
            </div>
          )}
          {/* Menu déroulant (mock) */}
          {!collapsed && (
            <div className="ml-auto relative group">
              <button className="p-1 rounded hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
                <svg width="20" height="20" fill="none"><circle cx="10" cy="4" r="1.5" fill="currentColor"/><circle cx="10" cy="10" r="1.5" fill="currentColor"/><circle cx="10" cy="16" r="1.5" fill="currentColor"/></svg>
              </button>
              <div className="absolute right-0 mt-2 w-40 bg-white dark:bg-gray-800 rounded shadow-lg border border-gray-200 dark:border-gray-700 opacity-0 group-hover:opacity-100 pointer-events-none group-hover:pointer-events-auto transition-opacity z-50">
                <button className="block w-full text-left px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700">Préférences</button>
                <button className="block w-full text-left px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700">Déconnexion</button>
              </div>
            </div>
          )}
        </div>

        {/* Barre de recherche globale */}
        {!collapsed && (
          <div className="px-4 pb-2">
            <input
              type="text"
              value={query}
              onChange={e => setQuery(e.target.value)}
              placeholder="Rechercher..."
              className="w-full px-3 py-2 rounded bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
              aria-label="Recherche globale"
            />
            {query && (
              <div className="mt-2 bg-white dark:bg-gray-900 rounded shadow border border-gray-200 dark:border-gray-700 max-h-48 overflow-y-auto z-50">
                <div className="text-xs text-gray-500 px-3 pt-2 pb-1">Outils</div>
                {filteredIntegrations.length === 0 && <div className="px-3 py-2 text-gray-400">Aucun outil</div>}
                {filteredIntegrations.map(i => (
                  <Link
                    key={i.name}
                    to={(`/${i.name.toLowerCase()}` as any)}
                    className={cn(
                      "flex items-center gap-2 px-3 py-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded",
                      pathname === `/${i.name.toLowerCase()}`
                        ? "bg-primary text-white font-bold shadow border-l-4 border-primary"
                        : "hover:bg-gray-100 dark:hover:bg-gray-800"
                    )}
                  >
                    {getIntegrationIcon(i.name)}
                    <span>{i.name}</span>
                  </Link>
                ))}
                <div className="text-xs text-gray-500 px-3 pt-2 pb-1">Menu</div>
                {filteredMenu.length === 0 && <div className="px-3 py-2 text-gray-400">Aucun menu</div>}
                {filteredMenu.map(item => (
                  <Link
                    key={item.to}
                    to={item.to}
                    className={cn(
                      "flex items-center gap-2 px-3 py-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded",
                      pathname === item.to
                        ? "bg-primary text-white font-bold shadow border-l-4 border-primary"
                        : "hover:bg-gray-100 dark:hover:bg-gray-800"
                    )}
                  >
                    {item.icon}
                    <span>{item.label}</span>
                  </Link>
                ))}
              </div>
            )}
          </div>
        )}

            <div className="p-4 flex flex-col items-center">
          <div className={cn("flex items-center gap-3", collapsed && "justify-center")}>
                <Logo />
            {!collapsed && <span className="text-xl font-bold">DevOpsHub</span>}
              </div>
              <Button
                variant="ghost"
                size="icon"
            onClick={() => setCollapsed(!collapsed)}
            className="flex mt-4 hover:bg-gray-200 dark:hover:bg-gray-800"
            aria-label={collapsed ? "Agrandir le menu" : "Réduire le menu"}
          >
            {collapsed ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
              </Button>
            </div>

        <nav className="flex-1 flex flex-col gap-2 px-2 mt-2">
          {/* Accueil */}
          <SidebarMenuItem
            to={menu[0].to}
            icon={<Home size={28} />}
            label={menu[0].label}
            aria={menu[0].aria}
            exact={menu[0].exact}
            collapsed={collapsed}
            pathname={pathname}
            rightElement={<span className="w-[18px] pr-4" />}
            className={cn(!collapsed && "ml-1")}
            onClick={handleLinkClick}
          />
          {/* Dashboard avec sous-menu */}
          {collapsed ? (
            <div
              className="relative group"
              onMouseEnter={handleDashboardEnter}
              onMouseLeave={handleDashboardLeave}
              tabIndex={0}
              onFocus={handleDashboardEnter}
              onBlur={handleDashboardLeave}
              onKeyDown={handleDashboardKeyDown}
            >
              <SidebarMenuItem
                to={menu[1].to}
                icon={<LayoutDashboard size={28} />}
                label={menu[1].label}
                aria={menu[1].aria}
                exact={menu[1].exact}
                collapsed={collapsed}
                pathname={pathname}
                hasSubmenu
                open={dashboardPopoverOpen}
                onToggle={() => setDashboardPopoverOpen(o => !o)}
                rightElement={<span>{dashboardPopoverOpen ? <ChevronUp size={18} /> : <ChevronDown size={18} />}</span>}
                className={cn(!collapsed && "ml-1")}
                forceCrescent={isAnyDashboardChildActive}
                onClick={handleLinkClick}
              />
              {dashboardPopoverOpen && (
                <div className="absolute left-full top-1/2 -translate-y-1/2 ml-4 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded shadow-lg py-2 px-3 z-50 min-w-[160px] flex flex-col gap-1">
                  <Link
                    to="/dashboard"
                    className={cn(
                      "flex items-center h-10 rounded px-2 text-gray-700 dark:text-gray-200 text-sm relative pl-3",
                      pathname === "/dashboard" ? "bg-primary text-white font-bold shadow" : "hover:bg-gray-100 dark:hover:bg-gray-800"
                    )}
                    aria-current={pathname === "/dashboard" ? "page" : undefined}
                    onClick={handleLinkClick}
                  >
                    {pathname === "/dashboard" && (
                      <span className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-1/2 z-30">
                        <svg width="24" height="40" viewBox="-10 0 24 40" fill="none" className={cn("block", collapsed && "opacity-50")}>
                          <circle cx="12" cy="20" r="20" fill="#fff" />
                          <circle cx="18" cy="20" r="20" fill="white" className="dark:fill-gray-900" />
                        </svg>
                      </span>
                    )}
                    <Grid size={18} className="mr-2 relative z-20" />
                    <span className="relative z-20">Vue globale</span>
                  </Link>
                  {activeIntegrations.map((integration) => {
                    const route = `/${integration.name.toLowerCase()}`;
                    const isActive = pathname === route;
                    return (
                      <Link
                        key={integration.name}
                        to={route}
                        className={cn(
                          "flex items-center h-10 rounded px-2 text-gray-700 dark:text-gray-200 text-sm relative pl-3",
                          isActive
                            ? "bg-primary text-white font-bold shadow"
                            : "hover:bg-gray-100 dark:hover:bg-gray-800"
                        )}
                        aria-current={isActive ? "page" : undefined}
                        onClick={handleLinkClick}
                      >
                        {isActive && (
                          <span className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-1/2 z-30">
                            <svg width="24" height="40" viewBox="-10 0 24 40" fill="none" className={cn("block", collapsed && "opacity-50")}>
                              <circle cx="12" cy="20" r="20" fill="#fff" />
                              <circle cx="18" cy="20" r="20" fill="white" className="dark:fill-gray-900" />
                            </svg>
                          </span>
                        )}
                        {getIntegrationIcon(integration.name)}
                        <span className="ml-2 relative z-20">{integration.name}</span>
                      </Link>
                    );
                  })}
                </div>
              )}
            </div>
          ) : (
            <>
              <SidebarMenuItem
                to={menu[1].to}
                icon={<LayoutDashboard size={28} />}
                label={menu[1].label}
                aria={menu[1].aria}
                exact={menu[1].exact}
                collapsed={collapsed}
                pathname={pathname}
                hasSubmenu
                open={dashboardOpen}
                onToggle={() => setDashboardOpen(o => !o)}
                rightElement={<span>{dashboardOpen ? <ChevronUp size={18} /> : <ChevronDown size={18} />}</span>}
                className={cn(!collapsed && "ml-1")}
                forceCrescent={isAnyDashboardChildActive}
                onClick={handleLinkClick}
              />
              {dashboardOpen && (
                <div className="flex flex-col gap-1 mt-1 py-1 ml-8">
                  <Link
                    to="/dashboard"
                    className={cn(
                      "flex items-center h-10 rounded px-2 text-gray-700 dark:text-gray-200 text-sm relative pl-3",
                      pathname === "/dashboard" ? "bg-primary text-white font-bold shadow" : "hover:bg-gray-100 dark:hover:bg-gray-800"
                    )}
                    aria-current={pathname === "/dashboard" ? "page" : undefined}
                    onClick={handleLinkClick}
                  >
                    {pathname === "/dashboard" && (
                      <span className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-1/2 z-30">
                        <svg width="24" height="40" viewBox="-10 0 24 40" fill="none" className={cn("block", collapsed && "opacity-50")}>
                          <circle cx="12" cy="20" r="20" fill="#fff" />
                          <circle cx="18" cy="20" r="20" fill="white" className="dark:fill-gray-900" />
                        </svg>
                      </span>
                    )}
                    <Grid size={18} className="mr-2 relative z-20" />
                    <span className="relative z-20">Vue globale</span>
                  </Link>
                  {activeIntegrations.map((integration) => {
                    const route = `/${integration.name.toLowerCase()}`;
                    const isActive = pathname === route;
                    return (
                      <Link
                        key={integration.name}
                        to={route}
                        className={cn(
                          "flex items-center h-10 rounded px-2 text-gray-700 dark:text-gray-200 text-sm relative pl-3",
                          isActive
                            ? "bg-primary text-white font-bold shadow"
                            : "hover:bg-gray-100 dark:hover:bg-gray-800"
                        )}
                        aria-current={isActive ? "page" : undefined}
                        onClick={handleLinkClick}
                      >
                        {isActive && (
                          <span className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-1/2 z-30">
                            <svg width="24" height="40" viewBox="-10 0 24 40" fill="none" className={cn("block", collapsed && "opacity-50")}>
                              <circle cx="12" cy="20" r="20" fill="#fff" />
                              <circle cx="18" cy="20" r="20" fill="white" className="dark:fill-gray-900" />
                            </svg>
                          </span>
                        )}
                        {getIntegrationIcon(integration.name)}
                        <span className="ml-2 relative z-20">{integration.name}</span>
                      </Link>
                    );
                  })}
                </div>
              )}
            </>
          )}
          {/* Admin avec sous-menu */}
          {collapsed ? (
            <div
              className="relative group"
              onMouseEnter={handleAdminEnter}
              onMouseLeave={handleAdminLeave}
              tabIndex={0}
              onFocus={handleAdminEnter}
              onBlur={handleAdminLeave}
              onKeyDown={handleAdminKeyDown}
            >
              <SidebarMenuItem
                to="/admin"
                icon={<Settings size={28} />}
                label="Admin"
                aria="Admin"
                collapsed={collapsed}
                pathname={pathname}
                hasSubmenu
                open={adminPopoverOpen}
                onToggle={() => setAdminPopoverOpen(o => !o)}
                rightElement={<span>{adminPopoverOpen ? <ChevronUp size={18} /> : <ChevronDown size={18} />}</span>}
                className={cn(!collapsed && "ml-1")}
                forceCrescent={isAnyAdminChildActive}
                onClick={handleLinkClick}
              />
              {adminPopoverOpen && (
                <div className="absolute left-full top-1/2 -translate-y-1/2 ml-4 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded shadow-lg py-2 px-3 z-50 min-w-[160px] flex flex-col gap-1">
                  <Link
                    to="/admin/integrations"
                    className={cn(
                      "flex items-center h-10 rounded px-2 text-gray-700 dark:text-gray-200 text-sm relative pl-3",
                      pathname === "/admin/integrations" ? "bg-primary text-white font-bold shadow" : "hover:bg-gray-100 dark:hover:bg-gray-800"
                    )}
                    aria-current={pathname === "/admin/integrations" ? "page" : undefined}
                    onClick={handleLinkClick}
                  >
                    {pathname === "/admin/integrations" && (
                      <span className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-1/2 z-30">
                        <svg width="24" height="40" viewBox="-10 0 24 40" fill="none" className={cn("block", collapsed && "opacity-50")}>
                          <circle cx="12" cy="20" r="20" fill="#fff" />
                          <circle cx="18" cy="20" r="20" fill="white" className="dark:fill-gray-900" />
                        </svg>
                      </span>
                    )}
                    <Settings size={20} className="relative z-20" />
                    <span className="ml-2 relative z-20">Intégrations</span>
                  </Link>
                  <Link
                    to="/admin/correlation"
                    className={cn(
                      "flex items-center h-10 rounded px-2 text-gray-700 dark:text-gray-200 text-sm relative pl-3",
                      pathname === "/admin/correlation" ? "bg-primary text-white font-bold shadow" : "hover:bg-gray-100 dark:hover:bg-gray-800"
                    )}
                    aria-current={pathname === "/admin/correlation" ? "page" : undefined}
                    onClick={handleLinkClick}
                  >
                    {pathname === "/admin/correlation" && (
                      <span className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-1/2 z-30">
                        <svg width="24" height="40" viewBox="-10 0 24 40" fill="none" className={cn("block", collapsed && "opacity-50")}>
                          <circle cx="12" cy="20" r="20" fill="#fff" />
                          <circle cx="18" cy="20" r="20" fill="white" className="dark:fill-gray-900" />
                        </svg>
                      </span>
                    )}
                    <Shield size={20} className="relative z-20" />
                    <span className="ml-2 relative z-20">Corrélation</span>
                  </Link>
                </div>
              )}
            </div>
          ) : (
            <>
              <SidebarMenuItem
                to="/admin"
                icon={<Settings size={28} />}
                label="Admin"
                aria="Admin"
                collapsed={collapsed}
                pathname={pathname}
                hasSubmenu
                open={adminOpen}
                onToggle={() => setAdminOpen(o => !o)}
                rightElement={<span>{adminOpen ? <ChevronUp size={18} /> : <ChevronDown size={18} />}</span>}
                className={cn(!collapsed && "ml-1")}
                forceCrescent={isAnyAdminChildActive}
                onClick={handleLinkClick}
              />
              {adminOpen && (
                <div className="flex flex-col gap-1 mt-1 py-1 ml-8">
                  <Link
                    to="/admin/integrations"
                    className={cn(
                      "flex items-center h-10 rounded px-2 text-gray-700 dark:text-gray-200 text-sm relative pl-3",
                      pathname === "/admin/integrations" ? "bg-primary text-white font-bold shadow" : "hover:bg-gray-100 dark:hover:bg-gray-800"
                    )}
                    aria-current={pathname === "/admin/integrations" ? "page" : undefined}
                    onClick={handleLinkClick}
                  >
                    {pathname === "/admin/integrations" && (
                      <span className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-1/2 z-30">
                        <svg width="24" height="40" viewBox="-10 0 24 40" fill="none" className={cn("block", collapsed && "opacity-50")}>
                          <circle cx="12" cy="20" r="20" fill="#fff" />
                          <circle cx="18" cy="20" r="20" fill="white" className="dark:fill-gray-900" />
                        </svg>
                      </span>
                    )}
                    <Settings size={20} className="relative z-20" />
                    <span className="ml-2 relative z-20">Intégrations</span>
                  </Link>
                  <Link
                    to="/admin/correlation"
                    className={cn(
                      "flex items-center h-10 rounded px-2 text-gray-700 dark:text-gray-200 text-sm relative pl-3",
                      pathname === "/admin/correlation" ? "bg-primary text-white font-bold shadow" : "hover:bg-gray-100 dark:hover:bg-gray-800"
                    )}
                    aria-current={pathname === "/admin/correlation" ? "page" : undefined}
                    onClick={handleLinkClick}
                  >
                    {pathname === "/admin/correlation" && (
                      <span className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-1/2 z-30">
                        <svg width="24" height="40" viewBox="-10 0 24 40" fill="none" className={cn("block", collapsed && "opacity-50")}>
                          <circle cx="12" cy="20" r="20" fill="#fff" />
                          <circle cx="18" cy="20" r="20" fill="white" className="dark:fill-gray-900" />
                        </svg>
                      </span>
                    )}
                    <Shield size={20} className="relative z-20" />
                    <span className="ml-2 relative z-20">Corrélation</span>
                  </Link>
                </div>
              )}
            </>
          )}
        </nav>

        <div className="mt-auto p-4 border-t border-gray-200 dark:border-gray-800 flex flex-col items-center gap-2">
              <NotificationsPopover />
              <Link 
                to="/profile" 
                aria-label="Profil" 
                className="w-12 h-12 flex items-center justify-center rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              >
                <User className="h-6 w-6" />
              </Link>
          <div className="flex items-center justify-center">
                <ThemeToggle />
              </div>
            </div>
          </aside>
    </>
  );
}
