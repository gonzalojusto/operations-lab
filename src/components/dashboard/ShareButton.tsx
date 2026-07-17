import { useState } from 'react';
import { Check, Share2 } from 'lucide-react';
import { buildShareUrl } from '../../utils/shareState';
import type { Answers, CompanyInfo } from '../../types';

interface ShareButtonProps {
  company: CompanyInfo;
  answers: Answers;
}

export function ShareButton({ company, answers }: ShareButtonProps) {
  const [copied, setCopied] = useState(false);

  const handleClick = async () => {
    const url = buildShareUrl(company, answers);
    try {
      await navigator.clipboard.writeText(url);
    } catch {
      // Fallback si el navegador bloquea la Clipboard API (p.ej. sin HTTPS)
      window.prompt('Copia este enlace para compartir tu resultado:', url);
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <button onClick={handleClick} className="btn-secondary flex items-center gap-2 px-4 py-2.5 text-sm">
      {copied ? <Check size={14} className="text-[var(--color-success)]" /> : <Share2 size={14} />}
      {copied ? 'Enlace copiado' : 'Compartir resultado'}
    </button>
  );
}
