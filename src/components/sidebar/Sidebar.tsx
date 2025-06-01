import React from 'react';
import { Link, useLocation } from '@tanstack/react-router';
import { cn } from '@/lib/utils';
import {
  Menu,
  ChevronLeft,
  ChevronRight,
  Home,
  Grid,
  Settings,
  Github,
  Gitlab,
  Wrench,
  User,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import { NotificationBell } from './NotificationBell';
import { TOOL_LABELS } from '@/constants/tools';
import { HelpTooltip } from '@/components/ui/help-tooltip';
import { HELP_TEXTS } from '@/constants/help-texts';

const NAV_ITEMS = [
  { name: 'Accueil', href: '/', icon: Home },
  {
    name: 'Dashboard',
    icon: Grid,
    children: [
      { name: 'Vue globale', href: '/dashboard', icon: Grid },
      { name: 'GitHub', href: '/github', icon: Github },
      { name: 'GitLab', href: '/gitlab', icon: Gitlab },
      { name: 'Jenkins', href: '/jenkins', icon: Wrench },
      { name: 'SonarQube', href: '/sonarqube', icon: Wrench },
    ],
  },
  {
    name: 'Admin',
    icon: Settings,
    children: [
      { name: 'Intégrations', href: '/admin/integrations' },
      { name: 'Corrélation', href: '/admin/correlation' },
    ],
  },
  
];

const DIRECT_ICONS = [
  { name: 'GitHub', href: '/github', icon: Github },
  { name: 'GitLab', href: '/gitlab', icon: Gitlab },
];

export function Sidebar() {
  const [open, setOpen] = React.useState(true);
  const [mobileOpen, setMobileOpen] = React.useState(false);

  React.useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) setOpen(false);
      else setOpen(true);
    };
    window.addEventListener('resize', handleResize);
    handleResize();
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <>
      {/* Drawer mobile */}
      <div className="md:hidden">
        <button
          className="fixed top-4 left-4 z-50 bg-background rounded-full p-2 shadow"
          onClick={() => setMobileOpen(true)}
        >
          <Menu className="h-6 w-6" />
        </button>
        {mobileOpen && (
          <div className="fixed inset-0 z-40 flex">
            <div
              className="fixed inset-0 bg-black/40"
              onClick={() => setMobileOpen(false)}
            />
            <aside className="relative w-64 bg-background h-full flex flex-col p-4">
              <SidebarContent open={true} onToggle={() => setMobileOpen(false)} />
            </aside>
          </div>
        )}
      </div>
      {/* Sidebar desktop */}
      <aside
        className={cn(
          'hidden md:flex flex-col h-screen bg-background border-r transition-all duration-200 ease-in-out overflow-x-hidden',
          open ? 'w-64' : 'w-20'
        )}
      >
        <SidebarContent open={open} onToggle={() => setOpen((v) => !v)} />
      </aside>
    </>
  );
}

