import "@testing-library/jest-dom";
import { render, screen, waitFor, fireEvent } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { NotificationsPopover } from '@/components/notifications/NotificationsPopover';
import { NotificationsProvider } from "@/context/NotificationsContext";
import { useNotifications } from "@/hooks/useNotifications";
import { describe, it, expect, vi, beforeEach } from 'vitest';

// Mock de @radix-ui/react-popover
vi.mock('@radix-ui/react-popover', () => ({
  Root: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  Trigger: ({ children }: { children: React.ReactNode }) => <button>{children}</button>,
  Content: ({ children }: { children: React.ReactNode }) => <div role="dialog">{children}</div>,
  Portal: ({ children }: { children: React.ReactNode }) => <div>{children}</div>
}));

// Mock du hook useNotifications
vi.mock('../hooks/useNotifications', () => ({
  useNotifications: vi.fn()
}));

describe("NotificationsPopover", () => {
  const user = userEvent.setup();
  let mockNotifications: any[] = [];

  beforeEach(() => {
    mockNotifications = [];
    vi.spyOn(Storage.prototype, 'getItem').mockImplementation((key: string) => {
      if (key === 'notifications') {
        return JSON.stringify(mockNotifications);
      }
      return null;
    });
    vi.spyOn(Storage.prototype, 'setItem').mockImplementation((key: string, value: string) => {
      if (key === 'notifications') {
        mockNotifications = JSON.parse(value);
      }
    });
    vi.spyOn(Storage.prototype, 'clear').mockImplementation(() => {
      mockNotifications = [];
    });
    vi.clearAllMocks();
    (useNotifications as any).mockReturnValue({
      notifications: [
        {
          id: '1',
          title: 'Jenkins',
          message: 'jobs Jenkins en échec',
          type: 'error',
          read: false,
          date: new Date().toISOString()
        },
        {
          id: '2',
          title: 'GitHub',
          message: 'Pull request #123',
          type: 'info',
          read: false,
          date: new Date().toISOString()
        },
        {
          id: '3',
          title: 'Deployment',
          message: 'Déploiement réussi',
          type: 'success',
          read: false,
          date: new Date().toISOString()
        }
      ],
      unreadCount: 3,
      addNotification: vi.fn(),
      removeNotification: vi.fn(),
      markAsRead: vi.fn(),
      markAllAsRead: vi.fn()
    });
  });

  it("should display notification badge with correct count", async () => {
    render(
      <NotificationsProvider>
        <NotificationsPopover />
      </NotificationsProvider>
    );
    
    const badge = await screen.findByText("3");
    expect(badge).toBeInTheDocument();
  });

  it("should show notifications list when clicked", async () => {
    render(
      <NotificationsProvider>
        <NotificationsPopover />
      </NotificationsProvider>
    );
    
    const button = screen.getByRole("button", { name: /notifications/i });
    await user.click(button);
    
    expect(screen.getByRole('dialog')).toBeInTheDocument();
    expect(screen.getByText(/jobs Jenkins en échec/i)).toBeInTheDocument();
  });

  it("should mark notification as read when clicked", async () => {
    render(
      <NotificationsProvider>
        <NotificationsPopover />
      </NotificationsProvider>
    );
    
    const button = screen.getByRole("button", { name: /notifications/i });
    await user.click(button);
    
    const markAsReadButton = screen.getByRole("button", { name: /marquer comme lu/i });
    await user.click(markAsReadButton);
    
    expect(screen.queryByText(/jobs Jenkins en échec/i)).not.toBeInTheDocument();
  });

  it("should close popover when clicking outside", async () => {
    render(
      <NotificationsProvider>
        <NotificationsPopover />
        <div data-testid="outside">Outside</div>
      </NotificationsProvider>
    );
    
    // Ouvrir le popover
    const button = screen.getByRole("button", { name: /notifications/i });
    await user.click(button);
    
    // Vérifier que le popover est ouvert
    expect(screen.getByRole('dialog')).toBeInTheDocument();
    
    // Cliquer à l'extérieur
    const outside = screen.getByTestId("outside");
    await user.click(outside);
    
    // Attendre que le popover soit fermé
    await waitFor(() => {
      expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    }, { timeout: 1000 });
  });

  it("should show empty state when no notifications", async () => {
    render(
      <NotificationsProvider>
        <NotificationsPopover />
      </NotificationsProvider>
    );
    
    expect(screen.getByText(/aucune notification/i)).toBeInTheDocument();
  });

  it("should show correct notification types", async () => {
    render(
      <NotificationsProvider>
        <NotificationsPopover />
      </NotificationsProvider>
    );
    
    expect(screen.getByText(/jobs Jenkins en échec/i)).toBeInTheDocument();
    expect(screen.getByText(/Pull request #123/i)).toBeInTheDocument();
    expect(screen.getByText(/Déploiement réussi/i)).toBeInTheDocument();
  });
}); 