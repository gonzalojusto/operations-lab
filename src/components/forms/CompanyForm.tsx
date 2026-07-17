import type { CompanyInfo } from '../../types';

interface CompanyFormProps {
  company: CompanyInfo;
  onChange: (partial: Partial<CompanyInfo>) => void;
}

const EMPLOYEE_BUCKETS = ['1-9', '10-49', '50-99', '100-249', '250-500'];
const SECTORS = [
  'Retail / eCommerce',
  'Manufactura',
  'Logística / Transporte',
  'Alimentación',
  'Distribución',
  'Servicios',
  'Otro',
];

function Toggle({
  label,
  checked,
  onChange,
}: {
  label: string;
  checked: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <button
      type="button"
      onClick={() => onChange(!checked)}
      className="flex items-center justify-between w-full px-4 py-3 rounded-[var(--radius-md)] border border-[var(--color-border)] hover:border-[var(--color-border-strong)] transition-colors"
    >
      <span className="text-sm">{label}</span>
      <span
        className={`w-10 h-5 rounded-full relative transition-colors ${
          checked ? 'bg-[var(--color-brand-500)]' : 'bg-[var(--color-surface-hover)] border border-[var(--color-border-strong)]'
        }`}
      >
        <span
          className={`absolute top-0.5 w-4 h-4 rounded-full bg-white transition-all ${
            checked ? 'left-5' : 'left-0.5'
          }`}
        />
      </span>
    </button>
  );
}

export function CompanyForm({ company, onChange }: CompanyFormProps) {
  return (
    <div className="card p-6 md:p-8 fade-in space-y-5">
      <div>
        <label className="block text-sm text-[var(--color-text-secondary)] mb-2">Nombre de la empresa</label>
        <input
          type="text"
          value={company.name}
          onChange={(e) => onChange({ name: e.target.value })}
          placeholder="Ej. Almacenes del Noroeste S.L."
          className="w-full px-4 py-3 rounded-[var(--radius-md)] bg-[var(--color-canvas-elevated)] border border-[var(--color-border)] focus:border-[var(--color-brand-500)] outline-none text-sm transition-colors"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm text-[var(--color-text-secondary)] mb-2">Sector</label>
          <select
            value={company.sector}
            onChange={(e) => onChange({ sector: e.target.value })}
            className="w-full px-4 py-3 rounded-[var(--radius-md)] bg-[var(--color-canvas-elevated)] border border-[var(--color-border)] focus:border-[var(--color-brand-500)] outline-none text-sm"
          >
            <option value="">Selecciona un sector</option>
            {SECTORS.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm text-[var(--color-text-secondary)] mb-2">Nº de empleados</label>
          <select
            value={company.employees}
            onChange={(e) => onChange({ employees: e.target.value })}
            className="w-full px-4 py-3 rounded-[var(--radius-md)] bg-[var(--color-canvas-elevated)] border border-[var(--color-border)] focus:border-[var(--color-brand-500)] outline-none text-sm"
          >
            {EMPLOYEE_BUCKETS.map((b) => (
              <option key={b} value={b}>
                {b} empleados
              </option>
            ))}
          </select>
        </div>
      </div>

      <div>
        <label className="block text-sm text-[var(--color-text-secondary)] mb-2">País</label>
        <input
          type="text"
          value={company.country}
          onChange={(e) => onChange({ country: e.target.value })}
          className="w-full px-4 py-3 rounded-[var(--radius-md)] bg-[var(--color-canvas-elevated)] border border-[var(--color-border)] focus:border-[var(--color-brand-500)] outline-none text-sm"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-2">
        <Toggle label="¿Tiene almacén?" checked={company.hasWarehouse} onChange={(v) => onChange({ hasWarehouse: v })} />
        <Toggle label="¿Utiliza ERP?" checked={company.usesERP} onChange={(v) => onChange({ usesERP: v })} />
        <Toggle label="¿Utiliza Excel?" checked={company.usesExcel} onChange={(v) => onChange({ usesExcel: v })} />
      </div>
    </div>
  );
}
