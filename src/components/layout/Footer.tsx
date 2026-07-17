import { Mail } from 'lucide-react';

export function Footer() {
  return (
    <footer className="mt-16 pt-6 border-t border-[var(--color-border)] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs text-[var(--color-text-muted)]">
      <span>Creado por Gonzalo Justo · Operations Lab</span>
      <a
        href="mailto:gonzalo.justo@gmail.com?subject=Operations%20Lab%20%E2%80%94%20contacto"
        className="flex items-center gap-1.5 hover:text-[var(--color-text-secondary)] transition-colors"
      >
        <Mail size={13} /> gonzalo.justo@gmail.com
      </a>
    </footer>
  );
}
