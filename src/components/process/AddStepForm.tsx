import { useState } from 'react';
import { Plus } from 'lucide-react';

interface AddStepFormProps {
  onAdd: (step: { title: string; description: string; responsible: string }) => void;
}

export function AddStepForm({ onAdd }: AddStepFormProps) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [responsible, setResponsible] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;
    onAdd({ title: title.trim(), description: description.trim(), responsible: responsible.trim() });
    setTitle('');
    setDescription('');
    setResponsible('');
  };

  return (
    <form onSubmit={handleSubmit} className="card p-5 space-y-3">
      <input
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Nombre del paso (ej. Recepción de mercancía)"
        className="w-full px-3 py-2.5 rounded-[var(--radius-md)] bg-[var(--color-canvas-elevated)] border border-[var(--color-border)] focus:border-[var(--color-brand-500)] outline-none text-sm"
      />
      <textarea
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        placeholder="Descripción breve (opcional)"
        rows={2}
        className="w-full px-3 py-2.5 rounded-[var(--radius-md)] bg-[var(--color-canvas-elevated)] border border-[var(--color-border)] focus:border-[var(--color-brand-500)] outline-none text-sm resize-none"
      />
      <input
        type="text"
        value={responsible}
        onChange={(e) => setResponsible(e.target.value)}
        placeholder="Responsable (opcional)"
        className="w-full px-3 py-2.5 rounded-[var(--radius-md)] bg-[var(--color-canvas-elevated)] border border-[var(--color-border)] focus:border-[var(--color-brand-500)] outline-none text-sm"
      />
      <button type="submit" className="btn-primary w-full flex items-center justify-center gap-2 py-2.5 text-sm font-medium">
        <Plus size={14} /> Añadir paso
      </button>
    </form>
  );
}
