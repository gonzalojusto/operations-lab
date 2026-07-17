import { Boxes } from 'lucide-react';

interface NavbarProps {
  title?: string;
}

export function Navbar({ title }: NavbarProps) {
  return (
    <header className="h-16 border-b border-[var(--color-border)] flex items-center justify-between px-4 md:px-8 sticky top-0 bg-[var(--color-canvas)]/80 backdrop-blur z-10">
      <div className="flex items-center gap-2 md:hidden">
        <Boxes size={18} className="text-[var(--color-brand-500)]" />
        <span className="font-semibold text-sm">Operations Lab</span>
      </div>
      {title && (
        <h1 className="hidden md:block text-sm font-medium text-[var(--color-text-secondary)]">
          {title}
        </h1>
      )}
      <div className="flex items-center gap-3">
        <span className="text-[11px] px-2 py-1 rounded-full border border-[var(--color-border-strong)] text-[var(--color-text-muted)]">
          v1.0 · MVP
        </span>
      </div>
    </header>
  );
}
