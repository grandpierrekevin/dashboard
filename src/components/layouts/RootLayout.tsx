import React, { useEffect } from "react";
import { Outlet } from "@tanstack/react-router";
import { Sidebar } from "./Sidebar";
import { SidebarProvider, useSidebar } from "@/components/layouts/SidebarContext";
import { ReactNode, useState } from "react";
import { GlobalLoader } from "@/components/ui/GlobalLoader";

export function RootLayout({ children }: { children?: ReactNode }) {
  // Démo : loader affiché 1s au montage
  const [isLoading, setIsLoading] = useState(true);
  useEffect(() => {
    const t = setTimeout(() => setIsLoading(false), 1000);
    return () => clearTimeout(t);
  }, []);

  return (
    <SidebarProvider>
      <SidebarLayoutContent>
        {isLoading ? <GlobalLoader /> : children}
      </SidebarLayoutContent>
    </SidebarProvider>
  );
}

function SidebarLayoutContent({ children }: { children?: ReactNode }) {
  const { collapsed } = useSidebar();
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      <Sidebar />
      <main className="transition-all duration-300 p-6 pl-20">
        {children ?? <Outlet />}
      </main>
    </div>
  );
} 