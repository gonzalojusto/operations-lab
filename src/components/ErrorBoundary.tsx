import { Component, type ErrorInfo, type ReactNode } from 'react';
import { AlertTriangle } from 'lucide-react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
}

export class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false };

  static getDerivedStateFromError(): State {
    return { hasError: true };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    // En un entorno productivo real esto se enviaría a un servicio de
    // observabilidad (Sentry, etc.). Aquí solo lo dejamos trazado en consola.
    console.error('Operations Lab crashed:', error, info);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-[var(--color-canvas)] text-[var(--color-text-primary)] px-6">
          <div className="card p-8 max-w-md text-center">
            <AlertTriangle size={28} className="text-[var(--color-warning)] mx-auto mb-4" />
            <h1 className="text-lg font-semibold mb-2">Algo ha ido mal</h1>
            <p className="text-sm text-[var(--color-text-secondary)] mb-6">
              Ha ocurrido un error inesperado. Tus datos no se han guardado en ningún servidor, así que puedes
              recargar la página con seguridad y empezar de nuevo.
            </p>
            <button onClick={() => window.location.reload()} className="btn-primary px-5 py-2.5 text-sm font-medium">
              Recargar la página
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}
