export function RouteLoadingFallback() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[var(--color-canvas)]">
      <div className="flex flex-col items-center gap-3">
        <div className="w-8 h-8 rounded-full border-2 border-[var(--color-border-strong)] border-t-[var(--color-brand-500)] animate-spin" />
        <span className="text-xs text-[var(--color-text-muted)]">Cargando módulo…</span>
      </div>
    </div>
  );
}
