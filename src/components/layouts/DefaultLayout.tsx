import type { ReactNode } from "react";
import { Sidebar } from "./Sidebar";

export function DefaultLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen bg-gray-50 dark:bg-gray-900">
      <Sidebar />
      {/* Main content */}
      <main className="flex-1 p-8 bg-gray-200 dark:bg-gray-900 transition-all">
        {children}
      </main>
    </div>
  );
}
