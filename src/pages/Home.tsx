import { AppLayout } from '../components/layout/AppLayout';
import { ModuleCard } from '../components/ui/ModuleCard';
import { MODULES } from '../data/modules';

export function Home() {
  return (
    <AppLayout>
      <div className="mb-12 fade-in">
        <span className="text-xs uppercase tracking-wider text-[var(--color-brand-300)] font-medium">
          Operations Lab
        </span>
        <h1 className="text-3xl md:text-4xl font-bold tracking-tight mt-2 mb-3">
          Build Better Operations
        </h1>
        <p className="text-[var(--color-text-secondary)] max-w-2xl leading-relaxed">
          Una suite de herramientas para PYMEs que quieren tomar decisiones operativas con datos, no con
          intuición. Empieza con un diagnóstico gratuito en menos de 5 minutos.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {MODULES.map((mod) => (
          <ModuleCard key={mod.id} module={mod} />
        ))}
      </div>
    </AppLayout>
  );
}
