import { AppLayout } from '../components/layout/AppLayout';
import { ModuleCard } from '../components/ui/ModuleCard';
import { MODULES } from '../data/modules';
import { ClipboardList, Gauge, Sparkles } from 'lucide-react';

const STEPS = [
  {
    icon: ClipboardList,
    title: '1. Responde 15 preguntas',
    description: 'Un cuestionario corto y accionable sobre procesos, KPIs, inventario, tecnología y mejora continua.',
  },
  {
    icon: Gauge,
    title: '2. Sube tus datos (opcional)',
    description: 'inventario.csv, pedidos.csv e incidencias.csv se analizan al instante, sin salir de tu navegador.',
  },
  {
    icon: Sparkles,
    title: '3. Recibe tu diagnóstico',
    description: 'Score, madurez, riesgos, quick wins y ahorro potencial estimado — con informe PDF descargable.',
  },
];

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
        <p className="text-xs text-[var(--color-text-muted)] mt-3">
          Sin login · Sin servidores · Tus datos nunca salen de tu navegador
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 mb-16">
        {MODULES.map((mod) => (
          <ModuleCard key={mod.id} module={mod} />
        ))}
      </div>

      <div className="fade-in">
        <h2 className="text-sm uppercase tracking-wider text-[var(--color-text-muted)] mb-6">
          Cómo funciona
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {STEPS.map((step) => (
            <div key={step.title}>
              <step.icon size={18} className="text-[var(--color-brand-500)] mb-3" />
              <h3 className="text-sm font-semibold mb-1.5">{step.title}</h3>
              <p className="text-sm text-[var(--color-text-secondary)] leading-relaxed">{step.description}</p>
            </div>
          ))}
        </div>
      </div>
    </AppLayout>
  );
}
