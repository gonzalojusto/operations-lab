import { useState } from 'react';
import { LayoutGrid, FileWarning } from 'lucide-react';
import { AppLayout } from '../components/layout/AppLayout';
import { CSVUploader } from '../components/forms/CSVUploader';
import { WarehouseZoneDiagram } from '../components/inventory/WarehouseZoneDiagram';
import { SlottingTable } from '../components/inventory/SlottingTable';
import { analyzePickingCSV } from '../services/csvAnalysis';
import { computeSlotting, summarizeByZone } from '../services/slotting';
import type { SlottingRow } from '../types';

export function SmartSlotLite() {
  const [rows, setRows] = useState<SlottingRow[] | null>(null);
  const [warnings, setWarnings] = useState<string[]>([]);
  const [fileName, setFileName] = useState<string | undefined>(undefined);

  const handleFile = async (file: File) => {
    const { rows: pickingRows, warnings: w } = await analyzePickingCSV(file);
    setRows(computeSlotting(pickingRows));
    setWarnings(w);
    setFileName(file.name);
  };

  const summary = rows ? summarizeByZone(rows) : null;

  return (
    <AppLayout title="SmartSlot Lite">
      <div className="mb-8 fade-in">
        <span className="text-xs uppercase tracking-wider text-[var(--color-brand-300)] font-medium">
          Operations Lab
        </span>
        <h1 className="text-2xl md:text-3xl font-bold tracking-tight mt-1 mb-2">SmartSlot Lite</h1>
        <p className="text-[var(--color-text-secondary)] max-w-2xl text-sm leading-relaxed">
          Sube un <code className="text-[var(--color-text-primary)]">picking.csv</code> (SKU + frecuencia de
          salidas) y te sugerimos qué referencias colocar más cerca de expedición para reducir el recorrido de
          picking.
        </p>
      </div>

      <div className="max-w-xl mb-8">
        <CSVUploader
          label="picking.csv"
          description="Columnas: SKU y frecuencia de picking (nº de salidas en el periodo)."
          fileName={fileName}
          onFile={handleFile}
        />
      </div>

      {!rows && (
        <div className="card p-12 text-center fade-in">
          <LayoutGrid size={28} className="text-[var(--color-text-muted)] mx-auto mb-3" />
          <p className="text-sm text-[var(--color-text-muted)]">
            Sube tu histórico de picking para ver la propuesta de slotting.
          </p>
        </div>
      )}

      {rows && summary && (
        <div className="space-y-5 fade-in">
          {warnings.length > 0 && (
            <div className="card p-4 border-[var(--color-warning)]/30 bg-[var(--color-warning)]/5">
              <div className="flex items-start gap-2">
                <FileWarning size={15} className="text-[var(--color-warning)] mt-0.5 shrink-0" />
                <ul className="text-xs text-[var(--color-text-secondary)] space-y-1">
                  {warnings.map((w, i) => (
                    <li key={i}>{w}</li>
                  ))}
                </ul>
              </div>
            </div>
          )}

          <div className="card p-6">
            <h3 className="text-sm font-medium text-[var(--color-text-secondary)] mb-6 text-center">
              Mapa de zonas recomendado
            </h3>
            <WarehouseZoneDiagram summary={summary} />
          </div>

          <div className="card p-6">
            <h3 className="text-sm font-medium text-[var(--color-text-secondary)] mb-4">
              Slotting por referencia (ordenado por frecuencia)
            </h3>
            <SlottingTable rows={rows} />
          </div>
        </div>
      )}
    </AppLayout>
  );
}
