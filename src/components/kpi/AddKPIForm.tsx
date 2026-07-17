import { useState } from 'react';
import { Plus } from 'lucide-react';
import type { KPIDirection } from '../../types';

interface AddKPIFormProps {
  onAdd: (kpi: { name: string; unit: string; target: number; direction: KPIDirection }) => void;
}

export function AddKPIForm({ onAdd }: AddKPIFormProps) {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState('');
  const [unit, setUnit] = useState('');
  const [target, setTarget] = useState('');
  const [direction, setDirection] = useState<KPIDirection>('higher-is-better');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const parsedTarget = parseFloat(target.replace(',', '.'));
    if (!name.trim() || Number.isNaN(parsedTarget)) return;
    onAdd({ name: name.trim(), unit: unit.trim() || 'unidades', target: parsedTarget, direction });
    setName('');
    setUnit('');
    setTarget('');
    setOpen(false);
  };

  if (!open) {
    return (
      <button
        onClick={() => setOpen(true)}
        className="btn-secondary flex items-center gap-2 px-4 py-2.5 text-sm w-full justify-center border-dashed"
      >
        <Plus size={14} /> Añadir KPI personalizado
      </button>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="card p-5 space-y-3 fade-in">
      <input
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Nombre del KPI (ej. Tasa de devoluciones)"
        className="w-full px-3 py-2.5 rounded-[var(--radius-md)] bg-[var(--color-canvas-elevated)] border border-[var(--color-border)] focus:border-[var(--color-brand-500)] outline-none text-sm"
        autoFocus
      />
      <div className="grid grid-cols-2 gap-3">
        <input
          type="text"
          value={unit}
          onChange={(e) => setUnit(e.target.value)}
          placeholder="Unidad (%, €, uds.)"
          className="px-3 py-2.5 rounded-[var(--radius-md)] bg-[var(--color-canvas-elevated)] border border-[var(--color-border)] focus:border-[var(--color-brand-500)] outline-none text-sm"
        />
        <input
          type="text"
          inputMode="decimal"
          value={target}
          onChange={(e) => setTarget(e.target.value)}
          placeholder="Target"
          className="px-3 py-2.5 rounded-[var(--radius-md)] bg-[var(--color-canvas-elevated)] border border-[var(--color-border)] focus:border-[var(--color-brand-500)] outline-none text-sm"
        />
      </div>
      <select
        value={direction}
        onChange={(e) => setDirection(e.target.value as KPIDirection)}
        className="w-full px-3 py-2.5 rounded-[var(--radius-md)] bg-[var(--color-canvas-elevated)] border border-[var(--color-border)] outline-none text-sm"
      >
        <option value="higher-is-better">Mayor es mejor</option>
        <option value="lower-is-better">Menor es mejor</option>
      </select>
      <div className="flex gap-2">
        <button type="submit" className="btn-primary flex-1 py-2.5 text-sm font-medium">
          Añadir
        </button>
        <button type="button" onClick={() => setOpen(false)} className="btn-secondary px-4 py-2.5 text-sm">
          Cancelar
        </button>
      </div>
    </form>
  );
}
