import type { SlottingRow, SlotZone } from '../../types';

const ZONE_COLOR: Record<SlotZone, string> = {
  A: 'var(--color-success)',
  B: 'var(--color-warning)',
  C: 'var(--color-text-muted)',
};

export function SlottingTable({ rows, maxRows = 20 }: { rows: SlottingRow[]; maxRows?: number }) {
  const visible = rows.slice(0, maxRows);

  return (
    <div className="overflow-x-auto -mx-2">
      <table className="w-full text-sm">
        <thead>
          <tr className="text-left text-xs text-[var(--color-text-muted)] uppercase tracking-wider">
            <th className="px-2 py-2 font-medium">SKU</th>
            <th className="px-2 py-2 font-medium text-right">Frecuencia de picking</th>
            <th className="px-2 py-2 font-medium text-center">Zona recomendada</th>
          </tr>
        </thead>
        <tbody>
          {visible.map((row) => (
            <tr key={row.sku} className="border-t border-[var(--color-border)]">
              <td className="px-2 py-2.5 font-medium truncate max-w-[200px]">{row.sku}</td>
              <td className="px-2 py-2.5 text-right text-[var(--color-text-secondary)]">{row.frequency}</td>
              <td className="px-2 py-2.5 text-center">
                <span
                  className="inline-flex items-center justify-center w-6 h-6 rounded-full text-[11px] font-semibold"
                  style={{
                    color: ZONE_COLOR[row.recommendedZone],
                    backgroundColor: `color-mix(in srgb, ${ZONE_COLOR[row.recommendedZone]} 15%, transparent)`,
                  }}
                >
                  {row.recommendedZone}
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
