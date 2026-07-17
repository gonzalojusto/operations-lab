import { NavLink } from 'react-router-dom';
import { Gauge, Package, PackageX, Activity, LayoutGrid, GitBranch, Boxes } from 'lucide-react';
import { MODULES } from '../../data/modules';

const ICONS: Record<string, React.ComponentType<{ size?: number; className?: string }>> = {
  Gauge,
  Package,
  PackageX,
  Activity,
  LayoutGrid,
  GitBranch,
};

export function Sidebar() {
  return (
    <aside className="hidden md:flex md:w-64 md:flex-col border-r border-[var(--color-border)] bg-[var(--color-canvas-elevated)] h-screen sticky top-0">
      <div className="flex items-center gap-2 px-6 h-16 border-b border-[var(--color-border)]">
        <Boxes size={20} className="text-[var(--color-brand-500)]" />
        <span className="font-semibold tracking-tight text-[15px]">Operations Lab</span>
      </div>

      <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-1">
        <NavLink
          to="/"
          end
          className={({ isActive }) =>
            `flex items-center gap-3 px-3 py-2 rounded-[var(--radius-md)] text-sm transition-colors ${
              isActive
                ? 'bg-[var(--color-surface-hover)] text-[var(--color-text-primary)]'
                : 'text-[var(--color-text-secondary)] hover:bg-[var(--color-surface)] hover:text-[var(--color-text-primary)]'
            }`
          }
        >
          Home
        </NavLink>

        <div className="pt-4 pb-1 px-3 text-[11px] uppercase tracking-wider text-[var(--color-text-muted)]">
          Módulos
        </div>

        {MODULES.map((mod) => {
          const Icon = ICONS[mod.icon] ?? Package;
          const disabled = mod.status === 'coming-soon';
          return (
            <NavLink
              key={mod.id}
              to={disabled ? '#' : mod.route}
              onClick={(e) => disabled && e.preventDefault()}
              className={({ isActive }) =>
                `flex items-center justify-between gap-3 px-3 py-2 rounded-[var(--radius-md)] text-sm transition-colors ${
                  disabled
                    ? 'text-[var(--color-text-muted)] cursor-not-allowed'
                    : isActive
                    ? 'bg-[var(--color-surface-hover)] text-[var(--color-text-primary)]'
                    : 'text-[var(--color-text-secondary)] hover:bg-[var(--color-surface)] hover:text-[var(--color-text-primary)]'
                }`
              }
            >
              <span className="flex items-center gap-3">
                <Icon size={16} />
                {mod.name}
              </span>
              {disabled && (
                <span className="text-[9px] uppercase tracking-wider px-1.5 py-0.5 rounded-full bg-[var(--color-surface)] border border-[var(--color-border-strong)] text-[var(--color-text-muted)]">
                  Soon
                </span>
              )}
            </NavLink>
          );
        })}
      </nav>

      <div className="px-6 py-4 border-t border-[var(--color-border)] text-[11px] text-[var(--color-text-muted)]">
        Build Better Operations
      </div>
    </aside>
  );
}
