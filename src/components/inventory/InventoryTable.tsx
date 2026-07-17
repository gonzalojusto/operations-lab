import type { InventoryRow } from '../../types';

const ABC_COLOR: Record<InventoryRow['abcClass'], string> = {
  A: 'var(--color-success)',
  B: 'var(--color-warning)',
  C: 'var(--color-text-muted)',
};

function formatEUR(value: number): string {
  return new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 }).format(
    value
  );
}

interface InventoryTableProps {
  rows: InventoryRow[];
  emptyMessage?: string;
  maxRows?: number;
}

export function InventoryTable({ rows, emptyMessage, maxRows = 15 }: InventoryTableProps) {
  const visible = rows.slice(0, maxRows);

  if (rows.length === 0) {
    return (
      <p className="text-sm text-[var(--color-text-muted)] py-6 text-center">
        {emptyMessage ?? 'No hay filas que mostrar.'}
      </p>
    );
  }

  return (
    <div className="overflow-x-auto -mx-2">
      <table className="w-full text-sm">
        <thead>
          <tr className="text-left text-xs text-[var(--color-text-muted)] uppercase tracking-wider">
            <th className="px-2 py-2 font-medium">SKU</th>
            <th className="px-2 py-2 font-medium text-right">Stock</th>
            <th className="px-2 py-2 font-medium text-right">Valor</th>
            <th className="px-2 py-2 font-medium text-right">Días sin venta</th>
            <th className="px-2 py-2 font-medium text-center">ABC</th>
          </tr>
        </thead>
        <tbody>
          {visible.map((row) => (
            <tr key={row.sku} className="border-t border-[var(--color-border)]">
              <td className="px-2 py-2.5 font-medium truncate max-w-[180px]">{row.sku}</td>
              <td className="px-2 py-2.5 text-right text-[var(--color-text-secondary)]">{row.stock}</td>
              <td className="px-2 py-2.5 text-right text-[var(--color-text-secondary)]">{formatEUR(row.value)}</td>
              <td className="px-2 py-2.5 text-right text-[var(--color-text-secondary)]">
                {row.daysSinceLastSale ?? '—'}
              </td>
              <td className="px-2 py-2.5 text-center">
                <span
                  className="inline-flex items-center justify-center w-6 h-6 rounded-full text-[11px] font-semibold"
                  style={{
                    color: ABC_COLOR[row.abcClass],
                    backgroundColor: `color-mix(in srgb, ${ABC_COLOR[row.abcClass]} 15%, transparent)`,
                  }}
                >
                  {row.abcClass}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {rows.length > maxRows && (
        <p className="text-xs text-[var(--color-text-muted)] mt-3 px-2">
          Mostrando {maxRows} de {rows.length} referencias.
        </p>
      )}
    </div>
  );
}
