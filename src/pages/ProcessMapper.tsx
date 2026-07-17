import { AppLayout } from '../components/layout/AppLayout';
import { ProcessStepFlow } from '../components/process/ProcessStepFlow';
import { AddStepForm } from '../components/process/AddStepForm';
import { useProcessMapperStore } from '../store/useProcessMapperStore';

export function ProcessMapper() {
  const { steps, addStep, removeStep, moveStep } = useProcessMapperStore();

  return (
    <AppLayout title="Process Mapper">
      <div className="mb-8 fade-in">
        <span className="text-xs uppercase tracking-wider text-[var(--color-brand-300)] font-medium">
          Operations Lab
        </span>
        <h1 className="text-2xl md:text-3xl font-bold tracking-tight mt-1 mb-2">Process Mapper</h1>
        <p className="text-[var(--color-text-secondary)] max-w-2xl text-sm leading-relaxed">
          Documenta tus procesos operativos paso a paso, de forma visual. Se guarda automáticamente en este
          navegador.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <ProcessStepFlow steps={steps} onMove={moveStep} onRemove={removeStep} />
        </div>
        <div className="lg:col-span-1">
          <AddStepForm onAdd={addStep} />
        </div>
      </div>
    </AppLayout>
  );
}
