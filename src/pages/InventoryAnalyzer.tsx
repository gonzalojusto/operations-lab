import { useState } from 'react';
import { Boxes, AlertOctagon, Copy, FileWarning, PackageSearch } from 'lucide-react';
import { AppLayout } from '../components/layout/AppLayout';
import { CSVUploader } from '../components/forms/CSVUploader';
import { StatCard } from '../components/ui/StatCard';
import { Gauge } from '../components/ui/Gauge';
import { ABCBreakdownChart } from '../components/charts/ABCBreakdownChart';
import { InventoryTable } from '../components/inventory/InventoryTable';
import { analyzeInventoryDetailed } from '../services/csvAnalysis';
import type { InventoryDetailedResult } from '../types';

export function InventoryAnalyzer() {
  const [result, setResult] = useState<InventoryDetailedResult | null>(null);
  const [fileName, setFileName] = useState<string | undefined>(undefined);

  const handleFile = async (file: File) => {
    const detailed = await analyzeInventoryDetailed(file);
    setResult(detailed);
    setFileName(file.name);
  };

  const topByValue = result ? [...result.rows].sort((a, b) => b.value - a.value) : [];
  const excessRows = result ? result.rows.filter((r) => r.isExcess).sort((a, b) => b.stock - a.stock) : [];

  return (
    <AppLayout title="Inventory Analyzer">
      <div className="mb-8 fade-in">
        <span className="text-xs uppercase tracking-wider text-[var(--color-brand-300)] font-medium">
          Operations Lab
        </span>
        <h1 className="text-2xl md:text-3xl font-bold tracking-tight mt-1 mb-2">Inventory Analyzer</h1>
        <p className="text-[var(--color-text-secondary)] max-w-2xl text-sm leading-relaxed">
          Sube tu <code className="text-[var(--color-text-primary)]">inventario.csv</code> para obtener
          clasificación ABC, salud del inventario y detección de excesos — todo procesado en tu navegador.
        </p>
      </div>

      <div className="max-w-xl mb-8">
        <CSVUploader
          label="inventario.csv"
          description="Columnas esperadas: SKU, stock, última venta, valor/coste (nombres flexibles)."
          fileName={fileName}
          onFile={handleFile}
        />
      </div>

      {!result && (
        <div className="card p-12 text-center fade-in">
          <PackageSearch size={28} className="text-[var(--color-text-muted)] mx-auto mb-3" />
          <p className="text-sm text-[var(--color-text-muted)]">
            Sube un archivo para ver el análisis completo de tu inventario.
          </p>
        </div>
      )}

      {result && (
        <div className="space-y-5 fade-in">
          {result.summary.warnings.length > 0 && (
            <div className="card p-4 border-[var(--color-warning)]/30 bg-[var(--color-warning)]/5">
              <div className="flex items-start gap-2">
                <FileWarning size={15} className="text-[var(--color-warning)] mt-0.5 shrink-0" />
                <ul className="text-xs text-[var(--color-text-secondary)] space-y-1">
                  {result.summary.warnings.map((w, i) => (
                    <li key={i}>{w}</li>
                  ))}
                </ul>
              </div>
            </div>
          )}

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <StatCard icon={Boxes} label="SKUs analizados" value={String(result.summary.skuCount)} />
            <StatCard
              icon={AlertOctagon}
              label="Dead stock"
              value={`${result.summary.deadStockPercentage}%`}
              hint={`${result.summary.deadStockCount} referencias`}
              tone={result.summary.deadStockPercentage > 15 ? 'danger' : 'neutral'}
            />
            <StatCard
              icon={Copy}
              label="Duplicados"
              value={String(result.summary.duplicates)}
              tone={result.summary.duplicates > 0 ? 'warning' : 'neutral'}
            />
            <StatCard
              icon={PackageSearch}
              label="Posible exceso"
              value={String(result.summary.potentialExcessStock)}
              hint="referencias con stock > 500 uds."
            />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
            <div className="card p-6 flex items-center justify-center">
              <Gauge
                value={result.summary.inventoryHealth}
                label="Inventory Health"
                color={
                  result.summary.inventoryHealth < 50
                    ? 'var(--color-danger)'
                    : result.summary.inventoryHealth < 75
                    ? 'var(--color-warning)'
                    : 'var(--color-success)'
                }
              />
            </div>
            <div className="card p-6 lg:col-span-2">
              <h3 className="text-sm font-medium text-[var(--color-text-secondary)] mb-4 text-center">
                Clasificación ABC (por valor)
              </h3>
              <ABCBreakdownChart {...result.summary.abcAnalysis} />
            </div>
          </div>

          <div className="card p-6">
            <h3 className="text-sm font-medium text-[var(--color-text-secondary)] mb-4">
              Top referencias por valor inmovilizado
            </h3>
            <InventoryTable rows={topByValue} />
          </div>

          {excessRows.length > 0 && (
            <div className="card p-6">
              <h3 className="text-sm font-medium text-[var(--color-text-secondary)] mb-4">
                Posible exceso de stock
              </h3>
              <InventoryTable rows={excessRows} emptyMessage="No se detectó exceso de stock." />
            </div>
          )}
        </div>
      )}
    </AppLayout>
  );
}
