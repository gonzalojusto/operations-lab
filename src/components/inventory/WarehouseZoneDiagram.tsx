import type { SlotZone } from '../../types';

interface WarehouseZoneDiagramProps {
  summary: Record<SlotZone, { count: number; picks: number }>;
}

const ZONE_COLOR: Record<SlotZone, string> = {
  A: '#2fd47a',
  B: '#f5b83d',
  C: '#6b6f7a',
};

const ZONE_LABEL: Record<SlotZone, string> = {
  A: 'Zona A · Oro (cerca de expedición)',
  B: 'Zona B · Plata',
  C: 'Zona C · Bronce (fondo de almacén)',
};

export function WarehouseZoneDiagram({ summary }: WarehouseZoneDiagramProps) {
  const zones: SlotZone[] = ['A', 'B', 'C'];
  const totalPicks = zones.reduce((acc, z) => acc + summary[z].picks, 0) || 1;

  return (
    <div className="space-y-3">
      <svg viewBox="0 0 300 120" className="w-full h-auto max-w-md mx-auto">
        {/* Zona C (fondo) */}
        <rect x="0" y="0" width="300" height="120" rx="8" fill={ZONE_COLOR.C} opacity="0.15" />
        <text x="150" y="16" textAnchor="middle" fontSize="8" fill="var(--color-text-muted)">
          ZONA C
        </text>
        {/* Zona B (media) */}
        <rect x="30" y="30" width="240" height="70" rx="8" fill={ZONE_COLOR.B} opacity="0.18" />
        <text x="150" y="42" textAnchor="middle" fontSize="8" fill="var(--color-text-muted)">
          ZONA B
        </text>
        {/* Zona A (oro, cerca de expedición) */}
        <rect x="70" y="55" width="160" height="40" rx="8" fill={ZONE_COLOR.A} opacity="0.25" />
        <text x="150" y="78" textAnchor="middle" fontSize="9" fontWeight="bold" fill="var(--color-text-primary)">
          ZONA A
        </text>
        {/* Puerta de expedición */}
        <rect x="130" y="108" width="40" height="8" rx="2" fill="var(--color-brand-500)" />
        <text x="150" y="120" textAnchor="middle" fontSize="6" fill="var(--color-text-muted)">
          Expedición
        </text>
      </svg>

      <div className="grid grid-cols-3 gap-3">
        {zones.map((zone) => (
          <div key={zone} className="text-center">
            <div
              className="w-3 h-3 rounded-full mx-auto mb-1.5"
              style={{ backgroundColor: ZONE_COLOR[zone] }}
            />
            <p className="text-xs font-medium">{ZONE_LABEL[zone]}</p>
            <p className="text-xs text-[var(--color-text-muted)] mt-0.5">
              {summary[zone].count} SKUs · {((summary[zone].picks / totalPicks) * 100).toFixed(0)}% de picks
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
