import { useRef, useState } from 'react';
import { UploadCloud, CheckCircle2, Loader2, FileWarning } from 'lucide-react';

interface CSVUploaderProps {
  label: string;
  description: string;
  fileName?: string;
  onFile: (file: File) => Promise<void>;
}

export function CSVUploader({ label, description, fileName, onFile }: CSVUploaderProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFile = async (file: File) => {
    if (!file.name.toLowerCase().endsWith('.csv')) {
      setError('El archivo debe ser un .csv');
      return;
    }
    setError(null);
    setLoading(true);
    try {
      await onFile(file);
    } catch {
      setError('No se pudo procesar el archivo. Revisa el formato.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className={`card p-5 border-dashed cursor-pointer transition-colors ${
        fileName ? 'border-[var(--color-success)]/40' : 'hover:border-[var(--color-border-strong)]'
      }`}
      onClick={() => inputRef.current?.click()}
      onDragOver={(e) => e.preventDefault()}
      onDrop={(e) => {
        e.preventDefault();
        const file = e.dataTransfer.files?.[0];
        if (file) handleFile(file);
      }}
    >
      <input
        ref={inputRef}
        type="file"
        accept=".csv"
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) handleFile(file);
        }}
      />
      <div className="flex items-start gap-3">
        <div className="w-9 h-9 rounded-[var(--radius-md)] bg-[var(--color-brand-500)]/10 flex items-center justify-center shrink-0">
          {loading ? (
            <Loader2 size={16} className="text-[var(--color-brand-500)] animate-spin" />
          ) : fileName ? (
            <CheckCircle2 size={16} className="text-[var(--color-success)]" />
          ) : (
            <UploadCloud size={16} className="text-[var(--color-brand-500)]" />
          )}
        </div>
        <div className="min-w-0">
          <p className="text-sm font-medium">{label}</p>
          <p className="text-xs text-[var(--color-text-secondary)] mt-0.5">
            {fileName ? `Cargado: ${fileName}` : description}
          </p>
          {error && (
            <p className="text-xs text-[var(--color-danger)] mt-1 flex items-center gap-1">
              <FileWarning size={12} /> {error}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
