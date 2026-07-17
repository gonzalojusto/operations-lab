import type { ReactNode } from 'react';
import { Sidebar } from './Sidebar';
import { Navbar } from './Navbar';

interface AppLayoutProps {
  children: ReactNode;
  title?: string;
}

export function AppLayout({ children, title }: AppLayoutProps) {
  return (
    <div className="flex min-h-screen bg-[var(--color-canvas)] text-[var(--color-text-primary)]">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0">
        <Navbar title={title} />
        <main className="flex-1 px-4 md:px-8 py-8 max-w-6xl w-full mx-auto">{children}</main>
      </div>
    </div>
  );
}
