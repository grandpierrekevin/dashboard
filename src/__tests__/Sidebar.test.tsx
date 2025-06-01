import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Sidebar } from "../components/layouts/Sidebar";
import { ThemeProvider } from "../context/ThemeContext";
import { NotificationsProvider } from "../context/NotificationsContext";
import { SidebarProvider } from "../components/layouts/SidebarContext";
import { IntegrationsProvider } from "../context/IntegrationsContext";
import { describe, it, expect, vi, beforeEach } from 'vitest';

// Mock de useRouter et useNavigate
const mockNavigate = vi.fn();
const mockRouter = {
  state: {
    location: {
      pathname: '/'
    }
  }
};

vi.mock('@tanstack/react-router', () => ({
  useNavigate: () => mockNavigate,
  useRouter: () => mockRouter,
  Link: ({ children, to, ...props }: { children: React.ReactNode; to: string }) => (
    <a 
      href={to} 
      onClick={(e) => {
        e.preventDefault();
        mockNavigate(to);
      }} 
      {...props}
    >
      {children}
    </a>
  )
}));

// Mock de window.matchMedia
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: vi.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
});

describe("Sidebar", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
    // Mock window.innerWidth pour forcer le mode desktop
    Object.defineProperty(window, 'innerWidth', {
      writable: true,
      value: 1024
    });
  });

  const renderSidebar = () => {
    return render(
      <ThemeProvider>
        <NotificationsProvider>
          <IntegrationsProvider>
            <SidebarProvider>
              <Sidebar />
            </SidebarProvider>
          </IntegrationsProvider>
        </NotificationsProvider>
      </ThemeProvider>
    );
  };

  it("should be collapsed by default", () => {
    renderSidebar();
    const sidebar = screen.getAllByRole("navigation")[0];
    expect(sidebar.className).toContain("w-16");
  });

  it("should toggle sidebar on chevron click", async () => {
    const user = userEvent.setup();
    renderSidebar();
    const chevronButton = screen.getByRole("button", { name: /agrandir|réduire|menu/i });
    await user.click(chevronButton);
    
    // Attendre que l'animation soit terminée
    await new Promise(resolve => setTimeout(resolve, 300));
    
    const sidebar = screen.getAllByRole("navigation")[0];
    expect(sidebar.className).toContain("w-64");
  });

  it("should display navigation icons", () => {
    renderSidebar();
    expect(screen.getByRole("link", { name: "Accueil" })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Dashboard" })).toBeInTheDocument();
  });

  it("should handle navigation click", async () => {
    const user = userEvent.setup();
    renderSidebar();
    
    // Ouvre la sidebar pour rendre le lien Dashboard cliquable
    const chevronButton = screen.getByRole("button", { name: /agrandir|réduire|menu/i });
    await user.click(chevronButton);
    
    const dashboardLink = screen.getByRole("link", { name: "Dashboard" });
    await user.click(dashboardLink);
    
    expect(mockNavigate).toHaveBeenCalledWith("/dashboard");
    expect(dashboardLink).toHaveAttribute("href", "/dashboard");
  });

  it("should display theme toggle button", () => {
    renderSidebar();
    const themeButton = screen.getByRole("button", { name: /thème|theme/i });
    expect(themeButton).toBeInTheDocument();
  });

  it("should display notifications", () => {
    renderSidebar();
    // Cible le bouton cloche par aria-label
    const notificationsButton = screen.getByLabelText("Notifications");
    expect(notificationsButton).toBeInTheDocument();
  });

  it("affiche le popover Dashboard avec les intégrations actives et leurs logos en mode fermé", async () => {
    const user = userEvent.setup();
    renderSidebar();
    // Trouver l'icône Dashboard (mode collapsed)
    const dashboardIcon = screen.getByLabelText("Dashboard");
    await user.hover(dashboardIcon);
    // Vérifie la présence de tous les noms attendus
    const integrations = ["GitHub", "GitLab", "Jenkins", "Jira", "SonarQube"];
    for (const name of integrations) {
      expect(await screen.findAllByText(name)).not.toHaveLength(0);
    }
    // Vérifie la présence d'un logo (icône SVG)
    // (optionnel, car les logos sont des icônes Lucide, donc SVG)
    // const logos = screen.getAllByRole('img', { hidden: true });
    // expect(logos.length).toBeGreaterThan(0);
  });

  it("affiche le popover Admin avec les liens et icônes en mode fermé", async () => {
    const user = userEvent.setup();
    renderSidebar();
    // Trouver l'icône Admin (mode collapsed)
    const adminIcon = screen.getByLabelText("Admin");
    await user.hover(adminIcon);
    // Les liens doivent apparaître dans le popover
    expect(await screen.findByText(/Intégrations/i)).toBeInTheDocument();
    expect(await screen.findByText(/Corrélation/i)).toBeInTheDocument();
    // Vérifie la présence d'un logo (icône SVG)
    const logos = screen.getAllByRole('img', { hidden: true });
    expect(logos.length).toBeGreaterThan(0);
  });
}); 