function SidebarContent({ open, onToggle }: { open: boolean; onToggle: () => void }) {
  const location = useLocation();
  const [expanded, setExpanded] = React.useState<{ [key: string]: boolean }>({});

  const handleExpand = (name: string) => {
    setExpanded((prev) => ({ ...prev, [name]: !prev[name] }));
  };

  function isMenuActive(item: any) {
    if (item.href && location.pathname === item.href) return true;
    if (item.children) {
      return item.children.some((child: any) => location.pathname === child.href);
    }
    return false;
  }

  const activeDirectIcons = DIRECT_ICONS.filter(
    (item) => location.pathname === item.href
  );

  return (
    <>
      {/* Logo : Toujours visible, même sidebar fermée */}
      <div className="flex items-center justify-center py-4 px-2">
        <div className="flex items-center justify-center w-10 h-10 rounded-full bg-blue-600 text-white font-bold text-lg select-none">
          KG
        </div>
        {/* Infos user visibles seulement en mode ouvert */}
        {open && (
          <div className="flex flex-col ml-3">
            <span className="font-semibold">Kévin</span>
            <span className="text-xs text-muted-foreground">devopshub@demo.com</span>
          </div>
        )}
        {/* Toggle Sidebar */}
        <button
          className={cn(
            'ml-auto p-1 rounded hover:bg-accent',
            !open && 'mx-auto'
          )}
          onClick={onToggle}
          aria-label={open ? 'Réduire la sidebar' : 'Étendre la sidebar'}
        >
          {open ? <ChevronLeft className="h-5 w-5" /> : <ChevronRight className="h-5 w-5" />}
        </button>
      </div>
      {/* Recherche */}
      {open && (
        <input
          type="text"
          placeholder="Rechercher..."
          className="w-full mb-4 px-3 py-2 rounded bg-muted text-sm outline-none"
        />
      )}
      {/* Navigation */}
      <nav className="flex-1 flex flex-col gap-2 mt-2">
        {NAV_ITEMS.map((item) => {
          const Icon = item.icon;
          if (item.children) {
            const isExpanded = expanded[item.name] || false;
            const isActive = open && isMenuActive(item);
            return (
              <div key={item.name}>
                <button
                  className={cn(
                    'flex items-center gap-3 min-w-0 px-3 py-2 transition-colors hover:bg-accent text-foreground',
                    open ? 'w-full' : 'w-12',
                    !open && 'justify-center',
                    isActive ? 'bg-accent font-semibold rounded-l-2xl border-l-4 border-white' : 'rounded'
                  )}
                  onClick={() => open && handleExpand(item.name)}
                  aria-expanded={isExpanded}
                  aria-controls={`submenu-${item.name}`}
                  style={!open ? { minHeight: 0, height: 48 } : {}}
                >
                  <Icon className="h-5 w-5" />
                  {open && <span className="ml-2 flex-1 text-left">{item.name}</span>}
                  {open && (
                    <span>
                      {isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                    </span>
                  )}
                </button>
                {/* Sous-menu */}
                {open && isExpanded && (
                  <div id={`submenu-${item.name}`} className="ml-8 flex flex-col gap-1 mt-1">
                    {item.children.map((child) => (
                      <Link
                        key={child.name}
                        to={child.href}
                        className={cn(
                          'flex items-center gap-2 px-2 py-1 rounded hover:bg-muted text-sm',
                          location.pathname === child.href && 'bg-muted font-semibold'
                        )}
                      >
                        {child.name}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            );
          }
          // Lien simple
          return (
            <Link
              key={item.name}
              to={item.href}
              className={cn(
                'flex items-center gap-3 min-w-0 px-3 py-2 rounded transition-colors hover:bg-accent text-foreground',
                location.pathname === item.href && 'bg-accent font-semibold',
                !open && 'justify-center'
              )}
            >
              <Icon className="h-5 w-5" />
              {open && <span className="ml-2">{item.name}</span>}
            </Link>
          );
        })}
        {/* Icônes directes GitHub/GitLab en mode fermé si actif */}
        {!open && activeDirectIcons.map((item) => {
          const Icon = item.icon;
          return (
            <Link
              key={item.name}
              to={item.href}
              className={cn(
                'flex items-center justify-center px-3 py-2 rounded transition-colors hover:bg-accent text-foreground',
                location.pathname === item.href && 'bg-accent font-semibold'
              )}
            >
              <Icon className="h-5 w-5" />
            </Link>
          );
        })}
      </nav>
      {/* Notifications et profil */}
      <div className={cn('mt-auto flex flex-col gap-2 items-center pb-4', open && 'items-stretch px-2')}> 
        <NotificationBell />
        <button className={cn('flex items-center gap-2 px-3 py-2 rounded hover:bg-accent text-foreground w-full', !open && 'justify-center w-10 p-2')}> 
          <User className="h-5 w-5" />
          {open && <span>Profil</span>}
        </button>
      </div>
    </>
  );
}
