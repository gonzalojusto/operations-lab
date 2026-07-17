import { useMemo, useState } from 'react';
import { PackageX, TrendingDown, Coins, ListChecks } from 'lucide-react';
import { AppLayout } from '../components/layout/AppLayout';
import { CSVUploader } from '../components/forms/CSVUploader';
import { StatCard } from '../components/ui/StatCard';
import { InventoryTable } from '../components/inventory/InventoryTable';
import { analyzeInventoryDetailed } from '../services/csvAnalysis';
import type { InventoryDetailedResult } from '../types';

function formatEUR(value: number): string {
  return new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 }).format(
    value
  );
}

export function DeadStockManager() {
  const [result, setResult] = useState<InventoryDetailedResult | null>(null);
  const [fileName, setFileName] = useState<string | undefined>(undefined);

  const handleFile = async (file: File) => {
    const detailed = await analyzeInventoryDetailed(file);
    setResult(detailed);
    setFileName(file.name);
  };

  const deadRows = useMemo(
    () => (result ? result.rows.filter((r) => r.isDeadStock).sort((a, b) => b.value - a.value) : []),
    [result]
  );

  const immobilizedValue = deadRows.reduce((acc, r) => acc + r.value, 0);
  const totalValue = result ? result.rows.reduce((acc, r) => acc + r.value, 0) : 0;
  const immobilizedShare = totalValue > 0 ? (immobilizedValue / totalValue) * 100 : 0;

  return (
    <AppLayout title="Dead Stock Manager">
      <div className="mb-8 fade-in">
        <span className="text-xs uppercase tracking-wider text-[var(--color-brand-300)] font-medium">
          Operations Lab
        </span>
        <h1 className="text-2xl md:text-3xl font-bold tracking-tight mt-1 mb-2">Dead Stock Manager</h1>
        <p className="text-[var(--color-text-secondary)] max-w-2xl text-sm leading-relaxed">
          Identifica el stock obsoleto (sin ventas en más de 90 días) y cuánto capital tienes inmovilizado en
          él, para priorizar un plan de liquidación.
        </p>
      </div>

      <div className="max-w-xl mb-8">
        <CSVUploader
          label="inventario.csv"
          description="Mismo archivo que Inventory Analyzer: SKU, stock, última venta, valor."
          fileName={fileName}
          onFile={handleFile}
        />
      </div>

      {!result && (
        <div className="card p-12 text-center fade-in">
          <PackageX size={28} className="text-[var(--color-text-muted)] mx-auto mb-3" />
          <p className="text-sm text-[var(--color-text-muted)]">
            Sube tu inventario para identificar el stock obsoleto y su valor inmovilizado.
          </p>
        </div>
      )}

      {result && (
        <div className="space-y-5 fade-in">
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            <StatCard
              icon={PackageX}
              label="Referencias en dead stock"
              value={String(deadRows.length)}
              hint={`de ${result.summary.skuCount} totales`}
              tone={deadRows.length > 0 ? 'danger' : 'success'}
            />
            <StatCard
              icon={Coins}
              label="Valor inmovilizado"
              value={formatEUR(immobilizedValue)}
              tone={immobilizedValue > 0 ? 'warning' : 'neutral'}
            />
            <StatCard
              icon={TrendingDown}
              label="% del valor total del inventario"
              value={`${immobilizedShare.toFixed(1)}%`}
              tone={immobilizedShare > 15 ? 'danger' : 'neutral'}
            />
          </div>

          <div className="card p-6">
            <h3 className="text-sm font-medium text-[var(--color-text-secondary)] mb-4">
              Referencias sin rotación (&gt; 90 días sin venta)
            </h3>
            <InventoryTable
              rows={deadRows}
              maxRows={25}
              emptyMessage="No se detectó stock obsoleto con la información disponible. Buen trabajo."
            />
          </div>

          {deadRows.length > 0 && (
            <div className="card p-6 border-[var(--color-brand-500)]/25 bg-[var(--color-brand-500)]/5">
              <div className="flex items-center gap-2 mb-4">
                <ListChecks size={16} className="text-[var(--color-brand-500)]" />
                <h3 className="text-sm font-medium text-[var(--color-text-secondary)]">
                  Plan de liquidación sugerido
                </h3>
              </div>
              <ol className="space-y-3 text-sm">
                <li className="flex gap-3">
                  <span className="font-semibold text-[var(--color-brand-300)]">1.</span>
                  <span>
                    Prioriza liquidar primero las referencias con más valor inmovilizado (arriba en la tabla):
                    concentran la mayor parte del capital atrapado.
                  </span>
                </li>
                <li className="flex gap-3">
                  <span className="font-semibold text-[var(--color-brand-300)]">2.</span>
                  <span>
                    Evalúa canales de salida rápida: outlet, descuentos agresivos, venta B2B a terceros o
                    donación con beneficio fiscal.
                  </span>
                </li>
                <li className="flex gap-3">
                  <span className="font-semibold text-[var(--color-brand-300)]">3.</span>
                  <span>
                    Revisa el proceso de compra que generó este stock: evita que se repita fijando puntos de
                    revisión antes de reordenar estas referencias.
                  </span>
                </li>
              </ol>
            </div>
          )}
        </div>
      )}
    </AppLayout>
  );
}
