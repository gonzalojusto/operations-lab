import { Link } from 'react-router-dom';
import { ArrowRight, Gauge, Package, PackageX, Activity, LayoutGrid, GitBranch, Users, BarChart3 } from 'lucide-react';
import type { ProductModule } from '../../types';

const ICONS: Record<string, React.ComponentType<{ size?: number; className?: string }>> = {
  Gauge,
  Package,
  PackageX,
  Activity,
  LayoutGrid,
  GitBranch,
  Users,
  BarChart3,
};

export function ModuleCard({ module }: { module: ProductModule }) {
  const Icon = ICONS[module.icon] ?? Package;
  const isLive = module.status === 'live';

  const content = (
    <div className={`card card-hover p-6 h-full flex flex-col justify-between ${isLive ? 'cursor-pointer' : 'opacity-70'}`}>
      <div>
        <div className="flex items-center justify-between mb-4">
          <div className="w-10 h-10 rounded-[var(--radius-md)] bg-[var(--color-brand-500)]/10 flex items-center justify-center">
            <Icon size={18} className="text-[var(--color-brand-500)]" />
          </div>
          <span
            className={`text-[10px] uppercase tracking-wider px-2 py-1 rounded-full border ${
              isLive
                ? 'border-[var(--color-success)]/40 text-[var(--color-success)] bg-[var(--color-success)]/10'
                : 'border-[var(--color-border-strong)] text-[var(--color-text-muted)]'
            }`}
          >
            {isLive ? 'Live' : 'Coming Soon'}
          </span>
        </div>
        <h3 className="text-base font-semibold mb-1.5">{module.name}</h3>
        <p className="text-sm text-[var(--color-text-secondary)] leading-relaxed">{module.description}</p>
      </div>
      {isLive && (
        <div className="flex items-center gap-1.5 mt-6 text-sm font-medium text-[var(--color-brand-300)]">
          Empezar diagnóstico <ArrowRight size={14} />
        </div>
      )}
    </div>
  );

  if (!isLive) return content;
  return <Link to={module.route}>{content}</Link>;
}
