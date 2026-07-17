import { useState } from 'react';
import { FileDown, Loader2 } from 'lucide-react';
import { generatePDFReport } from '../../services/pdfGenerator';
import type { CompanyInfo, ScoreResult } from '../../types';

interface PDFButtonProps {
  company: CompanyInfo;
  result: ScoreResult;
  radarElement: HTMLElement | null;
}

export function PDFButton({ company, result, radarElement }: PDFButtonProps) {
  const [loading, setLoading] = useState(false);

  const handleClick = async () => {
    setLoading(true);
    try {
      await generatePDFReport(company, result, radarElement);
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleClick}
      disabled={loading}
      className="btn-primary flex items-center gap-2 px-5 py-3 text-sm font-medium disabled:opacity-60"
    >
      {loading ? <Loader2 size={16} className="animate-spin" /> : <FileDown size={16} />}
      {loading ? 'Generando PDF…' : 'Descargar informe PDF'}
    </button>
  );
}
